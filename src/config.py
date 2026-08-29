import os

from dotenv import load_dotenv

load_dotenv()


# ==================
# Application
# ==================

APP_NAME = os.getenv(
    "APP_NAME",
    "RAG SYSTEM"
)


# ====================
# SECURITY
# ===================

SECRET_KEY = os.getenv(
    "SECRET_KEY"
)

if not SECRET_KEY:
    raise RuntimeError(
        "SECRET_KEY is not configured."
    )

# ===============
# LLM
# ===============

LLM_PROVIDER = os.getenv(
    "LLM_PROVIDER",
    "ollama"
).lower()


OLLAMA_MODEL = os.getenv(
    "OLLAMA_MODEL",
    "qwen2.5:3b"
)


OPENAI_API_KEY = os.getenv(
    "OPENAI_API_KEY"
)

OPENAI_MODEL = os.getenv(
    "OPENAI_MODEL",
    "gpt-40-mini"
)

# =========================================================
# STORAGE
# =========================================================

VECTOR_DB_PATH = os.getenv(
    "VECTOR_DB_PATH",
    "./vector_db"
)


DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "sqlite:///./data/app.db"
)


# =========================================================
# UPLOADS
# =========================================================

MAX_UPLOAD_SIZE_MB = int(
    os.getenv(
        "MAX_UPLOAD_SIZE_MB",
        "20"
    )
)


ALLOWED_EXTENSIONS = {
    ".pdf"
}



# =========================================================
# WEB SEARCH
# =========================================================

TAVILY_API_KEY = os.getenv(
    "TAVILY_API_KEY"
)


WEB_SEARCH_PROVIDER = os.getenv(
    "WEB_SEARCH_PROVIDER",
    "tavily"
).lower()