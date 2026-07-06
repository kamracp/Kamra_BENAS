from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class OrganizationBase(BaseModel):
    # ---------------------------------------------------------
    # Identity
    # ---------------------------------------------------------

    organization_code: str = Field(..., max_length=30)
    organization_name: str = Field(..., max_length=200)
    legal_name: str | None = Field(default=None, max_length=250)

    # ---------------------------------------------------------
    # Business
    # ---------------------------------------------------------

    industry: str | None = Field(default=None, max_length=120)
    gstin: str | None = Field(default=None, max_length=15)
    pan: str | None = Field(default=None, max_length=10)

    # ---------------------------------------------------------
    # Contact
    # ---------------------------------------------------------

    email: EmailStr | None = None
    phone: str | None = Field(default=None, max_length=50)
    website: str | None = Field(default=None, max_length=250)

    # ---------------------------------------------------------
    # Address
    # ---------------------------------------------------------

    address_line_1: str | None = Field(default=None, max_length=250)
    address_line_2: str | None = Field(default=None, max_length=250)

    city: str | None = Field(default=None, max_length=120)
    state: str | None = Field(default=None, max_length=120)
    country: str | None = Field(default=None, max_length=120)
    pincode: str | None = Field(default=None, max_length=20)

    # ---------------------------------------------------------
    # Regional
    # ---------------------------------------------------------

    timezone: str | None = Field(default=None, max_length=80)
    currency: str | None = Field(default=None, max_length=20)

    # ---------------------------------------------------------
    # System
    # ---------------------------------------------------------

    is_active: bool = True


class OrganizationCreate(OrganizationBase):
    pass


class OrganizationUpdate(BaseModel):
    organization_code: str | None = Field(default=None, max_length=30)
    organization_name: str | None = Field(default=None, max_length=200)
    legal_name: str | None = Field(default=None, max_length=250)

    industry: str | None = Field(default=None, max_length=120)
    gstin: str | None = Field(default=None, max_length=15)
    pan: str | None = Field(default=None, max_length=10)

    email: EmailStr | None = None
    phone: str | None = Field(default=None, max_length=50)
    website: str | None = Field(default=None, max_length=250)

    address_line_1: str | None = Field(default=None, max_length=250)
    address_line_2: str | None = Field(default=None, max_length=250)

    city: str | None = Field(default=None, max_length=120)
    state: str | None = Field(default=None, max_length=120)
    country: str | None = Field(default=None, max_length=120)
    pincode: str | None = Field(default=None, max_length=20)

    timezone: str | None = Field(default=None, max_length=80)
    currency: str | None = Field(default=None, max_length=20)

    is_active: bool | None = None


class OrganizationResponse(OrganizationBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)