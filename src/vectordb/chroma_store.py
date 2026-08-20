import chromadb
import uuid

client = chromadb.PersistentClient(
    path="./vector_db"

)

collection = client.get_or_create_collection(
    name="company_policy"
)


def add_documnets(chunks, embeddings, source):
    """
    Add document chunks and embeddings to ChromaDB.
    """

    ids = [
        str(uuid.uuid4())
        for _ in chunks
    ]

    metadatas=[
        {
            "source": source,
            "chunk_index": i
        }

        for i in range(len(chunks))

    ]


    collection.add(
        ids=ids,

        documents = chunks,

        embeddings=embeddings.tolist(),

        metadatas = metadatas,
    )

    print(f"Added {len(chunks)} chunks to ChromaDB")

    return len(chunks)