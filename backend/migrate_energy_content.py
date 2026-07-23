"""
One-time migration (Phase 6): add energy_content_gj_per_unit column to
emission_factors and backfill values for existing rows.

BENAS rule: manual ALTER TABLE, not Alembic (matches project convention).
Safe to re-run: ALTER uses IF NOT EXISTS, UPDATE only touches matching rows.
Run from backend/ with venv:
    python3 migrate_energy_content.py
"""
from sqlalchemy import text

import app.main  # noqa: F401  (registers models)
from app.database.session import SessionLocal

# (meter_type, unit) -> energy content in GJ per unit, IPCC 2006 Table 1.2 sourced
ENERGY_CONTENT = {
    ("electricity", "kWh"): 0.0036,     # physical constant, 1 kWh = 3.6 MJ
    ("diesel", "litres"): 0.0363,       # IPCC NCV 43.0 GJ/tonne x density 0.845 kg/l
    ("coal", "kg"): 0.0258,             # IPCC Table 1.2, 25.8 GJ/tonne
    ("furnace_oil", "kg"): 0.0404,      # IPCC Table 1.2, 40.4 GJ/tonne
    ("biomass", "kg"): 0.0156,          # IPCC Table 1.2, 15.6 GJ/tonne
    ("natural_gas", "SCM"): 0.0364,     # IPCC Table 1.2, 36.4 MJ/SCM
    ("lpg", "kg"): 0.0473,              # IPCC Table 1.2, 47.3 GJ/tonne
}


def main() -> None:
    db = SessionLocal()
    try:
        print("Step 1: ALTER TABLE (add column if missing)...")
        db.execute(text(
            "ALTER TABLE emission_factors "
            "ADD COLUMN IF NOT EXISTS energy_content_gj_per_unit FLOAT"
        ))
        db.commit()
        print("Column ensured.")

        print()
        print("Step 2: backfilling values...")
        for (meter_type, unit), gj_value in ENERGY_CONTENT.items():
            result = db.execute(
                text(
                    "UPDATE emission_factors "
                    "SET energy_content_gj_per_unit = :gj_value "
                    "WHERE meter_type = :meter_type AND unit = :unit "
                    "AND energy_content_gj_per_unit IS NULL"
                ),
                {"gj_value": gj_value, "meter_type": meter_type, "unit": unit},
            )
            db.commit()
            print(f"  {meter_type}/{unit} -> {gj_value} GJ/unit "
                  f"({result.rowcount} row(s) updated)")

        print()
        print("DONE.")
    finally:
        db.close()


if __name__ == "__main__":
    main()
