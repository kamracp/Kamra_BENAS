from datetime import date
from sqlalchemy.orm import Session
from app.models.occupant import Occupant, OccupantStatus
from app.models.hvac_equipment import HvacEquipment
from app.services.hvac_equipment_service import calculate_monthly_energy_kwh


def _is_occupant_billable_for_month(occupant: Occupant, billing_month: date) -> bool:
    """An occupant is billable for a given calendar month if their lease
    started on or before the last day of that month, and (if vacated)
    their lease didn't end before the first day of that month.

    Minimum billing period rule: NO day-based pro-ration. If the
    occupant moved in on ANY day within the billing month, they are
    billed for the FULL month.
    """
    month_start = billing_month.replace(day=1)
    if occupant.lease_start_date > _month_end(billing_month):
        return False
    if occupant.lease_end_date and occupant.lease_end_date < month_start:
        return False
    return True


def _month_end(d: date) -> date:
    if d.month == 12:
        return date(d.year, 12, 31)
    next_month_start = date(d.year, d.month + 1, 1)
    from datetime import timedelta
    return next_month_start - timedelta(days=1)


def calculate_tenant_billing_for_floor(
    db: Session,
    organization_id: int,
    floor_id: int,
    billing_month: date | None = None,
) -> list[dict]:
    """Compute Component A + Component B for every occupant billable in
    the given month, on a floor.

    Component A = the occupant's own dedicated equipment consumption.
    Component B = this floor's common-area AHU consumption, allocated
                  per square foot across all billable occupants.
    Minimum billing period = full calendar month, no day-based pro-ration.
    """
    if billing_month is None:
        billing_month = date.today()

    all_occupants = (
        db.query(Occupant)
        .filter(
            Occupant.organization_id == organization_id,
            Occupant.floor_id == floor_id,
            Occupant.status == OccupantStatus.active,
        )
        .all()
    )

    occupants = [
        o for o in all_occupants if _is_occupant_billable_for_month(o, billing_month)
    ]

    total_active_area = sum(float(o.office_area_sqft) for o in occupants)

    common_equipment = (
        db.query(HvacEquipment)
        .filter(
            HvacEquipment.organization_id == organization_id,
            HvacEquipment.floor_id == floor_id,
            HvacEquipment.serves_common_area == True,  # noqa: E712
        )
        .all()
    )
    common_ahu_kwh = sum(
        calculate_monthly_energy_kwh(e) for e in common_equipment
    )

    common_rate_per_sqft = (
        common_ahu_kwh / total_active_area if total_active_area > 0 else 0.0
    )

    results = []
    for occupant in occupants:
        dedicated_equipment = (
            db.query(HvacEquipment)
            .filter(
                HvacEquipment.organization_id == organization_id,
                HvacEquipment.occupant_id == occupant.id,
            )
            .all()
        )
        component_a = sum(
            calculate_monthly_energy_kwh(e) for e in dedicated_equipment
        )
        component_b = round(
            common_rate_per_sqft * float(occupant.office_area_sqft), 2
        )

        results.append(
            {
                "occupant_id": occupant.id,
                "occupant_name": occupant.name,
                "office_area_sqft": float(occupant.office_area_sqft),
                "billing_month": billing_month.strftime("%Y-%m"),
                "component_a_kwh": component_a,
                "component_b_kwh": component_b,
                "total_kwh": round(component_a + component_b, 2),
            }
        )

    return results