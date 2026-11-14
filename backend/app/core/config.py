import os

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg://app:app@localhost:5432/app",
)

CORS_ORIGINS = ["http://localhost:5173","http://127.0.0.1:5173"]
