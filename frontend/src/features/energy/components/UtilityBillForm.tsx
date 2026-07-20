import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { UtilityBill, UtilityBillCreate } from "../api/utilityBillApi";
import type { EnergyMeter } from "../api/energyMeterApi";

// ── Props ─────────────────────────────────────────────────────────────────────

interface UtilityBillFormProps {
  initialData?: UtilityBill;
  meters: EnergyMeter[];
  onSubmit: (data: UtilityBillCreate) => void;
  onCancel?: () => void;
  loading?: boolean;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

// Convert empty form inputs to undefined so optional fields
// are omitted from the payload instead of being sent as "".
const emptyToUndefined = (v: unknown) =>
  v === "" || v === null || Number.isNaN(v) ? undefined : v;

// ── Component ─────────────────────────────────────────────────────────────────

export default function UtilityBillForm({
  initialData,
  meters,
  onSubmit,
  onCancel,
  loading = false,
}: UtilityBillFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm<UtilityBillCreate>();

  const isEdit = !!initialData;

  useEffect(() => {
    if (initialData) {
      reset({
        meter_id: initialData.meter_id,
        bill_number: initialData.bill_number ?? "",
        billing_period_start: initialData.billing_period_start,
        billing_period_end: initialData.billing_period_end,
        consumption: initialData.consumption,
        amount: initialData.amount,
        currency: initialData.currency,
        bill_date: initialData.bill_date ?? "",
        due_date: initialData.due_date ?? "",
        document_url: initialData.document_url ?? "",
        notes: initialData.notes ?? "",
      });
    } else {
      reset({
        bill_number: "",
        billing_period_start: "",
        billing_period_end: "",
        currency: "INR",
        bill_date: "",
        due_date: "",
        document_url: "",
        notes: "",
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
          {isEdit ? "Edit Utility Bill" : "Add Utility Bill"}
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Enter bill details. Billing periods for the same meter must not overlap.
        </p>
      </div>

      {/* Section 1 — Bill Identity */}
      <section className="space-y-4">
        <h3 className="border-b pb-2 text-lg font-semibold text-gray-700">
          Bill Identity
        </h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Meter */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Meter *
            </label>
            <select
              className="w-full rounded-lg border border-gray-300 p-2.5 disabled:bg-gray-100"
              disabled={isEdit}
              {...register("meter_id", {
                required: "Meter is required",
                valueAsNumber: true,
              })}
            >
              <option value="">Select meter...</option>
              {meters.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.meter_name} ({m.meter_code})
                </option>
              ))}
            </select>
            {isEdit && (
              <p className="mt-1 text-xs text-gray-500">
                Meter cannot be changed after creation.
              </p>
            )}
            {errors.meter_id && (
              <p className="mt-1 text-sm text-red-500">
                {errors.meter_id.message}
              </p>
            )}
          </div>

          {/* Bill Number */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Bill Number
            </label>
            <input
              className="w-full rounded-lg border border-gray-300 p-2.5"
              placeholder="e.g. PSPCL-2026-07-001"
              {...register("bill_number")}
            />
          </div>

          {/* Bill Date */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Bill Date
            </label>
            <input
              type="date"
              className="w-full rounded-lg border border-gray-300 p-2.5"
              {...register("bill_date", { setValueAs: emptyToUndefined })}
            />
          </div>

          {/* Due Date */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Due Date
            </label>
            <input
              type="date"
              className="w-full rounded-lg border border-gray-300 p-2.5"
              {...register("due_date", { setValueAs: emptyToUndefined })}
            />
          </div>
        </div>
      </section>

      {/* Section 2 — Billing Period & Consumption */}
      <section className="space-y-4">
        <h3 className="border-b pb-2 text-lg font-semibold text-gray-700">
          Billing Period &amp; Consumption
        </h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Period Start */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Period Start *
            </label>
            <input
              type="date"
              className="w-full rounded-lg border border-gray-300 p-2.5"
              {...register("billing_period_start", {
                required: "Period start is required",
              })}
            />
            {errors.billing_period_start && (
              <p className="mt-1 text-sm text-red-500">
                {errors.billing_period_start.message}
              </p>
            )}
          </div>

          {/* Period End */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Period End *
            </label>
            <input
              type="date"
              className="w-full rounded-lg border border-gray-300 p-2.5"
              {...register("billing_period_end", {
                required: "Period end is required",
                validate: (value) => {
                  const start = getValues("billing_period_start");
                  if (start && value && value < start) {
                    return "Period end cannot be before period start";
                  }
                  return true;
                },
              })}
            />
            {errors.billing_period_end && (
              <p className="mt-1 text-sm text-red-500">
                {errors.billing_period_end.message}
              </p>
            )}
          </div>

          {/* Consumption */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Consumption *
            </label>
            <input
              type="number"
              step="any"
              className="w-full rounded-lg border border-gray-300 p-2.5"
              placeholder="e.g. 12500 (in meter's unit)"
              {...register("consumption", {
                required: "Consumption is required",
                valueAsNumber: true,
                min: { value: 0, message: "Consumption cannot be negative" },
              })}
            />
            {errors.consumption && (
              <p className="mt-1 text-sm text-red-500">
                {errors.consumption.message}
              </p>
            )}
          </div>

          {/* Amount */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Amount
            </label>
            <input
              type="number"
              step="any"
              className="w-full rounded-lg border border-gray-300 p-2.5"
              placeholder="e.g. 98500.50"
              {...register("amount", {
                setValueAs: (v) => emptyToUndefined(v === "" ? "" : Number(v)),
                min: { value: 0, message: "Amount cannot be negative" },
              })}
            />
            {errors.amount && (
              <p className="mt-1 text-sm text-red-500">
                {errors.amount.message}
              </p>
            )}
          </div>

          {/* Currency */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Currency
            </label>
            <input
              className="w-full rounded-lg border border-gray-300 p-2.5"
              placeholder="INR"
              {...register("currency")}
            />
          </div>
        </div>
      </section>

      {/* Section 3 — Additional */}
      <section className="space-y-4">
        <h3 className="border-b pb-2 text-lg font-semibold text-gray-700">
          Additional Information
        </h3>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Document URL
          </label>
          <input
            className="w-full rounded-lg border border-gray-300 p-2.5"
            placeholder="Link to scanned bill (optional)"
            {...register("document_url")}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Notes
          </label>
          <textarea
            className="w-full rounded-lg border border-gray-300 p-2.5"
            rows={3}
            placeholder="Optional notes about this bill"
            {...register("notes")}
          />
        </div>
      </section>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 px-6 py-2.5 font-semibold text-white disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Bill"}
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
