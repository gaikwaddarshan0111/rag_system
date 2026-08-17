import chromadb

client = chromadb.PersistentClient(
    path="./vector_db"

)

collection = client.get_or_create_collection(
    name="company_policy"
)


def add_documnets(chunks, embeddings):
    ids = [f"chunk={i}" for i in range(len(chunks))]

    metadatas=[
        {"source": "company_policy.txt"}

        for _ in chunks
    ]

    collection.add(
        ids=ids,

        documents = chunks,

        embeddings=embeddings.tolist(),

        metadata = metadatas
    )

    print(f"Added {len(chunks)} chunks to ChromaDB")