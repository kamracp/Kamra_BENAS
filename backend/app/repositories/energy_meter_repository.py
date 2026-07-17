from sqlalchemy.orm import Session

from app.models.energy_meter import EnergyMeter
from app.schemas.energy_meter import EnergyMeterCreate, EnergyMeterUpdate


class EnergyMeterRepository:
    """All queries are scoped to a single organization (tenant)."""

    def __init__(self, db: Session, organization_id: int):
        self.db = db
        self.organization_id = organization_id

    def _base_query(self):
        return self.db.query(EnergyMeter).filter(
            EnergyMeter.organization_id == self.organization_id,
        )

    def get_all(self, building_id: int | None = None) -> list[EnergyMeter]:
        query = self._base_query()

        if building_id is not None:
            query = query.filter(EnergyMeter.building_id == building_id)

        return query.order_by(EnergyMeter.meter_name.asc()).all()

    def get_by_id(self, meter_id: int) -> EnergyMeter | None:
        return (
            self._base_query()
            .filter(EnergyMeter.id == meter_id)
            .first()
        )

    def get_by_code(self, meter_code: str) -> EnergyMeter | None:
        return (
            self._base_query()
            .filter(EnergyMeter.meter_code == meter_code)
            .first()
        )

    def create(self, meter: EnergyMeterCreate) -> EnergyMeter:
        db_meter = EnergyMeter(
            **meter.model_dump(),
            organization_id=self.organization_id,
        )

        self.db.add(db_meter)
        self.db.commit()
        self.db.refresh(db_meter)

        return db_meter

    def update(
        self,
        db_meter: EnergyMeter,
        meter: EnergyMeterUpdate,
    ) -> EnergyMeter:
        update_data = meter.model_dump(exclude_unset=True)

        for key, value in update_data.items():
            setattr(db_meter, key, value)

        self.db.commit()
        self.db.refresh(db_meter)

        return db_meter

    def delete(self, db_meter: EnergyMeter) -> None:
        self.db.delete(db_meter)
        self.db.commit()