from __future__ import annotations
from datetime import datetime
from sqlalchemy import (
    Boolean,
    DateTime,
    ForeignKey,
    Integer,
    Numeric,
    String,
    UniqueConstraint,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base
class HvacEquipment(Base):
    __tablename__ = "hvac_equipment"
    __table_args__ = (
        UniqueConstraint(
            "organization_id",
            "equipment_code",
            name="uq_hvac_equipment_org_code",
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
    equipment_code: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        index=True,
    )
    equipment_name: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
    )
    # e.g. Chiller, Split-AC, VRF, Package-Unit, Cassette-AC
    equipment_type: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )
    # Cooling capacity in kW (thermal). If source spec is in TR, convert
    # before saving: 1 TR = 3.5169 kW.
    capacity_kw: Mapped[float] = mapped_column(
        Numeric(10, 2),
        nullable=False,
    )
    # Coefficient of Performance (electrical kW in / cooling kW out).
    # Typical: window/split AC 2.5-3.2, VRF 3.5-4.2, chiller 4.5-6.5.
    cop: Mapped[float] = mapped_column(
        Numeric(5, 2),
        nullable=False,
    )
    operating_hours_per_day: Mapped[float] = mapped_column(
        Numeric(4, 2),
        nullable=False,
    )
    operating_days_per_month: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=26,
    )
    manufacturer: Mapped[str | None] = mapped_column(
        String(150),
        nullable=True,
    )
    installation_year: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )
    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )
    # Which occupant's office this equipment serves. Null when the
    # equipment serves a common area instead (see serves_common_area).
    occupant_id: Mapped[int | None] = mapped_column(
        ForeignKey("occupants.id", ondelete="CASCADE"),
        nullable=True,
        index=True,
    )
    # True = this equipment (typically an AHU) serves a floor's common
    # area (lobby, corridor) rather than a specific occupant's office.
    serves_common_area: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )
    # Which floor this equipment is on/serves. Required for common-area
    # AHUs to be allocated floor-wise rather than building-wide.
    floor_id: Mapped[int | None] = mapped_column(
        ForeignKey("floors.id", ondelete="CASCADE"),
        nullable=True,
        index=True,
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
    building = relationship("Building")
    occupant = relationship("Occupant")
    floor = relationship("Floor")