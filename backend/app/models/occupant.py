from __future__ import annotations
from datetime import date
import enum
from sqlalchemy import Date, Enum, ForeignKey, Integer, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base


class OccupantStatus(str, enum.Enum):
    active = "active"
    vacated = "vacated"


class Occupant(Base):
    __tablename__ = "occupants"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    organization_id: Mapped[int] = mapped_column(
        ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True
    )
    building_id: Mapped[int] = mapped_column(
        ForeignKey("buildings.id", ondelete="CASCADE"), nullable=False, index=True
    )
    floor_id: Mapped[int] = mapped_column(
        ForeignKey("floors.id", ondelete="CASCADE"), nullable=False, index=True
    )
    # Optional reference to a specific defined Space (room/area inventory).
    # Not required — office_area_sqft below is what billing actually uses.
    space_id: Mapped[int | None] = mapped_column(
        ForeignKey("spaces.id", ondelete="SET NULL"), nullable=True, index=True
    )

    name: Mapped[str] = mapped_column(String(200), nullable=False)
    office_area_sqft: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    lease_start_date: Mapped[date] = mapped_column(Date, nullable=False)
    lease_end_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    minimum_billing_period_days: Mapped[int] = mapped_column(Integer, nullable=False, default=30)
    status: Mapped[OccupantStatus] = mapped_column(
        Enum(OccupantStatus), nullable=False, default=OccupantStatus.active
    )

    building = relationship("Building")
    floor = relationship("Floor")
    space = relationship("Space")