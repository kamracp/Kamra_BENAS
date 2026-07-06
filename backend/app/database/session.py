from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.database.config import settings
# ❌ पुरानी लाइन (इसे हटाएं):
# from app.database import get_db

#  नई सही लाइन (इसे लिखें):

engine = create_engine(
    settings.DATABASE_URL,
    echo=True,
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()