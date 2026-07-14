# Kamra BENAS — Project Memory for Claude Code

## What this product is
Kamra BENAS is a Net Zero and ESG Intelligence Platform (India-first positioning).
Target standards: BRSR (primary market wedge), GHG Protocol Scope 1/2/3, GRI,
CSRD/ESRS, ISO 14064, ASHRAE benchmarking.
Repo: kamracp/Kamra_BENAS. Owner: Chander Prakash Kamra (Kamra Engineering Solutions).

## Communication rules (IMPORTANT)
- ALL explanations, instructions, and conversation with the user: **Hindi in Devanagari script**.
- ALL code, code comments, commit messages, identifiers: **English only**.
- The user has delegated architecture and sequencing decisions to Claude ("chief" model).
  Make decisions confidently, explain briefly in Hindi, then execute. Do not offer
  long option menus unless the decision is genuinely business-level.
- User describes himself as a "copy-and-paste engineer" — keep commands explicit,
  always state the working directory. He has repeatedly run commands from the wrong
  directory (e.g., inside backend/ when paths already include backend/). Prefer
  absolute paths or `cd` to project root first.

## Permanent product rules
- **Emission factor values are NEVER LLM-generated.** They come only from
  DEFRA, India CEA grid data (e.g., 0.716 kgCO2/kWh), or IPCC datasets.
- Multi-tenant isolation: `organization_id` ALWAYS derives from the JWT token,
  never from client input. It must never appear in Create/Update schemas.
- All unique constraints are per-organization, not global
  (e.g., `UniqueConstraint("organization_id", "meter_code")`).

## Tech stack
- Backend: FastAPI + SQLAlchemy 2.0 (Mapped/mapped_column) + PostgreSQL, port **8020**
- Frontend: React + TypeScript + Vite, port **3002** (dev may run on 5173)
- No Alembic. `Base.metadata.create_all` in main.py creates NEW tables automatically;
  changes to EXISTING tables need manual `ALTER TABLE` on local and production DBs.
- Environment: WSL2 Ubuntu, VS Code, local PostgreSQL (db name: benas).
- Deployment target: AWS Lightsail Mumbai (13.206.51.94), Nginx + Cloudflare (Flexible SSL).
  Workflow: local → git push → SSH to Lightsail → git pull → restart. Never edit on server.

## Backend architecture (follow EXACTLY for every new module)
Layered pattern, one file per layer, flat and predictable:
- app/models/<entity>.py — SQLAlchemy model
- app/schemas/<entity>.py — Pydantic: Base (no organization_id) / Create / Update / Response
- app/repositories/<entity>_repository.py — Constructor takes (db, organization_id);
  every query goes through _base_query() filtered by organization_id
- app/services/<entity>_service.py — Business rules; raises exceptions from
  app/core/exceptions.py (ResourceNotFoundException, DuplicateResourceException,
  ConflictException, ...)
- app/api/<entity>.py — APIRouter + get_service() dependency that builds repo with
  current_user.organization_id; writes guarded by Depends(require_writer)

Register new routers in `app/api/router.py` and import new models in `app/main.py`.
Roles: owner / admin / member / auditor (auditor is read-only; `require_writer`
= owner/admin/member; `require_admin` = owner/admin).

## Current state (as of 2026-07-14)
- **Phase 0** done: repo hygiene (venv removed; note: ~30 __pycache__ files may still
  be git-tracked — untrack them if found; .gitignore is already correct).
- **Phase 1 / 1.5** done: multi-tenant JWT auth (signup creates Organization + owner
  in one transaction), tenant isolation on Building/Floor/Space/Department,
  org routes locked to `/organizations/me`, frontend auth wired (Login, Signup,
  ProtectedRoute, MyOrganization page).
- **Phase 2 backend** done and smoke-tested (15 end-to-end tests passed):
  - `EnergyMeter`: belongs to a Building; meter_type in
    (electricity, diesel, natural_gas, lpg, water, solar_generation, other);
    GHG scope auto-derived via METER_TYPE_SCOPE_MAP (electricity→scope_2,
    fuels→scope_1); unit in (kWh, litres, kg, SCM, m3, MMBtu, other);
    meter_code unique per org. Routes: /api/v1/energy-meters (filter ?building_id=).
  - `UtilityBill`: belongs to a meter; billing_period_start/end, consumption,
    amount (default INR), bill_number, bill_date, due_date, document_url
    (reserved for future Claude Vision bill upload), notes.
    **Billing-period overlap on the same meter is rejected with 409**
    (prevents double-counting in emission calcs). Routes: /api/v1/utility-bills
    (filter ?meter_id=). meter_id is not updatable on an existing bill.
  - Bills store RAW activity data only — no emission values anywhere yet.

## Frontend conventions
- Feature folders: `frontend/src/features/<feature>/{api,components,hooks}`
  (see features/departments as the reference implementation).
- TanStack Query (useQuery/useMutation); forms are self-contained with their own
  mutations (DepartmentForm pattern — do NOT rely on parent passing onSubmit).
- API client: `frontend/src/services/api/client.ts`, baseURL must point to port 8020.

## Roadmap
- **NEXT: Phase 2 frontend** — Energy Meters + Utility Bills pages following the
  departments feature pattern: meter list (grouped/filterable by building),
  meter form, bills list per meter, bill entry form with period date pickers,
  sidebar navigation entries, surface 409 overlap errors clearly to the user.
- Phase 3: carbon engine — Scope 1/2 emissions from utility bills using
  DEFRA / India CEA factors (factor tables stored as data, never generated).
- Later: Claude Vision bill upload → auto-extraction into UtilityBill,
  Scope 3, BRSR report generation, ASHRAE EUI benchmarking.

## Verification habits
- After backend changes: run the app against a scratch SQLite DB
  (DATABASE_URL=sqlite:///./smoke_test.db) with fastapi TestClient and exercise
  auth + tenant isolation + business rules before declaring done. Delete the
  scratch DB afterwards; never commit it.
- After frontend changes: `npm run build` must pass (on production, `rm -rf dist`
  before build).
