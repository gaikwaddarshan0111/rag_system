from pathlib import Path

from fastapi import FastAPI , Request , UploadFile, File
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from src.vectordb.index_documents import index_document
from src.api.routes import router
from src.api.auth_routes import router as auth_router

app = FastAPI(
    title="RAG SYSTEM",
    description="Document-Based RAG application",
    version="1.0.0"

)

# ==============================
# DIRECTORIES
# ==============================

BASE_DIR = Path(__file__).resolve().parent

UPLOAD_DIR = BASE_DIR / "data" / "uploads"

UPLOAD_DIR.mkdir(
    parents=True,
    exist_ok=True
)


# ==============================
# STATIC FILES
# ==============================

app.mount(
    "/static",
    StaticFiles(directory="static"),
    name="static"
)


# =============================
# TEMPLATES
# =============================

templates = Jinja2Templates(
    directory="templates"
)


#==========================
# HOME
#=========================

@app.get("/")
async def home(request: Request):

    return templates.TemplateResponse(
        request=request,
        name="index.html",
        context={
            "request": request
        }
    )

# ===================================
# TRAIN - UPLOAD DOCUMENT
# ==================================

@app.post("/train")
async def train_document(
    file: UploadFile = File(...)

):
    # Check file extension
    allowed_extensions = {
        ".pdf"
    }

    extension = Path(file.filename).suffix.lower()

    if extension not in allowed_extensions:

        return{
            "status":"error",
            "message": "Currently only PDF files are supported."
        }

    # Save uploaded file

    file_path = UPLOAD_DIR / file.filename

    contents = await file.read()

    with open(file_path, "wb") as buffer:
        buffer.write(contents)

    print(f"\n======= TRAINING ===========")
    print(f"Uploaded: {file.filename}")


    try:

        #Run existing RAG indexing pipeline
        result = index_document(
            str(file_path)
        )

        print(f"Chunks: {result['chunks']}")
        print(f"Source: {result['source']}")
        print("======== TRANING COMPLETE========\n")


        return {
            "status":"success",
            "filename": file.filename,
            "size": len(contents),
            "chunks": result["chunks"],
            "message": "Document indexed successfully."
        }

    except Exception as error:

        print(
            f"TRAINING ERROR: {error}"

        )

        return {
            "status": "error",
            "filename" : file.filename,
            "message" : str(error)
        }

app.include_router(router)
app.include_router(auth_router)
