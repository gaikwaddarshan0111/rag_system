from src.retrieval.retriever import retrieve_documents
from src.prompts.prompts import build_prompt
from src.llm.generator import generate_answer


# =================================
# QUESTION
# =================================

user_question = (
    "How many annual leaves does an employee get?"
)


# =================================
# RETRIEVAL
# =================================

retrieved_results = retrieve_documents(
    user_question,
    top_k=3
)


print(
    "\n======== RETRIEVED DOCUMENTS ========\n"
)


for index, result in enumerate(
    retrieved_results,
    start=1
):

    print(
        f"Result {index}"
    )

    print(
        "Source:",
        result["metadata"].get("source")
    )

    print(
        "Distance:",
        result["distance"]
    )

    print(
        "Document:"
    )

    print(
        result["document"]
    )

    print(
        "\n--------------------------------\n"
    )


# =================================
# BUILD CONTEXT
# =================================

context = "\n\n---\n\n".join(
    result["document"]
    for result in retrieved_results
)


# =================================
# BUILD PROMPT
# =================================

prompt = build_prompt(
    context=context,
    question=user_question
)


print(
    "\n======== PROMPT ========\n"
)

print(prompt)


# =================================
# LLM
# =================================

answer = generate_answer(
    prompt
)


print(
    "\n======== ANSWER ========\n"
)

print(answer)