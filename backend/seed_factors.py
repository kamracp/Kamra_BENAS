"""Seed the emission factor library with source-verified official values.

BENAS rule: every value below is taken from an official publication
(CEA / DEFRA / IPCC) — never invented. Run from backend/ with venv:
    python3 seed_factors.py
Safe to re-run: existing (source, source_year, meter_type) rows are skipped.
"""

from datetime import date

import app.main  # noqa: F401  (registers models, ensures tables)
from app.database.session import SessionLocal
from app.repositories.emission_factor_repository import (
    EmissionFactorRepository,
)
from app.schemas.emission_factor import EmissionFactorCreate
from app.services.emission_factor_service import EmissionFactorService

FACTORS = [
    EmissionFactorCreate(
        meter_type="electricity",
        unit="kWh",
        factor_kgco2e_per_unit=0.727,
        region="IN",
        source="CEA CO2 Baseline Database for the Indian Power Sector, Version 20.0",
        source_year=2024,
        document_reference=(
            "Weighted average grid emission factor incl. RES, "
            "FY 2023-24 (cea.nic.in, published Dec 2024)"
        ),
        valid_from=date(2024, 4, 1),
        valid_to=date(2025, 10, 31),
        is_active=True,
        notes=(
            "Location-based Scope 2 factor (GHG Protocol). Superseded by "
            "V21.0 from Nov 2025."
        ),
    ),
    EmissionFactorCreate(
        meter_type="electricity",
        unit="kWh",
        factor_kgco2e_per_unit=0.7117,
        region="IN",
        source="CEA CO2 Baseline Database for the Indian Power Sector, Version 21.0",
        source_year=2025,
        document_reference=(
            "Weighted average grid emission factor incl. RES & captive, "
            "excl. imports, FY 2024-25 (User Guide V21.0, cea.nic.in, "
            "published Nov 2025)"
        ),
        valid_from=date(2025, 11, 1),
        valid_to=None,
        is_active=True,
        notes=(
            "Location-based Scope 2 factor (GHG Protocol). One secondary "
            "source cites 0.710 provisional — verify against official CEA "
            "Excel before formal disclosure."
        ),
    ),
    EmissionFactorCreate(
        meter_type="diesel",
        unit="litres",
        factor_kgco2e_per_unit=2.57082,
        region="IN",
        source="UK Government GHG Conversion Factors for Company Reporting 2025 (DEFRA/DESNZ)",
        source_year=2025,
        document_reference="Fuels — Diesel (average biofuel blend), kgCO2e per litre",
        valid_from=date(2025, 1, 1),
        valid_to=None,
        is_active=True,
        notes=(
            "Scope 1 (DG sets). DEFRA fuel combustion factors are globally "
            "applicable. Average biofuel blend; 100% mineral diesel factor "
            "is slightly higher — to be verified and added if needed."
        ),
    ),
]


def main() -> None:
    db = SessionLocal()
    try:
        repository = EmissionFactorRepository(db)
        service = EmissionFactorService(repository)

        for factor in FACTORS:
            existing = [
                f
                for f in repository.get_all(
                    meter_type=factor.meter_type,
                    region=factor.region,
                    include_inactive=True,
                )
                if f.source == factor.source
                and f.source_year == factor.source_year
            ]

            if existing:
                print(f"SKIP  (already seeded): {factor.source}")
                continue

            created = service.create_factor(factor)
            print(
                f"SEEDED id={created.id}: {created.meter_type}/"
                f"{created.unit} = {created.factor_kgco2e_per_unit} "
                f"kgCO2e/unit [{created.source}]"
            )

        # ── Live test: which factor applies to the June-2026 bill? ──
        print()
        print("TEST: electricity / kWh / IN on 2026-06-15 ->")
        picked = service.get_applicable_factor(
            meter_type="electricity",
            unit="kWh",
            on_date=date(2026, 6, 15),
        )
        print(
            f"PICKED id={picked.id}: {picked.factor_kgco2e_per_unit} "
            f"kgCO2e/kWh from [{picked.source}] "
            f"(valid {picked.valid_from} -> {picked.valid_to or 'open'})"
        )
    finally:
        db.close()


if __name__ == "__main__":
    main()
