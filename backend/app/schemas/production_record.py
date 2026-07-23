"""
Pydantic schemas for ProductionRecord (Phase 6 -- Manufacturing module)
"""
import datetime
from pydantic import BaseModel, ConfigDict, Field, model_validator


class ProductionRecordBase(BaseModel):
    manufacturing_unit_id: int
    period_start: datetime.date
    period_end: datetime.date
    production_quantity: float = Field(..., gt=0)
    production_unit: str = Field(..., min_length=1, max_length=20)
    remarks: str | None = None

    @model_validator(mode="after")
    def check_period(self) -> "ProductionRecordBase":
        if self.period_end < self.period_start:
            raise ValueError("period_end cannot be before period_start.")
        return self


class ProductionRecordCreate(ProductionRecordBase):
    pass


class ProductionRecordUpdate(BaseModel):
    manufacturing_unit_id: int | None = None
    period_start: datetime.date | None = None
    period_end: datetime.date | None = None
    production_quantity: float | None = Field(default=None, gt=0)
    production_unit: str | None = Field(default=None, min_length=1, max_length=20)
    remarks: str | None = None


class ProductionRecordResponse(ProductionRecordBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    organization_id: int
