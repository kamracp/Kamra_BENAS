from __future__ import annotations

from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field, model_validator


class UtilityBillBase(BaseModel):
    # NOTE: organization_id is intentionally NOT here.
    # It is always taken from the authenticated user's JWT.
    meter_id: int = Field(..., gt=0)

    bill_number: str | None = Field(default=None, max_length=100)

    billing_period_start: date
    billing_period_end: date

    consumption: float = Field(..., ge=0)

    amount: float | None = Field(default=None, ge=0)
    currency: str = Field(default="INR", min_length=1, max_length=10)

    bill_date: date | None = None
    due_date: date | None = None

    document_url: str | None = Field(default=None, max_length=500)
    notes: str | None = Field(default=None, max_length=2000)

    @model_validator(mode="after")
    def check_period_order(self) -> "UtilityBillBase":
        if self.billing_period_end < self.billing_period_start:
            raise ValueError(
                "billing_period_end cannot be before billing_period_start.",
            )
        return self


class UtilityBillCreate(UtilityBillBase):
    pass


class UtilityBillUpdate(BaseModel):
    # meter_id is intentionally NOT updatable — a bill belongs to its meter.
    bill_number: str | None = Field(default=None, max_length=100)

    billing_period_start: date | None = None
    billing_period_end: date | None = None

    consumption: float | None = Field(default=None, ge=0)

    amount: float | None = Field(default=None, ge=0)
    currency: str | None = Field(default=None, min_length=1, max_length=10)

    bill_date: date | None = None
    due_date: date | None = None

    document_url: str | None = Field(default=None, max_length=500)
    notes: str | None = Field(default=None, max_length=2000)

    @model_validator(mode="after")
    def check_period_order(self) -> "UtilityBillUpdate":
        if (
            self.billing_period_start is not None
            and self.billing_period_end is not None
            and self.billing_period_end < self.billing_period_start
        ):
            raise ValueError(
                "billing_period_end cannot be before billing_period_start.",
            )
        return self


class UtilityBillResponse(UtilityBillBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    organization_id: int
    created_at: datetime
    updated_at: datetime