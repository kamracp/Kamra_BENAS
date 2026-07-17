from app.core.exceptions import (
    ConflictException,
    ResourceNotFoundException,
)
from app.models.utility_bill import UtilityBill
from app.repositories.energy_meter_repository import EnergyMeterRepository
from app.repositories.utility_bill_repository import UtilityBillRepository
from app.schemas.utility_bill import UtilityBillCreate, UtilityBillUpdate


class UtilityBillService:
    def __init__(
        self,
        repository: UtilityBillRepository,
        meter_repository: EnergyMeterRepository,
    ):
        self.repository = repository
        self.meter_repository = meter_repository

    def _ensure_meter_exists(self, meter_id: int) -> None:
        # EnergyMeterRepository is tenant-scoped, so this also guarantees
        # the meter belongs to the caller's organization.
        if self.meter_repository.get_by_id(meter_id) is None:
            raise ResourceNotFoundException("Energy meter", meter_id)

    def _ensure_no_overlap(
        self,
        meter_id: int,
        period_start,
        period_end,
        exclude_bill_id: int | None = None,
    ) -> None:
        overlapping = self.repository.find_overlapping(
            meter_id=meter_id,
            period_start=period_start,
            period_end=period_end,
            exclude_bill_id=exclude_bill_id,
        )

        if overlapping:
            raise ConflictException(
                "A bill already exists for this meter covering "
                f"{overlapping.billing_period_start} to "
                f"{overlapping.billing_period_end}. Overlapping billing "
                "periods are not allowed (they would double-count "
                "consumption in emission calculations).",
            )

    def get_bills(self, meter_id: int | None = None) -> list[UtilityBill]:
        if meter_id is not None:
            self._ensure_meter_exists(meter_id)

        return self.repository.get_all(meter_id=meter_id)

    def get_bill(self, bill_id: int) -> UtilityBill:
        bill = self.repository.get_by_id(bill_id)

        if bill is None:
            raise ResourceNotFoundException("Utility bill", bill_id)

        return bill

    def create_bill(self, bill: UtilityBillCreate) -> UtilityBill:
        self._ensure_meter_exists(bill.meter_id)

        self._ensure_no_overlap(
            meter_id=bill.meter_id,
            period_start=bill.billing_period_start,
            period_end=bill.billing_period_end,
        )

        return self.repository.create(bill)

    def update_bill(
        self,
        bill_id: int,
        bill: UtilityBillUpdate,
    ) -> UtilityBill:
        db_bill = self.repository.get_by_id(bill_id)

        if db_bill is None:
            raise ResourceNotFoundException("Utility bill", bill_id)

        # Effective period after applying partial update.
        new_start = (
            bill.billing_period_start
            if bill.billing_period_start is not None
            else db_bill.billing_period_start
        )
        new_end = (
            bill.billing_period_end
            if bill.billing_period_end is not None
            else db_bill.billing_period_end
        )

        if new_end < new_start:
            raise ConflictException(
                "billing_period_end cannot be before billing_period_start.",
            )

        self._ensure_no_overlap(
            meter_id=db_bill.meter_id,
            period_start=new_start,
            period_end=new_end,
            exclude_bill_id=db_bill.id,
        )

        return self.repository.update(db_bill, bill)

    def delete_bill(self, bill_id: int) -> None:
        db_bill = self.repository.get_by_id(bill_id)

        if db_bill is None:
            raise ResourceNotFoundException("Utility bill", bill_id)

        self.repository.delete(db_bill)