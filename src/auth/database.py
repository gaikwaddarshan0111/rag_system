import os
from src.config import DATABASE_URL
from pathlib import Path


from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

# ===================
# DATABASE LOCATION
# ===================

BASE_DIR = Path(__file__).resolve().parents[2]

DATA_DIR = BASE_DIR / "data"

DATA_DIR.mkdir(
    exist_ok=True
)



# =====================================
# ENGINE
# =====================================

engine = create_engine(
    DATABASE_URL,
    connect_args={
        "check_same_thread": False
    }
)

# ==========================
# SESSION
# ==========================

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


# ==========================
# BASE
# ==========================

class Base(DeclarativeBase):
    pass


# ===========================
# DATABASE SESSION
# ==========================

def get_db():

    db = SessionLocal()

    try:

        yield db

    finally:
        db.close()