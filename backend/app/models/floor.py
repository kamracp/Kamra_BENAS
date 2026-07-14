from __future__ import annotations

from datetime import datetime

from sqlalchemy import (
    Boolean,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
    UniqueConstraint,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base


class Floor(Base):
    __tablename__ = "floors"

    __table_args__ = (
        UniqueConstraint(
            "organization_id",
            "floor_code",
            name="uq_floor_org_code",
        ),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    organization_id: Mapped[int] = mapped_column(
        ForeignKey("organizations.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    building_id: Mapped[int] = mapped_column(
        ForeignKey("buildings.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    floor_code: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        index=True,
    )

    floor_name: Mapped[str] = mapped_column(String(150), nullable=False)

    floor_number: Mapped[int] = mapped_column(Integer, nullable=False)

    gross_area_sqm: Mapped[float | None] = mapped_column(Float, nullable=True)

    conditioned_area_sqm: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    clear_height_m: Mapped[float | None] = mapped_column(Float, nullable=True)

    occupancy_capacity: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )

    remarks: Mapped[str | None] = mapped_column(Text, nullable=True)

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    organization = relationship("Organization")

    building = relationship(
        "Building",
        back_populates="floors",
    )

    spaces = relationship(
        "Space",
        back_populates="floor",
        cascade="all, delete-orphan",
    )
