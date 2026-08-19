from src.retrieval.retriever import retrieve_documents

query = "What is the company's leave policy?"

results = retrieve_documents(query)

print("\n======== RETRIEVED DOCUMENTS =========\n")

for documents in results["documents"][0]:
    print(documents)
    print("\n------------------------------------------------\n")
