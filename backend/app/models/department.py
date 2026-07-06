from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class Department(Base):
    __tablename__ = "departments"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    # ------------------------------------------------------------------
    # Organization
    # ------------------------------------------------------------------

    organization_id: Mapped[int] = mapped_column(
        ForeignKey("organizations.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    # ------------------------------------------------------------------
    # Identity
    # ------------------------------------------------------------------

    department_code: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        index=True,
    )

    department_name: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
        index=True,
    )

    # ------------------------------------------------------------------
    # Description
    # ------------------------------------------------------------------

    description: Mapped[str | None] = mapped_column(
        String(500),
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