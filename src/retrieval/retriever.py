from src.embeddings.embedder import create_embeddings
from src.vectordb.chroma_store import collection


DEFAULT_TOP_K = 10


def retrieve_documents(
        question: str,
        top_k: int = DEFAULT_TOP_K
):

    question = question.strip()

    if not question:
        return[]

    # =========================================
    # CREATE QUESTION EMBEDDING
    # ========================================
    
    question_embedding = create_embeddings(
        [question]
    )[0]

    # =========================================
    # SEARCH CHROMADB
    # =========================================

    results = collection.query(
         query_embeddings=[
              question_embedding.tolist()
         ],
         n_results=top_k
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

    # ========================================
    # RETURN ALL TOP-K RESULTS
    # ========================================
    for i , document in enumerate(documents):

         metadata = (
              metadatas[i]
              if i < len(metadatas)
              else {}
         )
         distance = (
            distances[i]
            if i < len(distances)
            else None
        )

         source = metadata.get(
            "source",
            "Unknown"
        )

         chunk_index = metadata.get(
            "chunk_index"
        )

         print(
            f"Candidate: {source}"
            f" | chunk={chunk_index}"
            f" | distance={distance:.4f}"
            if distance is not None
            else
            f"Candidate: {source}"
            f" | chunk={chunk_index}"
        )

         retrieved.append(
            {
                "document": document,
                "metadata": metadata,
                "distance": distance
            }
        )

    # =====================================================
    # LOGGING
    # =====================================================

    print(
        f"Retrieved {len(retrieved)} documents"
        f" from company knowledge base"
    )

    return retrieved

