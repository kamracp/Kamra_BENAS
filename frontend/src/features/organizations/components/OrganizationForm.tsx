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
        legal_name: initialData.legal_name,
        gstin: initialData.gstin,
        pan: initialData.pan,
        email: initialData.email,
        phone: initialData.phone,
        website: initialData.website,
        address: initialData.address,
        city: initialData.city,
        state: initialData.state,
        country: initialData.country,
        pincode: initialData.pincode,
      });
    }
  }, [initialData, reset]);

  return (
  <form
    onSubmit={handleSubmit(onSubmit)}
    className="space-y-6 rounded-lg border bg-white p-6 shadow"
  >
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

      <div>
        <label className="mb-1 block text-sm font-medium">
          Organization Code
        </label>

        <input
          {...register("organization_code", {
            required: "Organization Code is required",
          })}
          className="w-full rounded border px-3 py-2"
        />

        {errors.organization_code && (
          <p className="mt-1 text-sm text-red-600">
            {errors.organization_code.message}
          </p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Organization Name
        </label>

        <input
          {...register("organization_name", {
            required: "Organization Name is required",
          })}
          className="w-full rounded border px-3 py-2"
        />

        {errors.organization_name && (
          <p className="mt-1 text-sm text-red-600">
            {errors.organization_name.message}
          </p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Legal Name
        </label>

        <input
          {...register("legal_name")}
          className="w-full rounded border px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          GSTIN
        </label>

        <input
          {...register("gstin")}
          className="w-full rounded border px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          PAN
        </label>

        <input
          {...register("pan")}
          className="w-full rounded border px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Email
        </label>

        <input
          type="email"
          {...register("email")}
          className="w-full rounded border px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Phone
        </label>

        <input
          {...register("phone")}
          className="w-full rounded border px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Website
        </label>

        <input
          {...register("website")}
          className="w-full rounded border px-3 py-2"
        />
      </div>

      <div className="md:col-span-2">
        <label className="mb-1 block text-sm font-medium">
          Address
        </label>

        <textarea
          rows={3}
          {...register("address")}
          className="w-full rounded border px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          City
        </label>

        <input
          {...register("city")}
          className="w-full rounded border px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          State
        </label>

        <input
          {...register("state")}
          className="w-full rounded border px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Country
        </label>

        <input
          {...register("country")}
          className="w-full rounded border px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          PIN Code
        </label>

        <input
          {...register("pincode")}
          className="w-full rounded border px-3 py-2"
        />
      </div>

    </div>

    <div className="flex justify-end gap-3">

      <button
        type="button"
        onClick={onCancel}
        className="rounded border px-5 py-2"
      >
        Cancel
      </button>

      <button
        type="submit"
        disabled={loading}
        className="rounded bg-blue-600 px-5 py-2 text-white"
      >
        {loading ? "Saving..." : "Save Organization"}
      </button>

    </div>

  </form>
);
}