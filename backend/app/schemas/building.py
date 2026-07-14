from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class BuildingBase(BaseModel):
    organization_id: int = Field(..., gt=0)
    building_code: str = Field(..., min_length=1, max_length=30)
    building_name: str = Field(..., min_length=1, max_length=200)

    description: str | None = Field(default=None, max_length=1000)

    address_line_1: str | None = Field(default=None, max_length=255)
    address_line_2: str | None = Field(default=None, max_length=255)

    city: str | None = Field(default=None, max_length=120)
    state: str | None = Field(default=None, max_length=120)
    country: str | None = Field(default=None, max_length=120)
    pincode: str | None = Field(default=None, max_length=20)

    building_type: str | None = Field(default=None, max_length=100)

    total_floor_area: float | None = Field(default=None, ge=0)

    number_of_floors: int | None = Field(default=None, ge=0)

    year_constructed: int | None = Field(default=None, ge=1800)

    is_active: bool = True


class BuildingCreate(BuildingBase):
    pass


class BuildingUpdate(BaseModel):
    organization_id: int | None = Field(default=None, gt=0)

    building_code: str | None = Field(
        default=None,
        min_length=1,
        max_length=30,
    )

    building_name: str | None = Field(
        default=None,
        min_length=1,
        max_length=200,
    )

    description: str | None = Field(default=None, max_length=1000)

    address_line_1: str | None = Field(default=None, max_length=255)
    address_line_2: str | None = Field(default=None, max_length=255)

    city: str | None = Field(default=None, max_length=120)
    state: str | None = Field(default=None, max_length=120)
    country: str | None = Field(default=None, max_length=120)
    pincode: str | None = Field(default=None, max_length=20)

    building_type: str | None = Field(default=None, max_length=100)

    total_floor_area: float | None = Field(default=None, ge=0)

    number_of_floors: int | None = Field(default=None, ge=0)

    year_constructed: int | None = Field(default=None, ge=1800)

    is_active: bool | None = None


class BuildingResponse(BuildingBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)