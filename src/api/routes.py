from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
import traceback

from src.auth.dependencies import get_current_user
from src.retrieval.retriever import retrieve_documents
from src.prompts.prompts import build_prompt
from src.llm.generator import (
    generate_answer,
    check_answerability
)

from src.web_search.search import (
    search_web,
    build_web_context
)


router = APIRouter()


class AskRequest(BaseModel):
    question: str


class AskResponse(BaseModel):
    answer: str
    sources: list[str]


@router.post("/ask", response_model=AskResponse)
def ask_question(
    request: AskRequest,
    current_user=Depends(get_current_user)
):

    question = request.question.strip()

    if not question:

        raise HTTPException(
            status_code=400,
            detail="Question cannot be empty."
        )

    try:

        print(
            "\n================ ASK REQUEST ================"
        )

        print(
            f"Question: {question}"
        )

        print(
            "Category: Automatic"
        )


        # =====================================================
        # 1. SEARCH COMPANY KNOWLEDGE BASE
        # =====================================================

        print(
            "\n[1] Searching company knowledge base..."
        )

        results = retrieve_documents(
            question
        )

        print(
            f"Company KB results: {len(results)}"
        )


        # =====================================================
        # 2. PREPARE COMPANY CONTEXT
        # =====================================================

        company_context = ""

        answerable = False


        if results:

            print(
                "\n[2] Building company context..."
            )

            company_context = (
                "\n\n---\n\n".join(
                    result["document"]
                    for result in results
                )
            )

            print(
                f"Company context length: "
                f"{len(company_context)} characters"
            )


            # =================================================
            # 3. CHECK IF COMPANY CONTEXT ANSWERS QUESTION
            # =================================================

            print(
                "\n[3] Checking company context "
                "answerability..."
            )

            answerable = check_answerability(
                company_context,
                question
            )

            print(
                f"Company context answerable: "
                f"{answerable}"
            )


        else:

            print(
                "\nNo company documents found."
            )


        # =====================================================
        # 4. SELECT COMPANY KB OR WEB
        # =====================================================

        source_type = "company"

        web_results = []


        if answerable:

            print(
                "\nUsing company knowledge base."
            )

            context = company_context


        else:

            print(
                "\nCompany knowledge base "
                "cannot answer the question."
            )

            print(
                "Falling back to web search..."
            )


            # =================================================
            # 5. WEB SEARCH
            # =================================================

            web_results = search_web(
                question
            )

            print(
                f"Web results: {len(web_results)}"
            )


            if not web_results:

                print(
                    "No web results found."
                )

                return AskResponse(

                    answer=(
                        "I don't have enough "
                        "information to answer "
                        "this question."
                    ),

                    sources=[]
                )


            source_type = "web"


            # =================================================
            # 6. BUILD WEB CONTEXT
            # =================================================

            print(
                "\n[4] Building web context..."
            )

            context = build_web_context(
                web_results
            )

            print(
                f"Web context length: "
                f"{len(context)} characters"
            )


        # =====================================================
        # 7. BUILD FINAL PROMPT
        # =====================================================

        print(
            "\n[5] Building final prompt..."
        )

        prompt = build_prompt(
            context,
            question
        )

        print(
            f"Prompt length: {len(prompt)} characters"
        )


        # =====================================================
        # 8. GENERATE FINAL ANSWER
        # =====================================================

        print(
            "\n[6] Calling LLM..."
        )

        answer = generate_answer(
            prompt
        )

        print(
            "\n[7] LLM response:"
        )

        print(
            answer
        )


        # =====================================================
        # 9. BUILD SOURCES
        # =====================================================

        if source_type == "company":

            sources = list({

                result["metadata"].get(
                    "source",
                    "Unknown"
                )

                for result in results

            })


        else:

            sources = list({

                result.get(
                    "url",
                    ""
                )

                for result in web_results

                if result.get("url")

            })


        print(
            "\nSources:"
        )

        print(
            sources
        )


        print(
            "\n================ ASK COMPLETE ================\n"
        )


        # =====================================================
        # 10. RETURN RESPONSE
        # =====================================================

        return AskResponse(

            answer=answer,

            sources=sources

        )


    except Exception as error:

        print(
            "\n!!!!!!!!!!!!!!!! ASK ERROR !!!!!!!!!!!!!!!!"
        )

        print(
            f"Error type: {type(error).__name__}"
        )

        print(
            f"Error: {error}"
        )

        traceback.print_exc()

        print(
            "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n"
        )


        raise HTTPException(

            status_code=500,

            detail=str(error)

        )