def build_prompt(context, question):

    prompt = f"""
You are a helpful company policy assistant.

Use ONLY the information provided in the context to answer the question.

If the answer is not present in the context, say:
"I don't have enough information in the provided documents."

Do not make up information.

Context:
{context}

Question:
{question}

Answer:
"""

    return prompt 