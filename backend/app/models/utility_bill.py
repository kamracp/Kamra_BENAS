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


class UtilityBill(Base):
    """One utility bill for one meter, covering one billing period.

    This is RAW activity data only. Emission calculations (Scope 1/2)
    happen in the carbon engine using DEFRA / India CEA / IPCC factors —
    never stored or invented here.
    """

    __tablename__ = "utility_bills"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    organization_id: Mapped[int] = mapped_column(
        ForeignKey("organizations.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    meter_id: Mapped[int] = mapped_column(
        ForeignKey("energy_meters.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    # Bill number printed by the utility company (optional).
    bill_number: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
        index=True,
    )

    billing_period_start: Mapped[date] = mapped_column(
        Date,
        nullable=False,
        index=True,
    )

    billing_period_end: Mapped[date] = mapped_column(
        Date,
        nullable=False,
        index=True,
    )

    # Consumption in the meter's unit (kWh, litres, SCM, ...).
    consumption: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    amount: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    currency: Mapped[str] = mapped_column(
        String(10),
        nullable=False,
        default="INR",
    )

    bill_date: Mapped[date | None] = mapped_column(
        Date,
        nullable=True,
    )

    due_date: Mapped[date | None] = mapped_column(
        Date,
        nullable=True,
    )

    # Reserved for Claude Vision bill-upload feature (future phase).
    document_url: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    notes: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
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

    meter = relationship(
        "EnergyMeter",
        back_populates="utility_bills",
    )