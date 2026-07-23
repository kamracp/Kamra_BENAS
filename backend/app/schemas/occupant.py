from __future__ import annotations
from datetime import date, datetime
from pydantic import BaseModel, ConfigDict, Field
from app.models.occupant import OccupantStatus


class OccupantBase(BaseModel):
    # organization_id comes from JWT, never from the client.
    building_id: int
    floor_id: int
    space_id: int | None = None
    name: str = Field(..., min_length=1, max_length=200)
    office_area_sqft: float = Field(..., gt=0)
    lease_start_date: date
    lease_end_date: date | None = None
    minimum_billing_period_days: int = Field(default=30, ge=1)
    status: OccupantStatus = OccupantStatus.active


class OccupantCreate(OccupantBase):
    pass


class OccupantUpdate(BaseModel):
    building_id: int | None = None
    floor_id: int | None = None
    space_id: int | None = None
    name: str | None = Field(default=None, min_length=1, max_length=200)
    office_area_sqft: float | None = Field(default=None, gt=0)
    lease_start_date: date | None = None
    lease_end_date: date | None = None
    minimum_billing_period_days: int | None = Field(default=None, ge=1)
    status: OccupantStatus | None = None


class OccupantResponse(OccupantBase):
    id: int
    organization_id: int
    model_config = ConfigDict(from_attributes=True)