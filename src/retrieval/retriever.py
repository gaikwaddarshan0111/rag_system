from src.embeddings.embedder import create_embeddings
from src.vectordb.chroma_store import collection


def retrieve_documents(query, top_k=3):

    query_embedding = create_embeddings([query])[0]

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k
    )

    print("\nDEBUG - chroma result type:", type(results))
    print("DEBUG - chroma result keys:", results.keys())
    return results["documents"][0]