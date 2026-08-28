from src.embeddings.embedder import create_embeddings
from src.vectordb.chroma_store import collection


DEFAULT_TOP_K = 5

MAX_DISTANCE = 1.20

def retrieve_documents(
        question: str,
        top_k: int = DEFAULT_TOP_K
):

    question = question.strip()

    if not question:
        return[]

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

    # ====================================
    # PROCESS RESULTS
    # ====================================

    for i, document in enumerate(documents):

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


        # -----------------------------------
        # RELEVANCE FILTER
        # -----------------------------------

        if distance is not None:

            if distance > MAX_DISTANCE:

                print(
                    f"Skipping irrelevant result:"
                    f"{metadata.get('source', 'Unknown')}"
                    f"(distance={distance:.4f})"
                )


                continue


        # -------------------------------------
        # DUPLICATE PROTECTION
        # -------------------------------------

        source = metadata.get(
            "source",
            "Unknown"
        )

        chunk_index = metadata.get(
            "chunk_index"
        )

        duplicate = any(
            item["metadata"].get("source") == source
            and item["metadata"].get("chunk_index") == chunk_index
            for item in retrieved
        )

        if duplicate:
            continue


        # -------------------------------------
        # ADD RESULT
        # -------------------------------------

        retrieved.append(
            {
                "document": document,
                "metadata": metadata,
                "distance": distance
            }
        )


    # =========================================
    # LOGGING
    # =========================================

    print(
        f"Retrieved {len(retrieved)} relevant documents"
        f"(automatic category retrieval)"
    )


    return retrieved