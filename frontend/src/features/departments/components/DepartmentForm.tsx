import { useEffect } from "react";
import { useForm } from "react-hook-form";

import type {
  Department,
  DepartmentCreate,
} from "../api/departmentApi";

interface DepartmentFormProps {
  initialData?: Department;
  onSubmit: (data: DepartmentCreate) => void;
  onCancel?: () => void;
  loading?: boolean;
}

export default function DepartmentForm({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
}: DepartmentFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DepartmentCreate>();

  useEffect(() => {
    if (initialData) {
      reset({
        department_code: initialData.department_code,
        department_name: initialData.department_name,
        description: initialData.description ?? "",
        is_active: initialData.is_active,
      });
    } else {
      reset({
        department_code: "",
        department_name: "",
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
      <div>
        <h2 className="text-xl font-semibold text-gray-800">
          {initialData ? "Edit Department" : "Create Department"}
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Enter department master information.
        </p>
      </div>

      <section className="space-y-4">
        <h3 className="border-b pb-2 text-lg font-semibold text-gray-700">
          Department Information
        </h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Department Code *
            </label>
            <input
              className="w-full rounded-lg border border-gray-300 p-2.5"
              placeholder="e.g. HR01"
              {...register("department_code", {
                required: "Department code is required",
              })}
            />
            {errors.department_code && (
              <p className="mt-1 text-sm text-red-500">
                {errors.department_code.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Department Name *
            </label>
            <input
              className="w-full rounded-lg border border-gray-300 p-2.5"
              placeholder="e.g. Human Resources"
              {...register("department_name", {
                required: "Department name is required",
              })}
            />
            {errors.department_name && (
              <p className="mt-1 text-sm text-red-500">
                {errors.department_name.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            className="w-full rounded-lg border border-gray-300 p-2.5"
            rows={3}
            placeholder="Optional description"
            {...register("description")}
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" {...register("is_active")} />
          Active
        </label>
      </section>

      <div className="flex gap-3">
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-6 py-2.5 font-semibold text-white disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </button>

        {onCancel && (
          <button
            type="button"
            className="rounded-lg border border-gray-300 px-6 py-2.5 font-semibold text-gray-700"
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
