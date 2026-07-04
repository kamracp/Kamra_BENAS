from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    APP_NAME: str = "Kamra BENAS"

    DATABASE_URL: str = (
        "postgresql+psycopg2://postgres:postgres@127.0.0.1:5432/benas"
    )

    class Config:
        env_file = ".env"


settings = Settings()