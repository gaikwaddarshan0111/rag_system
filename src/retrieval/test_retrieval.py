from src.retrieval.retriever import retrieve_documents

question = "How many annual leaves does an employee get?"


results = retrieve_documents(
    question,
    top_k=3
)

print("\n======== RETRIEVED RESULTS ============\n")

for i , results in enumerate(
    results,
    start=1
):
    print(
        f"Result {i}"
    )

    print(
        "Source:",
        results["metadata"].get("source")
    )

    print(
        "Distance:",
        results["distance"]
    )

    print(
        "Document:"
    )

    print(
        results["document"]
    )

    print(
        "\n--------------------------------\n"
    )
      
