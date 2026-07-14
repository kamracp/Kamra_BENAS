from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class DepartmentBase(BaseModel):
    department_code: str = Field(..., min_length=1, max_length=30)
    department_name: str = Field(..., min_length=1, max_length=200)
    description: str | None = Field(default=None, max_length=500)
    is_active: bool = True


class DepartmentCreate(DepartmentBase):
    pass


class DepartmentUpdate(BaseModel):
    department_code: str | None = Field(
        default=None, min_length=1, max_length=30,
    )
    department_name: str | None = Field(
        default=None, min_length=1, max_length=200,
    )
    description: str | None = Field(default=None, max_length=500)
    is_active: bool | None = None


class Department(DepartmentBase):
    id: int
    organization_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
