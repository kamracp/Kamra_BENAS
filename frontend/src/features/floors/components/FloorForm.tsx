import { useEffect } from "react";
import { useForm } from "react-hook-form";

import type { Floor, FloorCreate } from "../api/floorApi";

interface FloorFormProps {
  buildings: { id: number; building_name: string }[];
  initialData?: Floor;
  defaultBuildingId?: number;
  onSubmit: (data: FloorCreate) => void;
  onCancel?: () => void;
  loading?: boolean;
}

export default function FloorForm({
  buildings,
  initialData,
  defaultBuildingId,
  onSubmit,
  onCancel,
  loading = false,
}: FloorFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FloorCreate>();

  useEffect(() => {
    if (initialData) {
      reset({
        building_id: initialData.building_id,
        floor_code: initialData.floor_code,
        floor_name: initialData.floor_name,
        floor_number: initialData.floor_number,
        gross_area_sqm: initialData.gross_area_sqm ?? undefined,
        conditioned_area_sqm: initialData.conditioned_area_sqm ?? undefined,
        clear_height_m: initialData.clear_height_m ?? undefined,
        occupancy_capacity: initialData.occupancy_capacity ?? undefined,
        remarks: initialData.remarks ?? "",
        is_active: initialData.is_active,
      });
    } else {
      reset({
        building_id: defaultBuildingId ?? undefined,
        floor_code: "",
        floor_name: "",
        floor_number: undefined,
        gross_area_sqm: undefined,
        conditioned_area_sqm: undefined,
        clear_height_m: undefined,
        occupancy_capacity: undefined,
        remarks: "",
        is_active: true,
      });
    }
  }, [initialData, defaultBuildingId, reset]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      <div>
        <h2 className="text-xl font-semibold text-gray-800">
          {initialData ? "Edit Floor" : "Add Floor"}
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Enter floor details for the building.
        </p>
      </div>

      <section className="space-y-4">
        <h3 className="border-b pb-2 text-lg font-semibold text-gray-700">
          Identity
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Building *
            </label>
            <select
              {...register("building_id", {
                required: "Building is required",
                valueAsNumber: true,
              })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            >
              <option value="">Select building...</option>
              {buildings.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.building_name}
                </option>
              ))}
            </select>
            {errors.building_id && (
              <p className="mt-1 text-sm text-red-600">
                {errors.building_id.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Floor Code *
            </label>
            <input
              type="text"
              {...register("floor_code", { required: "Floor code is required" })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            />
            {errors.floor_code && (
              <p className="mt-1 text-sm text-red-600">
                {errors.floor_code.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Floor Name *
            </label>
            <input
              type="text"
              {...register("floor_name", { required: "Floor name is required" })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            />
            {errors.floor_name && (
              <p className="mt-1 text-sm text-red-600">
                {errors.floor_name.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Floor Number *
            </label>
            <input
              type="number"
              {...register("floor_number", {
                required: "Floor number is required",
                valueAsNumber: true,
              })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            />
            {errors.floor_number && (
              <p className="mt-1 text-sm text-red-600">
                {errors.floor_number.message}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="border-b pb-2 text-lg font-semibold text-gray-700">
          Area &amp; Capacity
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Gross Area (sqm)
            </label>
            <input
              type="number"
              step="any"
              {...register("gross_area_sqm", { valueAsNumber: true })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Conditioned Area (sqm)
            </label>
            <input
              type="number"
              step="any"
              {...register("conditioned_area_sqm", { valueAsNumber: true })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Clear Height (m)
            </label>
            <input
              type="number"
              step="any"
              {...register("clear_height_m", { valueAsNumber: true })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Occupancy Capacity
            </label>
            <input
              type="number"
              {...register("occupancy_capacity", { valueAsNumber: true })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="border-b pb-2 text-lg font-semibold text-gray-700">
          Additional Information
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Remarks
            </label>
            <input
              type="text"
              {...register("remarks")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div className="flex items-end">
            <label className="inline-flex items-center gap-3">
              <input
                type="checkbox"
                {...register("is_active")}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Active Floor
              </span>
            </label>
          </div>
        </div>
      </section>

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
          {loading ? "Saving..." : initialData ? "Update Floor" : "Add Floor"}
        </button>
      </div>
    </form>
  );
}