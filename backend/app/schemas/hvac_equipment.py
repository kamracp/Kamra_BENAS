from __future__ import annotations
from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field
class HvacEquipmentBase(BaseModel):
    # NOTE: organization_id is intentionally NOT here.
    # It is always taken from the authenticated user's JWT.
    building_id: int
    equipment_code: str = Field(..., min_length=1, max_length=30)
    equipment_name: str = Field(..., min_length=1, max_length=200)
    equipment_type: str = Field(..., min_length=1, max_length=100)
    capacity_kw: float = Field(..., gt=0)
    cop: float = Field(..., gt=0)
    operating_hours_per_day: float = Field(..., ge=0, le=24)
    operating_days_per_month: int = Field(default=26, ge=0,le=31)
    manufacturer: str | None = Field(default=None, max_length=150)
    installation_year: int | None = Field(default=None, ge=1900)
    is_active: bool = True
    occupant_id: int | None = None
    serves_common_area: bool = False
    floor_id: int | None = None
class HvacEquipmentCreate(HvacEquipmentBase):
    pass
class HvacEquipmentUpdate(BaseModel):
    building_id: int | None = None
    equipment_code: str | None = Field(default=None, min_length=1, max_length=30)
    equipment_name: str | None = Field(default=None, min_length=1, max_length=200)
    equipment_type: str | None = Field(default=None, min_length=1, max_length=100)
    capacity_kw: float | None = Field(default=None, gt=0)
    cop: float | None = Field(default=None, gt=0)
    operating_hours_per_day: float | None = Field(default=None, ge=0, le=24)
    operating_days_per_month: int | None = Field(default=None, ge=0, le=31)
    manufacturer: str | None = Field(default=None, max_length=150)
    installation_year: int | None = Field(default=None, ge=1900)
    is_active: bool | None = None
    occupant_id: int | None = None
    serves_common_area: bool | None = None
    floor_id: int | None = None
class HvacEquipmentResponse(HvacEquipmentBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    organization_id: int
    estimated_monthly_energy_kwh: float
    created_at: datetime
    updated_at: datetime