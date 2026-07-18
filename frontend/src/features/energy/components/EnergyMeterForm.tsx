import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { EnergyMeter, EnergyMeterCreate } from "../api/energyMeterApi";

// ── Constants ─────────────────────────────────────────────────────────────────

const METER_TYPES = [
  { value: "electricity", label: "Electricity" },
  { value: "diesel", label: "Diesel" },
  { value: "natural_gas", label: "Natural Gas" },
  { value: "lpg", label: "LPG" },
  { value: "water", label: "Water" },
  { value: "solar_generation", label: "Solar Generation" },
  { value: "other", label: "Other" },
] as const;

const METER_UNITS = [
  { value: "kWh", label: "kWh" },
  { value: "litres", label: "Litres" },
  { value: "kg", label: "kg" },
  { value: "SCM", label: "SCM (Standard Cubic Metre)" },
  { value: "m3", label: "m³" },
  { value: "MMBtu", label: "MMBtu" },
  { value: "other", label: "Other" },
] as const;

// ── Props ─────────────────────────────────────────────────────────────────────

interface Building {
  id: number;
  building_name: string;
  building_code: string;
}

interface EnergyMeterFormProps {
  initialData?: EnergyMeter;
  buildings: Building[];
  onSubmit: (data: EnergyMeterCreate) => void;
  onCancel?: () => void;
  loading?: boolean;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function EnergyMeterForm({
  initialData,
  buildings,
  onSubmit,
  onCancel,
  loading = false,
}: EnergyMeterFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EnergyMeterCreate>();

  useEffect(() => {
    if (initialData) {
      reset({
        building_id: initialData.building_id,
        meter_code: initialData.meter_code,
        meter_name: initialData.meter_name,
        meter_type: initialData.meter_type,
        unit: initialData.unit,
        utility_meter_number: initialData.utility_meter_number ?? "",
        utility_provider: initialData.utility_provider ?? "",
        description: initialData.description ?? "",
        is_active: initialData.is_active,
      });
    } else {
      reset({
        meter_code: "",
        meter_name: "",
        meter_type: "electricity",
        unit: "kWh",
        utility_meter_number: "",
        utility_provider: "",
        description: "",
        is_active: true,
      });
    }
  }, [initialData, reset]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800">
          {initialData ? "Edit Energy Meter" : "Add Energy Meter"}
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Enter meter details. GHG scope is assigned automatically by the system.
        </p>
      </div>

      {/* Section 1 — Meter Identity */}
      <section className="space-y-4">
        <h3 className="border-b pb-2 text-lg font-semibold text-gray-700">
          Meter Identity
        </h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Building */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Building *
            </label>
            <select
              className="w-full rounded-lg border border-gray-300 p-2.5"
              {...register("building_id", {
                required: "Building is required",
                valueAsNumber: true,
              })}
            >
              <option value="">Select building...</option>
              {buildings.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.building_name} ({b.building_code})
                </option>
              ))}
            </select>
            {errors.building_id && (
              <p className="mt-1 text-sm text-red-500">
                {errors.building_id.message}
              </p>
            )}
          </div>

          {/* Meter Code */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Meter Code *
            </label>
            <input
              className="w-full rounded-lg border border-gray-300 p-2.5"
              placeholder="e.g. EM-01"
              {...register("meter_code", {
                required: "Meter code is required",
              })}
            />
            {errors.meter_code && (
              <p className="mt-1 text-sm text-red-500">
                {errors.meter_code.message}
              </p>
            )}
          </div>

          {/* Meter Name */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Meter Name *
            </label>
            <input
              className="w-full rounded-lg border border-gray-300 p-2.5"
              placeholder="e.g. Main Incomer"
              {...register("meter_name", {
                required: "Meter name is required",
              })}
            />
            {errors.meter_name && (
              <p className="mt-1 text-sm text-red-500">
                {errors.meter_name.message}
              </p>
            )}
          </div>

          {/* Meter Type */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Meter Type *
            </label>
            <select
              className="w-full rounded-lg border border-gray-300 p-2.5"
              {...register("meter_type", { required: "Meter type is required" })}
            >
              {METER_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* Unit */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Unit *
            </label>
            <select
              className="w-full rounded-lg border border-gray-300 p-2.5"
              {...register("unit", { required: "Unit is required" })}
            >
              {METER_UNITS.map((u) => (
                <option key={u.value} value={u.value}>
                  {u.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Section 2 — Utility Info */}
      <section className="space-y-4">
        <h3 className="border-b pb-2 text-lg font-semibold text-gray-700">
          Utility Information
        </h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Utility Provider
            </label>
            <input
              className="w-full rounded-lg border border-gray-300 p-2.5"
              placeholder="e.g. PSPCL"
              {...register("utility_provider")}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Utility Meter Number
            </label>
            <input
              className="w-full rounded-lg border border-gray-300 p-2.5"
              placeholder="e.g. Consumer Account No."
              {...register("utility_meter_number")}
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            className="w-full rounded-lg border border-gray-300 p-2.5"
            rows={3}
            placeholder="Optional notes about this meter"
            {...register("description")}
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" {...register("is_active")} />
          Active
        </label>
      </section>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 px-6 py-2.5 font-semibold text-white disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Meter"}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-gray-300 px-6 py-2.5 font-semibold text-gray-700"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}