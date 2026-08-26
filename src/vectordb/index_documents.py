from pathlib import Path

from src.ingestion.loader import load_pdf
from src.chunking.chunker import chunk_text
from src.embeddings.embedder import create_embeddings
from src.vectordb.chroma_store import add_documnets


def index_document(file_path: str, category: str):
    print(f"\nReading document: {file_path}")

    # ==================
    # LOAD
    # ==================

    text = load_pdf(file_path)

    print(
        f"Extracted {len(text)} characters"
    )


    # =================
    # CHUNK
    # =================

    chunks = chunk_text(
        text,
        chunk_size=100,
        overlap=20
    )

    print(f"Created {len(chunks)} chunks")


    # ===================
    # EMBEDDINGS
    # ===================

    embeddings = create_embeddings(
        chunks
    )

    print(
        f"Created {len(embeddings)} embeddings"
    )

    # =================
    # CHROMADB
    # =================

    source = Path(file_path).name

    chunk_count = add_documnets(
        chunks,
        embeddings,
        source,
        category
    )

    print(
        f"Indexed {source} successfully"
    )

    return {
        "chunks": chunk_count,
        "source": source
    }

if __name__ == "__main__":

    result = index_document("data/company_policy.pdf", "Salesforce")

    print(result)