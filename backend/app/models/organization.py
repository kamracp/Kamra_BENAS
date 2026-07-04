from sqlalchemy import Boolean
from sqlalchemy import Column
from sqlalchemy import DateTime
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import func

from app.database.base import Base


class Organization(Base):
    __tablename__ = "organizations"

    id = Column(Integer, primary_key=True, index=True)

    organization_code = Column(
        String(30),
        unique=True,
        nullable=False,
        index=True,
    )

    organization_name = Column(
        String(200),
        nullable=False,
        index=True,
    )

    legal_name = Column(String(250), nullable=True)
    industry = Column(String(120), nullable=True)

    email = Column(String(255), nullable=True)
    phone = Column(String(50), nullable=True)
    website = Column(String(250), nullable=True)

    country = Column(String(120), nullable=True)
    state = Column(String(120), nullable=True)
    city = Column(String(120), nullable=True)

    timezone = Column(String(80), nullable=True)
    currency = Column(String(20), nullable=True)

    is_active = Column(
        Boolean,
        nullable=False,
        default=True,
        server_default="true",
    )

    created_at = Column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )

    updated_at = Column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )