from src.embeddings.embedder import create_embeddings
from src.vectordb.chroma_store import collection


def retrieve_documents(
        question: str,
        category: str | None = None,
        top_k: int = 3
):

    # Create embedding for the question
    question_embedding = create_embeddings(
        [question]
    )[0]


    # ===================================
    # BUILD CHROMA QUERY
    # ===================================

    query_kwargs = {
        "query_embeddings": [
            question_embedding.tolist()
        ],

        "n_results": top_k
    }


    # ==============================
    # CATEGORY FILTER
    # ==============================
    if category:
        query_kwargs["where"] = {
            "category": category
        }
    # Search ChromaDB

    results = collection.query(
        **query_kwargs
        
    )

    documents = results.get(
        "documents",
        [[]]
    )[0]

    metadatas = results.get(
        "metadatas",
        [[]]
    )[0]

    distances = results.get(
        "distances",
        [[]]
    )[0]

    retrieved = []

    for i, document in enumerate(documents):

        retrieved.append(
            {
                "document": document,
                "metadata":(
                    metadatas[i]
                    if i < len(metadatas)
                    else {}

                ),

                "distance":(
                    distances[i]
                    if i < len(distances)
                    else None
                )
            }
        )

    return retrieved