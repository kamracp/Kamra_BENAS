from datetime import datetime

from pydantic import BaseModel, ConfigDict


class FloorBase(BaseModel):
    # organization_id comes from JWT, never from the client.
    building_id: int

    floor_code: str
    floor_name: str
    floor_number: int

    gross_area_sqm: float | None = None
    conditioned_area_sqm: float | None = None
    clear_height_m: float | None = None

    occupancy_capacity: int | None = None

    remarks: str | None = None

    is_active: bool = True


class FloorCreate(FloorBase):
    pass


class FloorUpdate(BaseModel):
    floor_code: str | None = None
    floor_name: str | None = None
    floor_number: int | None = None

    gross_area_sqm: float | None = None
    conditioned_area_sqm: float | None = None
    clear_height_m: float | None = None

    occupancy_capacity: int | None = None

    remarks: str | None = None

    is_active: bool | None = None


class FloorResponse(FloorBase):
    id: int
    organization_id: int

    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
