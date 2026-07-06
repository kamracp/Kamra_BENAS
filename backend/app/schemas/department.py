from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


# ------------------------------------------------------------------
# Base Schema
# ------------------------------------------------------------------


class DepartmentBase(BaseModel):
    organization_id: int = Field(..., gt=0)

    department_code: str = Field(
        ...,
        min_length=1,
        max_length=30,
    )

    department_name: str = Field(
        ...,
        min_length=1,
        max_length=200,
    )

    description: str | None = Field(
        default=None,
        max_length=500,
    )

    is_active: bool = True


# ------------------------------------------------------------------
# Create Schema
# ------------------------------------------------------------------


class DepartmentCreate(DepartmentBase):
    pass


# ------------------------------------------------------------------
# Update Schema
# ------------------------------------------------------------------


class DepartmentUpdate(BaseModel):
    organization_id: int | None = Field(
        default=None,
        gt=0,
    )

    department_code: str | None = Field(
        default=None,
        min_length=1,
        max_length=30,
    )

    department_name: str | None = Field(
        default=None,
        min_length=1,
        max_length=200,
    )

    description: str | None = Field(
        default=None,
        max_length=500,
    )

    is_active: bool | None = None


# ------------------------------------------------------------------
# Response Schema
# ------------------------------------------------------------------


class Department(DepartmentBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)