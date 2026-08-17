from src.ingestion.loader import load_pdf
from src.chunking.chunker import chunk_text
from src.embeddings.embedder import create_embeddings
from src.vectordb.chroma_store import add_documnets


file_path = "data/company_policy.pdf"


text = load_pdf(file_path)

chunks = chunk_text(
    text,
    chunk_size=100,
    overlap=20
)

print(f"Created {len(chunks)} chunks")

embeddings = create_embeddings(chunks)

print(f"Created {len(embeddings)} embeddings")

add_documnets(
    chunks,
    embeddings
)