from pathlib import Path
from pypdf import PdfReader


def load_pdf(file_path: str) -> str:
    print(f"Reading PDF: {file_path}")

    reader = PdfReader(file_path)

    print(f"Number of pages: {len(reader.pages)}")

    text = ""

    for page_number, page in enumerate(reader.pages, start=1):
        page_text = page.extract_text()

        print(f"Page {page_number}: {len(page_text or '')} characters")

        if page_text:
            text += page_text + "\n"

    return text


if __name__ == "__main__":
    pdf_path = Path("data/darshan_policy.pdf")

    print(f"Looking for PDF at: {pdf_path}")
    print(f"File exists: {pdf_path.exists()}")

    text = load_pdf(str(pdf_path))

    print("\n========== EXTRACTED TEXT ==========\n")
    print(text)
    print("\n========== END ==========")