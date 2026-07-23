"""
SEC (BEE PAT) / EnPI (ISO 50001) Calculation Service (Phase 6)

Core idea: for a ManufacturingUnit's production period, sum all
energy consumed (converted to GJ via emission_factors.energy_content_gj_per_unit)
by meters at the unit's linked Building, divide by production quantity
for that same period = SEC / EnPI.

Baseline SEC = average SEC across whichever production periods fall
in the unit's baseline_year. All other periods are compared against it.
"""
from sqlalchemy.orm import Session

from app.models.emission_factor import EmissionFactor
from app.models.energy_meter import EnergyMeter
from app.models.manufacturing_unit import ManufacturingUnit
from app.models.production_record import ProductionRecord
from app.models.utility_bill import UtilityBill


def _find_factor(db: Session, meter_type: str, unit: str, on_date, region: str = "IN"):
    return (
        db.query(EmissionFactor)
        .filter(
            EmissionFactor.meter_type == meter_type,
            EmissionFactor.unit == unit,
            EmissionFactor.region == region,
            EmissionFactor.is_active.is_(True),
            EmissionFactor.valid_from <= on_date,
            (EmissionFactor.valid_to.is_(None)) | (EmissionFactor.valid_to >= on_date),
        )
        .order_by(EmissionFactor.valid_from.desc())
        .first()
    )


def calculate_period_sec(
    db: Session,
    organization_id: int,
    manufacturing_unit_id: int,
    production_record: ProductionRecord,
) -> dict:
    unit = (
        db.query(ManufacturingUnit)
        .filter(
            ManufacturingUnit.id == manufacturing_unit_id,
            ManufacturingUnit.organization_id == organization_id,
        )
        .first()
    )

    if unit is None or unit.building_id is None:
        return {"status": "no_building_linked", "manufacturing_unit_id": manufacturing_unit_id}

    meters = db.query(EnergyMeter).filter(EnergyMeter.building_id == unit.building_id).all()
    meters_by_id = {m.id: m for m in meters}
    meter_ids = list(meters_by_id.keys())

    bills = (
        db.query(UtilityBill)
        .filter(
            UtilityBill.meter_id.in_(meter_ids),
            UtilityBill.billing_period_start >= production_record.period_start,
            UtilityBill.billing_period_end <= production_record.period_end,
        )
        .all()
        if meter_ids
        else []
    )

    total_energy_gj = 0.0
    pending = []

    for bill in bills:
        meter = meters_by_id[bill.meter_id]
        factor = _find_factor(db, meter.meter_type, meter.unit, bill.billing_period_start)

        if factor is None or factor.energy_content_gj_per_unit is None:
            pending.append(
                {"bill_id": bill.id, "meter_code": meter.meter_code, "meter_type": meter.meter_type}
            )
            continue

        total_energy_gj += bill.consumption * factor.energy_content_gj_per_unit

    sec = None
    if production_record.production_quantity > 0:
        sec = round(total_energy_gj / production_record.production_quantity, 6)

    return {
        "status": "calculated",
        "manufacturing_unit_id": manufacturing_unit_id,
        "period_start": production_record.period_start,
        "period_end": production_record.period_end,
        "total_energy_gj": round(total_energy_gj, 4),
        "production_quantity": production_record.production_quantity,
        "production_unit": production_record.production_unit,
        "sec_gj_per_unit": sec,
        "bills_pending_energy_content": pending,
    }


def get_sec_summary(db: Session, organization_id: int, manufacturing_unit_id: int) -> dict:
    """BEE PAT-style / ISO 50001-style summary: baseline SEC vs every period's SEC."""
    unit = (
        db.query(ManufacturingUnit)
        .filter(
            ManufacturingUnit.id == manufacturing_unit_id,
            ManufacturingUnit.organization_id == organization_id,
        )
        .first()
    )

    if unit is None:
        return {"status": "unit_not_found"}

    records = (
        db.query(ProductionRecord)
        .filter(
            ProductionRecord.organization_id == organization_id,
            ProductionRecord.manufacturing_unit_id == manufacturing_unit_id,
        )
        .order_by(ProductionRecord.period_start)
        .all()
    )

    period_results = [
        calculate_period_sec(db, organization_id, manufacturing_unit_id, r) for r in records
    ]

    baseline_secs = [
        r["sec_gj_per_unit"]
        for r, rec in zip(period_results, records)
        if r.get("sec_gj_per_unit") is not None and rec.period_start.year == unit.baseline_year
    ]
    baseline_sec = round(sum(baseline_secs) / len(baseline_secs), 6) if baseline_secs else None

    for r in period_results:
        if baseline_sec and r.get("sec_gj_per_unit") is not None:
            r["pct_change_vs_baseline"] = round(
                ((r["sec_gj_per_unit"] - baseline_sec) / baseline_sec) * 100, 2
            )
        else:
            r["pct_change_vs_baseline"] = None

    return {
        "status": "ok",
        "manufacturing_unit_id": manufacturing_unit_id,
        "sector": unit.sector,
        "baseline_year": unit.baseline_year,
        "baseline_sec_gj_per_unit": baseline_sec,
        "standards_applicable": unit.standards_applicable,
        "periods": period_results,
    }
