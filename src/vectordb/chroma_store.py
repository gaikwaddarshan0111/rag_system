import chromadb
import uuid

from src.config import VECTOR_DB_PATH
# =========================================================
# CHROMA CLIENT
# =========================================================

client = chromadb.PersistentClient(
    path=VECTOR_DB_PATH
)


# =========================================================
# COLLECTION
# =========================================================

collection = client.get_or_create_collection(
    name="company_policy"
)


# =========================================================
# ADD DOCUMENTS
# =========================================================

def add_documnets(
    chunks,
    embeddings,
    source,
    category
):
    """
    Add document chunks and embeddings to ChromaDB.

    Each chunk stores:
    - source
    - category
    - chunk_index
    """

    ids = [
        str(uuid.uuid4())
        for _ in chunks
    ]


    metadatas = [

        {
            "source": source,
            "category": category,
            "chunk_index": i
        }

        for i in range(
            len(chunks)
        )

    ]


    collection.add(

        ids=ids,

        documents=chunks,

        embeddings=embeddings.tolist(),

        metadatas=metadatas

    )


    print(
        f"Added {len(chunks)} chunks "
        f"to ChromaDB "
        f"[category={category}]"
    )


    return len(chunks)