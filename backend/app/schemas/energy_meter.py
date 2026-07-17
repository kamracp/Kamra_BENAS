from __future__ import annotations

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

MeterType = Literal[
    "electricity",
    "diesel",
    "natural_gas",
    "lpg",
    "water",
    "solar_generation",
    "other",
]

MeterUnit = Literal[
    "kWh",
    "litres",
    "kg",
    "SCM",
    "m3",
    "MMBtu",
    "other",
]


class EnergyMeterBase(BaseModel):
    # NOTE: organization_id is intentionally NOT here.
    # It is always taken from the authenticated user's JWT.
    building_id: int = Field(..., gt=0)

    meter_code: str = Field(..., min_length=1, max_length=30)
    meter_name: str = Field(..., min_length=1, max_length=200)

    meter_type: MeterType
    unit: MeterUnit

    utility_meter_number: str | None = Field(default=None, max_length=100)
    utility_provider: str | None = Field(default=None, max_length=200)

    description: str | None = Field(default=None, max_length=1000)

    is_active: bool = True


class EnergyMeterCreate(EnergyMeterBase):
    pass


class EnergyMeterUpdate(BaseModel):
    building_id: int | None = Field(default=None, gt=0)

    meter_code: str | None = Field(
        default=None,
        min_length=1,
        max_length=30,
    )

    meter_name: str | None = Field(
        default=None,
        min_length=1,
        max_length=200,
    )

    meter_type: MeterType | None = None
    unit: MeterUnit | None = None

    utility_meter_number: str | None = Field(default=None, max_length=100)
    utility_provider: str | None = Field(default=None, max_length=200)

    description: str | None = Field(default=None, max_length=1000)

    is_active: bool | None = None


class EnergyMeterResponse(EnergyMeterBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    organization_id: int

    # Derived from meter_type via METER_TYPE_SCOPE_MAP (model property).
    scope: str

    created_at: datetime
    updated_at: datetime