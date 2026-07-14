import { useEffect } from "react";
import { useForm } from "react-hook-form";

import {
  useOrganizations,
} from "../../organizations/hooks/useOrganizations";

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
  const { data: organizations = [] } = useOrganizations();

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
        organization_id: initialData.organization_id,
        description: initialData.description ?? "",
        is_active: initialData.is_active,
      });
    } else {
      reset({
        department_code: "",
        department_name: "",
        organization_id: 0,
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
          {initialData
            ? "Edit Department"
            : "Create Department"}
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Enter department master information.
        </p>
      </div>

      {/* Department Information */}
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
              type="text"
              {...register("department_code", {
                required: "Department code is required",
              })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            />

            {errors.department_code && (
              <p className="mt-1 text-sm text-red-600">
                {errors.department_code.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Department Name *
            </label>

            <input
              type="text"
              {...register("department_name", {
                required: "Department name is required",
              })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            />

            {errors.department_name && (
              <p className="mt-1 text-sm text-red-600">
                {errors.department_name.message}
              </p>
            )}
          </div>
        </div>
      </section>
            {/* Organization Information */}
      <section className="space-y-4">
        <h3 className="border-b pb-2 text-lg font-semibold text-gray-700">
          Organization
        </h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Organization *
            </label>

            <select
              {...register("organization_id", {
                valueAsNumber: true,
                required: "Organization is required",
                min: {
                  value: 1,
                  message: "Please select an organization",
                },
              })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            >
              <option value={0}>
                -- Select Organization --
              </option>

              {organizations.map((organization) => (
                <option
                  key={organization.id}
                  value={organization.id}
                >
                  {organization.organization_name}
                </option>
              ))}
            </select>

            {errors.organization_id && (
              <p className="mt-1 text-sm text-red-600">
                {errors.organization_id.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Description
            </label>

            <textarea
              rows={4}
              {...register("description")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </section>
            {/* Status */}
      <section className="space-y-4">
        <h3 className="border-b pb-2 text-lg font-semibold text-gray-700">
          Status
        </h3>

        <label className="inline-flex items-center gap-3">
          <input
            type="checkbox"
            {...register("is_active")}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />

          <span className="text-sm font-medium text-gray-700">
            Active Department
          </span>
        </label>
      </section>

      {/* Action Buttons */}
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
          {loading
            ? "Saving..."
            : initialData
              ? "Update Department"
              : "Create Department"}
        </button>
      </div>
    </form>
  );
}