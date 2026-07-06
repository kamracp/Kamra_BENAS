from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.database.session import get_db
from app.campuses.schemas.campus_schemas import CampusCreate, CampusUpdate, CampusResponse
from app.campuses.services.campus_service import CampusService
from app.campuses.repositories.campus_repository import CampusRepository

router = APIRouter(prefix="/campuses", tags=["Campuses"])

def get_campus_service(db: Session = Depends(get_db)) -> CampusService:
    return CampusService(CampusRepository(db))

@router.post("", response_model=CampusResponse, status_code=status.HTTP_201_CREATED)
def create_campus(obj_in: CampusCreate, service: CampusService = Depends(get_campus_service)):
    return service.create(obj_in)

@router.get("/org/{organization_id}", response_model=List[CampusResponse])
def get_campuses_by_organization(organization_id: UUID, skip: int = 0, limit: int = 100, service: CampusService = Depends(get_campus_service)):
    return service.get_by_organization(organization_id, skip=skip, limit=limit)

@router.get("/{campus_id}", response_model=CampusResponse)
def get_campus(campus_id: UUID, service: CampusService = Depends(get_campus_service)):
    db_obj = service.get_by_id(campus_id)
    if not db_obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Campus not found")
    return db_obj

@router.put("/{campus_id}", response_model=CampusResponse)
def update_campus(campus_id: UUID, obj_in: CampusUpdate, service: CampusService = Depends(get_campus_service)):
    return service.update(campus_id, obj_in)

@router.delete("/{campus_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_campus(campus_id: UUID, service: CampusService = Depends(get_campus_service)):
    service.delete(campus_id)
    return None