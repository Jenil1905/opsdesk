import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "OpsDesk Incident Hub"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql+psycopg://opsdesk:opsdesk_secret@localhost:5432/opsdesk"
    )

    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()
