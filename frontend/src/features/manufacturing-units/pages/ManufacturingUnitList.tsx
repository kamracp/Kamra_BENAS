import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  useManufacturingUnits,
  useCreateManufacturingUnit,
  useUpdateManufacturingUnit,
  useDeleteManufacturingUnit,
  useSecSummary,
} from "../hooks/useManufacturingUnits";
import { useBuildings } from "../../buildings/hooks/useBuildings";

import ManufacturingUnitForm from "../components/ManufacturingUnitForm";

import type {
  ManufacturingUnit,
  ManufacturingUnitCreate,
  PatSector,
} from "../api/manufacturingUnitApi";

import ConfirmDialog from "../../../components/ui/ConfirmDialog";

const FACILITY_OPTIONS: { value: PatSector | "building"; label: string }[] = [
  { value: "building", label: "Building (BENAS)" },
  { value: "aluminium", label: "Aluminium" },
  { value: "cement", label: "Cement" },
  { value: "chlor_alkali", label: "Chlor-Alkali" },
  { value: "fertilizer", label: "Fertilizer" },
  { value: "iron_steel", label: "Iron & Steel" },
  { value: "pulp_paper", label: "Pulp & Paper" },
  { value: "textile", label: "Textile" },
  { value: "thermal_power", label: "Thermal Power" },
  { value: "refineries", label: "Refineries" },
  { value: "railways", label: "Railways" },
  { value: "discoms", label: "DISCOMs" },
  { value: "petrochemicals", label: "Petrochemicals" },
  { value: "other", label: "Other" },
];

function FacilityTypeSelector({
  onPickSector,
  onCancel,
}: {
  onPickSector: (sector: PatSector) => void;
  onCancel: () => void;
}) {
  const navigate = useNavigate();

  function handlePick(value: PatSector | "building") {
    if (value === "building") {
      navigate("/buildings");
      return;
    }
    onPickSector(value);
  }

  return (
    <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-xl font-semibold text-gray-800">
          What are you adding?
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Choose Building for BENAS (energy performance, net zero, ESG) or a
          sector for a Manufacturing Unit (BEE PAT / ISO 50001 SEC tracking).
        </p>
      </div>

      <select
        defaultValue=""
        onChange={(e) => handlePick(e.target.value as PatSector | "building")}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
      >
        <option value="" disabled>
          Select...
        </option>
        {FACILITY_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <div className="flex justify-end border-t border-gray-200 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-gray-300 px-5 py-2 font-medium text-gray-700 transition hover:bg-gray-100"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function SecSummaryPanel({ unitId }: { unitId: number }) {
  const { data, isLoading, isError } = useSecSummary(unitId);

  if (isLoading) {
    return <p className="text-sm text-gray-500">Loading SEC summary...</p>;
  }

  if (isError || !data) {
    return <p className="text-sm text-red-600">Unable to load SEC summary.</p>;
  }

  return (
    <div className="space-y-3 rounded-lg bg-gray-50 p-4">
      <div className="flex flex-wrap gap-6 text-sm">
        <div>
          <span className="text-gray-500">Baseline Year: </span>
          <span className="font-semibold">{data.baseline_year ?? "-"}</span>
        </div>

        <div>
          <span className="text-gray-500">Baseline SEC: </span>
          <span className="font-semibold">
            {data.baseline_sec_gj_per_unit != null
              ? `${data.baseline_sec_gj_per_unit} GJ/unit`
              : "Not available"}
          </span>
        </div>

        <div>
          <span className="text-gray-500">Standards: </span>
          <span className="font-semibold">
            {data.standards_applicable ?? "-"}
          </span>
        </div>
      </div>

      {data.periods.length === 0 ? (
        <p className="text-sm text-gray-500">
          No production periods recorded yet.
        </p>
      ) : (
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500">
              <th className="py-1 pr-4">Period</th>
              <th className="py-1 pr-4">Energy (GJ)</th>
              <th className="py-1 pr-4">Production</th>
              <th className="py-1 pr-4">SEC</th>
              <th className="py-1 pr-4">vs Baseline</th>
            </tr>
          </thead>

          <tbody>
            {data.periods.map((p, idx) => (
              <tr key={idx} className="border-t">
                <td className="py-1 pr-4">
                  {p.period_start} to {p.period_end}
                </td>

                <td className="py-1 pr-4">
                  {p.total_energy_gj != null ? p.total_energy_gj : "-"}
                </td>

                <td className="py-1 pr-4">
                  {p.production_quantity != null
                    ? `${p.production_quantity} ${p.production_unit ?? ""}`
                    : "-"}
                </td>

                <td className="py-1 pr-4 font-medium">
                  {p.sec_gj_per_unit != null
                    ? `${p.sec_gj_per_unit} GJ/${p.production_unit ?? "unit"}`
                    : "-"}
                </td>

                <td className="py-1 pr-4">
                  {p.pct_change_vs_baseline != null ? (
                    <span
                      className={
                        p.pct_change_vs_baseline <= 0
                          ? "font-medium text-green-700"
                          : "font-medium text-red-700"
                      }
                    >
                      {p.pct_change_vs_baseline > 0 ? "+" : ""}
                      {p.pct_change_vs_baseline}%
                    </span>
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default function ManufacturingUnitList() {
  const { data: units = [], isLoading, isError } = useManufacturingUnits();
  const { data: buildings = [] } = useBuildings();

  const createMutation = useCreateManufacturingUnit();
  const updateMutation = useUpdateManufacturingUnit();
  const deleteMutation = useDeleteManufacturingUnit();

  const [step, setStep] = useState<"none" | "chooser" | "form">("none");
  const [chosenSector, setChosenSector] = useState<PatSector | undefined>(undefined);
  const [selectedUnit, setSelectedUnit] = useState<ManufacturingUnit | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const buildingNameById = useMemo(() => {
    const map = new Map<number, string>();
    buildings.forEach((b) => map.set(b.id, b.building_name));
    return map;
  }, [buildings]);

  const filteredUnits = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return units;
    }

    return units.filter((item) => {
      return (
        item.unit_code.toLowerCase().includes(keyword) ||
        item.unit_name.toLowerCase().includes(keyword) ||
        item.sector.toLowerCase().includes(keyword)
      );
    });
  }, [units, search]);

  async function saveUnit(formData: ManufacturingUnitCreate) {
    try {
      if (selectedUnit) {
        await updateMutation.mutateAsync({ id: selectedUnit.id, data: formData });
      } else {
        await createMutation.mutateAsync(formData);
      }

      setStep("none");
      setSelectedUnit(null);
      setChosenSector(undefined);
    } catch (error) {
      console.error(error);
      toast.error("Unable to save manufacturing unit.");
    }
  }

  async function deleteUnit() {
    if (deleteId === null) return;

    try {
      await deleteMutation.mutateAsync(deleteId);
      setDeleteId(null);
    } catch (error) {
      console.error(error);
      toast.error("Unable to delete manufacturing unit.");
    }
  }

  function openCreateDialog() {
    setSelectedUnit(null);
    setChosenSector(undefined);
    setStep("chooser");
  }

  function openEditDialog(unit: ManufacturingUnit) {
    setSelectedUnit(unit);
    setStep("form");
  }

  function closeAll() {
    setSelectedUnit(null);
    setChosenSector(undefined);
    setStep("none");
  }

  function toggleExpand(id: number) {
    setExpandedId((current) => (current === id ? null : id));
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-10">
        Loading manufacturing units...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-600">
        Unable to load manufacturing units.
      </div>
    );
  }

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manufacturing Units</h1>

          <p className="text-gray-500">
            BEE PAT / ISO 50001 -- SEC &amp; EnPI benchmarking
          </p>
        </div>

        <button
          onClick={openCreateDialog}
          className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white transition hover:bg-blue-700"
        >
          + Add
        </button>
      </div>

      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by Code, Name or Sector..."
          className="w-full rounded-lg border px-4 py-3 focus:border-blue-500 focus:outline-none"
        />
      </div>

      <div className="overflow-hidden rounded-xl border bg-white shadow">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="border-b px-4 py-3 text-left">Code</th>
              <th className="border-b px-4 py-3 text-left">Name</th>
              <th className="border-b px-4 py-3 text-left">Sector</th>
              <th className="border-b px-4 py-3 text-left">Plant</th>
              <th className="border-b px-4 py-3 text-left">Baseline Year</th>
              <th className="border-b px-4 py-3 text-center">Status</th>
              <th className="border-b px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredUnits.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-10 text-center text-gray-500">
                  No manufacturing units found.
                </td>
              </tr>
            ) : (
              filteredUnits.map((unit: ManufacturingUnit) => (
                <>
                  <tr key={unit.id} className="hover:bg-gray-50">
                    <td className="border-b px-4 py-3">{unit.unit_code}</td>

                    <td className="border-b px-4 py-3 font-medium">
                      {unit.unit_name}
                    </td>

                    <td className="border-b px-4 py-3 capitalize">
                      {unit.sector.replace("_", " ")}
                    </td>

                    <td className="border-b px-4 py-3">
                      {unit.building_id
                        ? buildingNameById.get(unit.building_id) ?? "-"
                        : "-"}
                    </td>

                    <td className="border-b px-4 py-3">{unit.baseline_year}</td>

                    <td className="border-b px-4 py-3 text-center">
                      <span
                        className={
                          unit.is_active
                            ? "rounded bg-green-100 px-3 py-1 text-sm font-medium text-green-700"
                            : "rounded bg-red-100 px-3 py-1 text-sm font-medium text-red-700"
                        }
                      >
                        {unit.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="border-b px-4 py-3 text-center">
                      <button
                        onClick={() => toggleExpand(unit.id)}
                        className="mr-2 rounded bg-emerald-600 px-3 py-1 text-white hover:bg-emerald-700"
                      >
                        {expandedId === unit.id ? "Hide SEC" : "View SEC"}
                      </button>

                      <button
                        onClick={() => openEditDialog(unit)}
                        className="mr-2 rounded bg-amber-500 px-3 py-1 text-white hover:bg-amber-600"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => setDeleteId(unit.id)}
                        className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>

                  {expandedId === unit.id && (
                    <tr>
                      <td colSpan={7} className="border-b bg-gray-50 px-4 py-4">
                        <SecSummaryPanel unitId={unit.id} />
                      </td>
                    </tr>
                  )}
                </>
              ))
            )}
          </tbody>
        </table>
      </div>

      {step !== "none" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <div>
                <h2 className="text-2xl font-bold">
                  {step === "chooser"
                    ? "Add Facility"
                    : selectedUnit
                      ? "Edit Manufacturing Unit"
                      : "Add Manufacturing Unit"}
                </h2>
              </div>

              <button
                onClick={closeAll}
                className="text-3xl leading-none text-gray-500 hover:text-black"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              {step === "chooser" ? (
                <FacilityTypeSelector
                  onPickSector={(sector) => {
                    setChosenSector(sector);
                    setStep("form");
                  }}
                  onCancel={closeAll}
                />
              ) : (
                <ManufacturingUnitForm
                  buildings={buildings}
                  initialData={selectedUnit ?? undefined}
                  defaultSector={chosenSector}
                  onSubmit={saveUnit}
                  loading={createMutation.isPending || updateMutation.isPending}
                  onCancel={closeAll}
                />
              )}
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={deleteId !== null}
        title="Delete Manufacturing Unit"
        message="Are you sure you want to delete this manufacturing unit? This action cannot be undone."
        loading={deleteMutation.isPending}
        onCancel={() => setDeleteId(null)}
        onConfirm={deleteUnit}
      />
    </div>
  );
}
