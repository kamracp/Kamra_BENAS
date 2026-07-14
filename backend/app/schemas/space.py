from datetime import datetime

from pydantic import BaseModel, ConfigDict


class SpaceBase(BaseModel):
    organization_id: int
    building_id: int
    floor_id: int

    space_code: str
    space_name: str

    space_type: str | None = None
    usage_category: str | None = None

    design_occupancy: int | None = None

    remarks: str | None = None
    is_active: bool = True


class SpaceCreate(SpaceBase):
    pass


class SpaceUpdate(BaseModel):
    space_code: str | None = None
    space_name: str | None = None

    space_type: str | None = None
    usage_category: str | None = None

    design_occupancy: int | None = None

    remarks: str | None = None
    is_active: bool | None = None

    model_config = ConfigDict(from_attributes=True)


class SpaceResponse(SpaceBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)