from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
import traceback
import time


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


# =====================================================
# RETRIEVAL CONFIGURATION
# =====================================================

STRONG_RETRIEVAL_DISTANCE = 0.75


# =====================================================
# REQUEST MODEL
# =====================================================

class AskRequest(BaseModel):

    question: str


# =====================================================
# RESPONSE MODEL
# =====================================================

class AskResponse(BaseModel):

    answer: str
    sources: list[str]


# =====================================================
# ASK QUESTION
# =====================================================

@router.post(
    "/ask",
    response_model=AskResponse
)
def ask_question(

    request: AskRequest,

    current_user=Depends(
        get_current_user
    )

):

    question = request.question.strip()


    # =================================================
    # VALIDATE QUESTION
    # =================================================

    if not question:

        raise HTTPException(
            status_code=400,
            detail="Question cannot be empty."
        )


    try:

        # =====================================================
        # TOTAL TIMER
        # =====================================================

        total_start = time.perf_counter()


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


        retrieval_start = time.perf_counter()


        results = retrieve_documents(
            question
        )


        retrieval_time = (
            time.perf_counter()
            - retrieval_start
        )


        print(
            f"Company KB results: {len(results)}"
        )

        print(
            f"⏱ Retrieval time: "
            f"{retrieval_time:.2f}s"
        )


        # =====================================================
        # SELECT BEST COMPANY KB RESULTS
        # =====================================================

        results = sorted(
            results,
            key=lambda x: (
                x["distance"]
                if x["distance"] is not None
                else float("inf")
            )
        )


        # Keep only the strongest chunks
        results = results[:3]


        # =====================================================
        # RETRIEVAL CONFIDENCE
        # =====================================================

        best_distance = (

            results[0]["distance"]

            if results
            and results[0]["distance"] is not None

            else None

        )


        strong_retrieval = (

            best_distance is not None

            and best_distance
            <= STRONG_RETRIEVAL_DISTANCE

        )


        print(
            f"\nBest retrieval distance: "
            f"{best_distance}"
        )


        print(
            f"Strong retrieval: "
            f"{strong_retrieval}"
        )


        print(
            f"Selected {len(results)} best "
            f"company KB chunks for company context."
        )


        for result in results:

            distance = result["distance"]

            print(
                f"Selected: "
                f"{result['metadata'].get('source', 'Unknown')}"
                f" | chunk="
                f"{result['metadata'].get('chunk_index')}"
                f" | distance="
                f"{distance:.4f}"
                if distance is not None
                else
                f"Selected: "
                f"{result['metadata'].get('source', 'Unknown')}"
                f" | chunk="
                f"{result['metadata'].get('chunk_index')}"
                f" | distance=None"
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
            # 3. CHECK COMPANY ANSWERABILITY
            # =================================================

            if strong_retrieval:

                print(
                    "\nStrong company KB match found."
                )

                print(
                    "Skipping answerability LLM."
                )


                answerable = True


            else:

                print(
                    "\n[3] Checking company context "
                    "answerability..."
                )


                answerability_start = (
                    time.perf_counter()
                )


                answerable = check_answerability(

                    company_context,

                    question

                )


                answerability_time = (

                    time.perf_counter()

                    - answerability_start

                )


                print(
                    f"Company context answerable: "
                    f"{answerable}"
                )


                print(
                    f"⏱ Answerability time: "
                    f"{answerability_time:.2f}s"
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

            web_start = time.perf_counter()


            web_results = search_web(
                question
            )


            web_time = (

                time.perf_counter()

                - web_start

            )


            print(
                f"Web results: "
                f"{len(web_results)}"
            )


            print(
                f"⏱ Web search time: "
                f"{web_time:.2f}s"
            )


            if not web_results:

                total_time = (

                    time.perf_counter()

                    - total_start

                )


                print(
                    f"⏱ TOTAL ASK TIME: "
                    f"{total_time:.2f}s"
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


            web_context_start = (
                time.perf_counter()
            )


            context = build_web_context(

                web_results

            )


            web_context_time = (

                time.perf_counter()

                - web_context_start

            )


            print(
                f"Web context length: "
                f"{len(context)} characters"
            )


            print(
                f"⏱ Web context build time: "
                f"{web_context_time:.2f}s"
            )


        # =====================================================
        # 7. BUILD FINAL PROMPT
        # =====================================================

        print(
            "\n[5] Building final prompt..."
        )


        prompt_start = time.perf_counter()


        prompt = build_prompt(

            context,

            question

        )


        prompt_time = (

            time.perf_counter()

            - prompt_start

        )


        print(
            f"Prompt length: "
            f"{len(prompt)} characters"
        )


        print(
            f"⏱ Prompt build time: "
            f"{prompt_time:.2f}s"
        )


        # =====================================================
        # 8. GENERATE FINAL ANSWER
        # =====================================================

        print(
            "\n[6] Calling LLM..."
        )


        llm_start = time.perf_counter()


        answer = generate_answer(

            prompt

        )


        llm_time = (

            time.perf_counter()

            - llm_start

        )


        print(
            f"⏱ Final LLM time: "
            f"{llm_time:.2f}s"
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


        # =====================================================
        # TOTAL TIME
        # =====================================================

        total_time = (

            time.perf_counter()

            - total_start

        )


        print(
            f"\n⏱ TOTAL ASK TIME: "
            f"{total_time:.2f}s"
        )


        print(
            "\n================ ASK COMPLETE ================\n"
        )


        # =====================================================
        # RETURN RESPONSE
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
            f"Error type: "
            f"{type(error).__name__}"
        )


        print(
            f"Error: "
            f"{error}"
        )


        traceback.print_exc()


        print(
            "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n"
        )


        raise HTTPException(

            status_code=500,

            detail=str(error)

        )