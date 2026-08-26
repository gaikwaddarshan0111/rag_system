from pathlib import Path

from fastapi import (
    FastAPI,
    Request,
    UploadFile,
    File,
    Depends,
    Form
)

from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from src.vectordb.index_documents import index_document
from src.api.routes import router
from src.api.auth_routes import router as auth_router

from src.auth.dependencies import require_admin
from src.auth.database import SessionLocal
from src.auth.models import Document
from src.api.document_routes import router as document_router


app = FastAPI(
    title="RAG SYSTEM",
    description="Document-Based RAG application",
    version="1.0.0"
)


# =========================================================
# DIRECTORIES
# =========================================================

BASE_DIR = Path(__file__).resolve().parent

UPLOAD_DIR = BASE_DIR / "data" / "uploads"

UPLOAD_DIR.mkdir(
    parents=True,
    exist_ok=True
)


# =========================================================
# STATIC FILES
# =========================================================

app.mount(
    "/static",
    StaticFiles(directory="static"),
    name="static"
)


# =========================================================
# TEMPLATES
# =========================================================

templates = Jinja2Templates(
    directory="templates"
)


# =========================================================
# HOME
# =========================================================

@app.get("/")
async def home(request: Request):

    return templates.TemplateResponse(
        request=request,
        name="index.html",
        context={
            "request": request
        }
    )


# =========================================================
# TRAIN - UPLOAD DOCUMENT
# ADMIN ONLY
# =========================================================

@app.post("/train")
async def train_document(

    file: UploadFile = File(...),

    category: str = Form(...),

    current_user=Depends(require_admin)

):

    # =====================================================
    # VALIDATE CATEGORY
    # =====================================================

    allowed_categories = {

        "salesforce",
        "non_sf",
        "telecom"

    }

    category = category.strip().lower()


    if category not in allowed_categories:

        return {

            "status": "error",

            "message": (
                "Invalid category. "
                "Allowed categories: "
                "salesforce, non_sf, telecom."
            )

        }


    # =====================================================
    # VALIDATE FILE
    # =====================================================

    allowed_extensions = {
        ".pdf"
    }


    if not file.filename:

        return {

            "status": "error",

            "message": "Filename is required."

        }


    extension = Path(
        file.filename
    ).suffix.lower()


    if extension not in allowed_extensions:

        return {

            "status": "error",

            "message": (
                "Currently only PDF files "
                "are supported."
            )

        }


    # =====================================================
    # CATEGORY FOLDER
    # =====================================================

    category_dir = (
        UPLOAD_DIR / category
    )


    category_dir.mkdir(
        parents=True,
        exist_ok=True
    )


    # =====================================================
    # SAFE FILE NAME
    # =====================================================

    filename = Path(
        file.filename
    ).name


    file_path = (
        category_dir / filename
    )


    # =====================================================
    # READ FILE
    # =====================================================

    contents = await file.read()


    # =====================================================
    # SAVE FILE
    # =====================================================

    with open(
        file_path,
        "wb"
    ) as buffer:

        buffer.write(
            contents
        )


    print(
        "\n======= TRAINING ==========="
    )

    print(
        f"Uploaded: {filename}"
    )

    print(
        f"Category: {category}"
    )

    print(
        f"Uploaded by: "
        f"{current_user['username']}"
    )


    # =====================================================
    # DATABASE
    # =====================================================

    db = SessionLocal()


    document_record = Document(

        filename=filename,

        category=category,

        file_path=str(
            file_path
        ),

        file_size=len(
            contents
        ),

        chunk_count=0,

        status="uploading",

        uploaded_by=current_user[
            "username"
        ]

    )


    db.add(
        document_record
    )

    db.commit()

    db.refresh(
        document_record
    )


    try:

        # =================================================
        # INDEX DOCUMENT
        # =================================================

        result = index_document(
            str(file_path),
            category
        )


        chunk_count = result[
            "chunks"
        ]


        print(
            f"Chunks: {chunk_count}"
        )

        print(
            f"Source: "
            f"{result['source']}"
        )


        # =================================================
        # UPDATE DOCUMENT
        # =================================================

        document_record.chunk_count = (
            chunk_count
        )

        document_record.status = (
            "indexed"
        )


        db.commit()


        print(
            "======== TRAINING "
            "COMPLETE ========\n"
        )


        return {

            "status": "success",

            "id": document_record.id,

            "filename": filename,

            "category": category,

            "size": len(
                contents
            ),

            "chunks": chunk_count,

            "message": (
                "Document indexed "
                "successfully."
            )

        }


    except Exception as error:

        # =================================================
        # MARK FAILED
        # =================================================

        document_record.status = (
            "failed"
        )


        db.commit()


        print(
            f"TRAINING ERROR: "
            f"{error}"
        )


        return {

            "status": "error",

            "id": document_record.id,

            "filename": filename,

            "category": category,

            "message": str(
                error
            )

        }


    finally:

        db.close()

@app.get("/health")
async def health_check():

    return{
        "status": "healthy",
        "service": "RAG SYSTEM"
    }

# =========================================================
# ROUTERS
# =========================================================

app.include_router(
    router
)

app.include_router(
    auth_router
)

app.include_router(
    document_router
)