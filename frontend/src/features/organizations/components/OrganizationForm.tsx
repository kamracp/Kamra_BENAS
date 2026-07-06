import { useEffect } from "react";
import { useForm } from "react-hook-form";

import type {
  Organization,
  OrganizationCreate,
} from "../api/organizationApi";

interface OrganizationFormProps {
  initialData?: Organization;
  onSubmit: (data: OrganizationCreate) => void;
  onCancel?: () => void;
  loading?: boolean;
}

export default function OrganizationForm({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
}: OrganizationFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<OrganizationCreate>();

  useEffect(() => {
    if (initialData) {
      reset({
        organization_code: initialData.organization_code,
        organization_name: initialData.organization_name,
        legal_name: initialData.legal_name ?? "",
        industry: initialData.industry ?? "",
        gstin: initialData.gstin ?? "",
        pan: initialData.pan ?? "",
        email: initialData.email ?? "",
        phone: initialData.phone ?? "",
        website: initialData.website ?? "",
        address_line_1: initialData.address_line_1 ?? "",
        address_line_2: initialData.address_line_2 ?? "",
        city: initialData.city ?? "",
        state: initialData.state ?? "",
        country: initialData.country ?? "",
        pincode: initialData.pincode ?? "",
        timezone: initialData.timezone ?? "",
        currency: initialData.currency ?? "",
        is_active: initialData.is_active,
      });
    } else {
      reset({
        organization_code: "",
        organization_name: "",
        legal_name: "",
        industry: "",
        gstin: "",
        pan: "",
        email: "",
        phone: "",
        website: "",
        address_line_1: "",
        address_line_2: "",
        city: "",
        state: "",
        country: "India",
        pincode: "",
        timezone: "Asia/Kolkata",
        currency: "INR",
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
          {initialData ? "Edit Organization" : "Create Organization"}
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Enter organization master information.
        </p>
      </div>

      {/* Identity Information */}
      <section className="space-y-4">
        <h3 className="border-b pb-2 text-lg font-semibold text-gray-700">
          Identity
        </h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Organization Code *
            </label>

            <input
              type="text"
              {...register("organization_code", {
                required: "Organization code is required",
              })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            />

            {errors.organization_code && (
              <p className="mt-1 text-sm text-red-600">
                {errors.organization_code.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Organization Name *
            </label>

            <input
              type="text"
              {...register("organization_name", {
                required: "Organization name is required",
              })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            />

            {errors.organization_name && (
              <p className="mt-1 text-sm text-red-600">
                {errors.organization_name.message}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Legal Name
            </label>

            <input
              type="text"
              {...register("legal_name")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </section>

      {/* Business Information */}
      <section className="space-y-4">
        <h3 className="border-b pb-2 text-lg font-semibold text-gray-700">
          Business Information
        </h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Industry
            </label>

            <input
              type="text"
              {...register("industry")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              GSTIN
            </label>

            <input
              type="text"
              {...register("gstin")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 uppercase focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              PAN
            </label>

            <input
              type="text"
              {...register("pan")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 uppercase focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </section>

            {/* Contact Information */}
      <section className="space-y-4">
        <h3 className="border-b pb-2 text-lg font-semibold text-gray-700">
          Contact Information
        </h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Email
            </label>

            <input
              type="email"
              {...register("email")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Phone
            </label>

            <input
              type="text"
              {...register("phone")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Website
            </label>

            <input
              type="url"
              {...register("website")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </section>

      {/* Address Information */}
      <section className="space-y-4">
        <h3 className="border-b pb-2 text-lg font-semibold text-gray-700">
          Address Information
        </h3>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Address Line 1
            </label>

            <input
              type="text"
              {...register("address_line_1")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Address Line 2
            </label>

            <input
              type="text"
              {...register("address_line_2")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                City
              </label>

              <input
                type="text"
                {...register("city")}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                State
              </label>

              <input
                type="text"
                {...register("state")}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Country
              </label>

              <input
                type="text"
                {...register("country")}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                PIN Code
              </label>

              <input
                type="text"
                {...register("pincode")}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </section>
            {/* Regional Settings */}
      <section className="space-y-4">
        <h3 className="border-b pb-2 text-lg font-semibold text-gray-700">
          Regional Settings
        </h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Time Zone
            </label>

            <input
              type="text"
              {...register("timezone")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Currency
            </label>

            <input
              type="text"
              {...register("currency")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 uppercase focus:border-blue-500 focus:outline-none"
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
                Active Organization
              </span>
            </label>
          </div>
        </div>
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
              ? "Update Organization"
              : "Create Organization"}
        </button>
      </div>
    </form>
  );
}