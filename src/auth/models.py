from sqlalchemy import Boolean, Integer, String , DateTime
from sqlalchemy.orm import Mapped, mapped_column

from .database import Base
from datetime import datetime

class User(Base):

    __tablename__ = "users"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True
    )

    username: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        index=True,
        nullable=False
    )

    password_hash: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    role: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        default="agent"
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=True
    )

# ===============================================
# DOCUMENT
# ===============================================

class Document(Base):

    __tablename__ = "documents"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True
    )

    # Original filename
    filename: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )

    # Salesforce / Non-SF / Telecom
    category: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        index=True

    )

    # Physical location of uploaded document
    file_path: Mapped[str] = mapped_column(
        String(500),
        nullable=False
    )

    # File size in bytes
    file_size: Mapped[int] = mapped_column(
        Integer,
        nullable=False
    )

    # Number of chunks created during indexing
    chunk_count: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0
    )

    # uploading / indexed / failed
    status: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        default="uploading"
    )

    # Username of the admin who uploaded it
    uploaded_by: Mapped[str] = mapped_column(
        String(100),
        nullable=False
    )

    created_at: Mapped[datetime] = mapped_column(
    DateTime,
    default=datetime.utcnow,
    nullable=False
)

    updated_at: Mapped[datetime] = mapped_column(
    DateTime,
    default=datetime.utcnow,
    onupdate=datetime.utcnow,
    nullable=False
)