from src.ingestion.loader import load_pdf
from src.chunking.chunker import chunk_text

def process_pdf(file_path: str):
    text = load_pdf(file_path)

    chunks = chunk_text(
        text,
        chunk_size=100,
        overlap=20
    )

    return chunks

if __name__ == "__main__":
    file_path = "data/company_policy.pdf"


    chunks = process_pdf(file_path)

    print(f"Total chnuks: {len(chunks)}")

    for i, chunk in enumerate(chunks, start=1):
        print(f"\n--- Chunk {i} ---")
        print(chunk)