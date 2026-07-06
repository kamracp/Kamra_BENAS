from datetime import datetime

from sqlalchemy import Boolean, DateTime, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class Organization(Base):
    __tablename__ = "organizations"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    # ------------------------------------------------------------------
    # Identity
    # ------------------------------------------------------------------

    organization_code: Mapped[str] = mapped_column(
        String(30),
        unique=True,
        nullable=False,
        index=True,
    )

    organization_name: Mapped[str] = mapped_column(
        String(200),
        unique=True,
        nullable=False,
        index=True,
    )

    legal_name: Mapped[str | None] = mapped_column(
        String(250),
        nullable=True,
    )

    # ------------------------------------------------------------------
    # Business
    # ------------------------------------------------------------------

    industry: Mapped[str | None] = mapped_column(
        String(120),
        nullable=True,
    )

    gstin: Mapped[str | None] = mapped_column(
        String(15),
        unique=True,
        nullable=True,
    )

    pan: Mapped[str | None] = mapped_column(
        String(10),
        unique=True,
        nullable=True,
    )

    # ------------------------------------------------------------------
    # Contact
    # ------------------------------------------------------------------

    email: Mapped[str | None] = mapped_column(
        String(200),
        nullable=True,
    )

    phone: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True,
    )

    website: Mapped[str | None] = mapped_column(
        String(250),
        nullable=True,
    )

    # ------------------------------------------------------------------
    # Address
    # ------------------------------------------------------------------

    address_line_1: Mapped[str | None] = mapped_column(
        String(250),
        nullable=True,
    )

    address_line_2: Mapped[str | None] = mapped_column(
        String(250),
        nullable=True,
    )

    city: Mapped[str | None] = mapped_column(
        String(120),
        nullable=True,
    )

    state: Mapped[str | None] = mapped_column(
        String(120),
        nullable=True,
    )

    country: Mapped[str | None] = mapped_column(
        String(120),
        nullable=True,
    )

    pincode: Mapped[str | None] = mapped_column(
        String(20),
        nullable=True,
    )

    # ------------------------------------------------------------------
    # Regional
    # ------------------------------------------------------------------

    timezone: Mapped[str | None] = mapped_column(
        String(80),
        nullable=True,
    )

    currency: Mapped[str | None] = mapped_column(
        String(20),
        nullable=True,
    )

    # ------------------------------------------------------------------
    # System
    # ------------------------------------------------------------------

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )