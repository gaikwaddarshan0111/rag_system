from src.retrieval.retriever import retrieve_documents
from src.prompts.prompts import build_prompt

from src.llm.generator import generate_answer

def ask_question(question):


    # Retrive relevant chunks
    documents = retrieve_documents(question)

    print("\n=========== RETRIEVED DOCUMENTS ==================\n")

    for document in documents:
        print(document)
        print("\n----------------------------------------------")

    context = "\n\n".join(documents)

    print("\n================ CONTEXT SENT TO LLM ===============\n")
    print(context)

    prompt = build_prompt(
        context=context,
        question=question
    )

    print("\n=========== PROMPT ============\n")
    print(prompt)


    answer = generate_answer(prompt)


    return answer


if __name__ == "__main__":

    question = input("Ask a question: ")

    answer = ask_question(question)

    print("\n==========  RAG ANSWER ===========\n")
    print(answer)