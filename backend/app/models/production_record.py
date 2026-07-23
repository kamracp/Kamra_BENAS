"""
Production Record model (Phase 6 -- Manufacturing module)

Tracks production quantity for a ManufacturingUnit over a period.
This is the missing piece needed to compute SEC (BEE PAT) / EnPI
(ISO 50001) = Energy consumed / Production quantity, for the same
period. Mirrors UtilityBill's period-based pattern (Phase 2).
"""
from __future__ import annotations

from datetime import date, datetime

from sqlalchemy import (
    Date,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base


class ProductionRecord(Base):
    __tablename__ = "production_records"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    organization_id: Mapped[int] = mapped_column(
        ForeignKey("organizations.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    manufacturing_unit_id: Mapped[int] = mapped_column(
        ForeignKey("manufacturing_units.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    period_start: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    period_end: Mapped[date] = mapped_column(Date, nullable=False, index=True)

    production_quantity: Mapped[float] = mapped_column(Float, nullable=False)

    # e.g. "tonnes", "MT", "kg" -- matches how the sector reports output
    production_unit: Mapped[str] = mapped_column(String(20), nullable=False)

    remarks: Mapped[str | None] = mapped_column(Text, nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )

    manufacturing_unit = relationship("ManufacturingUnit")
