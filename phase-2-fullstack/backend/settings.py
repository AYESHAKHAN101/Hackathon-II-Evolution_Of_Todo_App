from pydantic_settings import BaseSettings, SettingsConfigDict
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent


class Settings(BaseSettings):
    database_url: str
    better_auth_secret: str
    frontend_url: str = "http://localhost:3000"
    debug: bool = False
    access_token_expire_minutes: int = 30

    model_config = SettingsConfigDict(
        env_file=BASE_DIR / ".env",
        env_file_encoding="utf-8"
    )


settings = Settings()
