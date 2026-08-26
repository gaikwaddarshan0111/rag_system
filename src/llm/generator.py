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