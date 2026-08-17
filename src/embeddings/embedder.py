from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")


def create_embeddings(texts: list[str]):
    embeddings = model.encode(texts)


    return embeddings

if __name__ == "__main__":
    texts = [
        "Employees receive 24 working days of annual leave per year",
        "Employees can work remotely up to 4 days per month"
    ]

    embeddings = create_embeddings(texts)

    print("Number of embeddings:", len(embeddings))
    print("Embeddings size:", len(embeddings[0]))

    print("\n First embedding:")
    print(embeddings[0])