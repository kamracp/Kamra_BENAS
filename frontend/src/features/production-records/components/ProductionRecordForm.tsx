import { useEffect } from "react";
import { useForm } from "react-hook-form";

import type {
  ProductionRecord,
  ProductionRecordCreate,
} from "../api/productionRecordApi";
import type { ManufacturingUnit } from "../../manufacturing-units/api/manufacturingUnitApi";

interface ProductionRecordFormProps {
  units: ManufacturingUnit[];
  initialData?: ProductionRecord;
  defaultUnitId?: number;
  onSubmit: (data: ProductionRecordCreate) => void;
  onCancel?: () => void;
  loading?: boolean;
}

export default function ProductionRecordForm({
  units,
  initialData,
  defaultUnitId,
  onSubmit,
  onCancel,
  loading = false,
}: ProductionRecordFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductionRecordCreate>();

  useEffect(() => {
    if (initialData) {
      reset({
        manufacturing_unit_id: initialData.manufacturing_unit_id,
        period_start: initialData.period_start,
        period_end: initialData.period_end,
        production_quantity: initialData.production_quantity,
        production_unit: initialData.production_unit,
        remarks: initialData.remarks ?? "",
      });
    } else {
      reset({
        manufacturing_unit_id: defaultUnitId ?? undefined,
        period_start: "",
        period_end: "",
        production_quantity: undefined,
        production_unit: "tonnes",
        remarks: "",
      });
    }
  }, [initialData, defaultUnitId, reset]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      <div>
        <h2 className="text-xl font-semibold text-gray-800">
          {initialData ? "Edit Production Record" : "Add Production Record"}
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Production quantity for a period -- used to compute SEC/EnPI.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Manufacturing Unit *
          </label>

          <select
            {...register("manufacturing_unit_id", {
              required: "Manufacturing unit is required",
              valueAsNumber: true,
            })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
          >
            <option value="">Select unit...</option>
            {units.map((u) => (
              <option key={u.id} value={u.id}>
                {u.unit_name} ({u.unit_code})
              </option>
            ))}
          </select>

          {errors.manufacturing_unit_id && (
            <p className="mt-1 text-sm text-red-600">
              {errors.manufacturing_unit_id.message}
            </p>
          )}
        </div>

        <div />

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Period Start *
          </label>

          <input
            type="date"
            {...register("period_start", { required: "Period start is required" })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
          />

          {errors.period_start && (
            <p className="mt-1 text-sm text-red-600">
              {errors.period_start.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Period End *
          </label>

          <input
            type="date"
            {...register("period_end", { required: "Period end is required" })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
          />

          {errors.period_end && (
            <p className="mt-1 text-sm text-red-600">
              {errors.period_end.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Production Quantity *
          </label>

          <input
            type="number"
            step="any"
            {...register("production_quantity", {
              required: "Production quantity is required",
              valueAsNumber: true,
              min: { value: 0.01, message: "Must be greater than 0" },
            })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
          />

          {errors.production_quantity && (
            <p className="mt-1 text-sm text-red-600">
              {errors.production_quantity.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Production Unit *
          </label>

          <input
            type="text"
            {...register("production_unit", {
              required: "Production unit is required",
            })}
            placeholder="tonnes"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
          />

          {errors.production_unit && (
            <p className="mt-1 text-sm text-red-600">
              {errors.production_unit.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Remarks
        </label>

        <textarea
          {...register("remarks")}
          rows={2}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
        />
      </div>

      <div className="flex justify-end gap-3 border-t border-gray-200 pt-6">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg border border-gray-300 px-5 py-2 font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Saving..." : initialData ? "Update Record" : "Add Record"}
        </button>
      </div>
    </form>
  );
}
