from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
import traceback

from src.auth.dependencies import get_current_user
from src.retrieval.retriever import retrieve_documents
from src.prompts.prompts import build_prompt
from src.llm.generator import generate_answer




router = APIRouter()


class AskRequest(BaseModel):
    question: str
    category: str


class AskResponse(BaseModel):
    answer: str
    sources: list[str]


@router.post("/ask", response_model=AskResponse)
def ask_question(request: AskRequest, current_user=Depends(get_current_user)):

    question = request.question.strip()
    category = request.category.strip().lower()

    allowed_categories = {
        "salesforce",
        "non_sf",
        "telecom"
    }

    if category not in allowed_categories:

        raise HTTPException(
            status_code=400,
            detail="Invalid category."
        )

    if not question:
        raise HTTPException(
            status_code=400,
            detail="Question cannot be empty."
        )

    try:

        print("\n================ ASK REQUEST ================")
        print(f"Question: {question}")
        print(f"Category: {category}")

        # =========================
        # RETRIEVAL
        # =========================

        print("\n[1] Retrieving documents...")

        results = retrieve_documents(question, category=category)

        print(f"Retrieved {len(results)} documents")

        for i, result in enumerate(results, start=1):
            print(f"\nResult {i}")
            print(f"Source: {result['metadata'].get('source')}")
            print(f"Distance: {result.get('distance')}")
            print(f"Document: {result['document'][:200]}")


        # =========================
        # NO RESULTS
        # =========================

        if not results:

            print("No documents retrieved.")

            return AskResponse(
                answer="I don't have enough information in the provided documents.",
                sources=[]
            )


        # =========================
        # CONTEXT
        # =========================

        print("\n[2] Building context...")

        context = "\n\n---\n\n".join(
            result["document"]
            for result in results
        )

        print(f"Context length: {len(context)} characters")


        # =========================
        # PROMPT
        # =========================

        print("\n[3] Building prompt...")

        prompt = build_prompt(
            context,
            question
        )

        print(f"Prompt length: {len(prompt)} characters")


        # =========================
        # LLM
        # =========================

        print("\n[4] Calling Ollama...")

        answer = generate_answer(prompt)

        print("\n[5] LLM response:")
        print(answer)


        # =========================
        # SOURCES
        # =========================

        sources = list({
            result["metadata"].get(
                "source",
                "Unknown"
            )
            for result in results
        })

        print("\nSources:")
        print(sources)

        print("\n================ ASK COMPLETE ================\n")


        return AskResponse(
            answer=answer,
            sources=sources
        )


    except Exception as error:

        print("\n!!!!!!!!!!!!!!!! ASK ERROR !!!!!!!!!!!!!!!!")
        print(f"Error type: {type(error).__name__}")
        print(f"Error: {error}")

        traceback.print_exc()

        print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n")

        raise HTTPException(
            status_code=500,
            detail=str(error)
        )