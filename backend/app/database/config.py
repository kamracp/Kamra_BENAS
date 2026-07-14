from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    APP_NAME: str = "Kamra BENAS"

    DATABASE_URL: str = (
        "postgresql+psycopg2://postgres:postgres@127.0.0.1:5432/benas"
    )

    # JWT settings — override SECRET_KEY via .env in production
    SECRET_KEY: str = "change-this-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours

    class Config:
        env_file = ".env"


settings = Settings()
