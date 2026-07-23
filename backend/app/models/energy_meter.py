from __future__ import annotations

from datetime import datetime

from sqlalchemy import (
    Boolean,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
    UniqueConstraint,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base

# Allowed meter types. Each type maps to a GHG Protocol scope below.
METER_TYPES = (
    "electricity",
    "diesel",
    "natural_gas",
    "lpg",
    "coal",
    "furnace_oil",
    "biomass",
    "water",
    "solar_generation",
    "other",
)

# Allowed measurement units per meter reading / bill consumption.
METER_TYPE_SCOPE_MAP = {
    "electricity": "scope_2",
    "diesel": "scope_1",
    "natural_gas": "scope_1",
    "lpg": "scope_1",
    "coal": "scope_1",
    "furnace_oil": "scope_1",
    "biomass": "scope_1",
    "water": "other",
    "solar_generation": "renewable",
    "other": "other",
}

# GHG Protocol scope classification (structural mapping, not a factor).
# Emission FACTORS are never stored here — they come from
# DEFRA / India CEA / IPCC datasets in the carbon engine (Phase 3).
METER_TYPE_SCOPE_MAP = {
    "electricity": "scope_2",
    "diesel": "scope_1",
    "natural_gas": "scope_1",
    "lpg": "scope_1",
    "water": "other",
    "solar_generation": "renewable",
    "other": "other",
}


class EnergyMeter(Base):
    __tablename__ = "energy_meters"

    __table_args__ = (
        UniqueConstraint(
            "organization_id",
            "meter_code",
            name="uq_energy_meter_org_code",
        ),
    )

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

    building_id: Mapped[int] = mapped_column(
        ForeignKey("buildings.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    meter_code: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        index=True,
    )

    meter_name: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
    )

    meter_type: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        index=True,
    )

    unit: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
    )

    # Utility company's own meter / consumer number (e.g. PSPCL account no.)
    utility_meter_number: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    utility_provider: Mapped[str | None] = mapped_column(
        String(200),
        nullable=True,
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

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

    @property
    def scope(self) -> str:
        """GHG Protocol scope derived from meter_type."""
        return METER_TYPE_SCOPE_MAP.get(self.meter_type, "other")

    building = relationship(
        "Building",
        back_populates="energy_meters",
    )

    utility_bills = relationship(
        "UtilityBill",
        back_populates="meter",
        cascade="all, delete-orphan",
    )