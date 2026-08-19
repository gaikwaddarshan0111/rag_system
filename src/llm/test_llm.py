from src.llm.generator import generate_answer

prompt = """
What is Python?
Who is Darshan Gaikwad?
Give a short answer.
"""

answer = generate_answer(prompt)

print("\n============= LLM ANSWER =============\n")
print(answer)