import ollama

from src.config import (
    LLM_PROVIDER,
    OLLAMA_MODEL,
    OPENAI_API_KEY,
    OPENAI_MODEL
)


def generate_answer(
    prompt: str
) -> str:

    # =====================================================
    # LOCAL DEVELOPMENT — OLLAMA
    # =====================================================

    if LLM_PROVIDER == "ollama":

        response = ollama.chat(

            model=OLLAMA_MODEL,

            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]

        )

        return response[
            "message"
        ][
            "content"
        ]


    # =====================================================
    # DEPLOYMENT — OPENAI
    # =====================================================

    if LLM_PROVIDER == "openai":

        if not OPENAI_API_KEY:

            raise RuntimeError(
                "OPENAI_API_KEY is not configured."
            )


        from openai import OpenAI


        client = OpenAI(
            api_key=OPENAI_API_KEY
        )


        response = client.chat.completions.create(

            model=OPENAI_MODEL,

            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]

        )


        return response.choices[
            0
        ].message.content


    raise RuntimeError(
        f"Unsupported LLM_PROVIDER: "
        f"{LLM_PROVIDER}"
    )
# =========================================================
# CHECK CONTEXT ANSWERABILITY
# =========================================================

def check_answerability(
    context: str,
    question: str
) -> bool:

    prompt = f"""
You are a strict knowledge-base relevance checker.

Your task is to determine whether the CONTEXT contains
information that can directly answer the QUESTION.

The question does NOT need to use the same words as
the context. A paraphrase or equivalent question should
also be considered answerable.

Return ONLY one word:

YES

or

NO

Return YES when the context provides the information
needed to answer the question.

Return NO when the context only mentions the topic but
does not provide enough information to answer the question.

Example:

Context:
"Zoho CRM workflows can trigger actions when configured
criteria are satisfied."

Question:
"What can a Zoho CRM workflow do?"

Answer:
YES

Context:
"Zoho CRM workflows can trigger actions when configured
criteria are satisfied."

Question:
"What is Zoho CRM?"

Answer:
NO

Now evaluate the following.

CONTEXT:
{context}

QUESTION:
{question}

ANSWER:
"""

    response = generate_answer(
        prompt
    )

    response = response.strip().upper()

    print(
        f"Answerability model response: "
        f"{response}"
    )

    return response.startswith("YES")