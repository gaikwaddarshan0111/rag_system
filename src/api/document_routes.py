from datetime import datetime

from fastapi import APIRouter, Depends
from pydantic import BaseModel

from src.auth.dependencies import get_current_user
from src.auth.database import SessionLocal
from src.auth.models import Document


router = APIRouter(
    prefix="/documents",
    tags=["Documents"]
)


# ===============================
# Response Schema
# ===============================


class DocumentResponse(BaseModel):

    id: int
    filename: str
    category: str
    file_size: int
    chunk_count: int
    status: str
    uploaded_by: str
    created_at: datetime
    updated_at: datetime

# ==============================
# GET DOCUMENTS
# ==============================

@router.get(
    "",
    response_model=list[DocumentResponse]
)

def get_documents(
    current_user=Depends(get_current_user)
):

    db = SessionLocal()

    try:

        documents = (
            db.query(Document)
            .order_by(
                Document.created_at.desc()
            )
            .all()
        )

        return documents

    finally:
        db.close()