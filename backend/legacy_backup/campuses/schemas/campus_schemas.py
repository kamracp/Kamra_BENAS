from pydantic import BaseModel, ConfigDict
from typing import Optional
from uuid import UUID
from datetime import datetime

class CampusBase(BaseModel):
    name: str
    code: str
    location: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = True

class CampusCreate(CampusBase):
    organization_id: UUID

class CampusUpdate(BaseModel):
    name: Optional[str] = None
    code: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None

class CampusResponse(CampusBase):
    id: UUID
    organization_id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)