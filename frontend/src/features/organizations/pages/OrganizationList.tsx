import { useMemo, useState } from "react";
import toast from "react-hot-toast";

import {
  useOrganizations,
  useCreateOrganization,
  useUpdateOrganization,
  useDeleteOrganization,
} from "../hooks/useOrganizations";

import OrganizationForm from "../components/OrganizationForm";

import type {
  Organization,
  OrganizationCreate,
} from "../api/organizationApi";

import ConfirmDialog from "../../../components/ui/ConfirmDialog";

export default function OrganizationList() {
  const { data = [], isLoading, isError } = useOrganizations();

  const createMutation = useCreateOrganization();
  const updateMutation = useUpdateOrganization();
  const deleteMutation = useDeleteOrganization();

  const [showForm, setShowForm] = useState(false);

  const [selectedOrganization, setSelectedOrganization] =
    useState<Organization | null>(null);

  const [deleteId, setDeleteId] =
    useState<number | null>(null);

  const [search, setSearch] = useState("");

 const filteredOrganizations = useMemo(() => {
  const keyword = search.trim().toLowerCase();

  if (!keyword) {
    return data;
  }

  return data.filter((item) => {
    return (
      item.organization_code
        .toLowerCase()
        .includes(keyword) ||
      item.organization_name
        .toLowerCase()
        .includes(keyword) ||
      (item.legal_name ?? "")
        .toLowerCase()
        .includes(keyword) ||
      (item.email ?? "")
        .toLowerCase()
        .includes(keyword) ||
      (item.gstin ?? "")
        .toLowerCase()
        .includes(keyword) ||
      (item.pan ?? "")
        .toLowerCase()
        .includes(keyword)
    );
  });
}, [data, search]);

  async function saveOrganization(
    formData: OrganizationCreate
  ) {
    try {
      if (selectedOrganization) {
        await updateMutation.mutateAsync({
          id: selectedOrganization.id,
          data: formData,
        });

        toast.success(
          "Organization updated successfully."
        );
      } else {
        await createMutation.mutateAsync(formData);

        toast.success(
          "Organization created successfully."
        );
      }

      setShowForm(false);
      setSelectedOrganization(null);
    } catch (error) {
      console.error(error);

      toast.error(
        "Unable to save organization."
      );
    }
  }

  async function deleteOrganization() {
    if (deleteId === null) return;

    try {
      await deleteMutation.mutateAsync(deleteId);

      toast.success(
        "Organization deleted successfully."
      );

      setDeleteId(null);
    } catch (error) {
      console.error(error);

      toast.error(
        "Unable to delete organization."
      );
    }
  }

  function openCreateDialog() {
    setSelectedOrganization(null);
    setShowForm(true);
  }

  function openEditDialog(
    organization: Organization
  ) {
    setSelectedOrganization(organization);
    setShowForm(true);
  }

  function closeForm() {
    setSelectedOrganization(null);
    setShowForm(false);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-10">
        Loading organizations...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-600">
        Unable to load organizations.
      </div>
    );
  }
    return (
    <div className="space-y-6 p-8">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-bold">
            Organizations
          </h1>

          <p className="text-gray-500">
            BENAS Organization Management
          </p>

        </div>

        <button
          onClick={openCreateDialog}
          className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white transition hover:bg-blue-700"
        >
          + New Organization
        </button>

      </div>

      <div className="rounded-xl border bg-white p-5 shadow-sm">

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by Code, Name, GSTIN, PAN or Email..."
          className="w-full rounded-lg border px-4 py-3 focus:border-blue-500 focus:outline-none"
        />

      </div>

      <div className="overflow-hidden rounded-xl border bg-white shadow">

        <table className="min-w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="border-b px-4 py-3 text-left">
                Code
              </th>

              <th className="border-b px-4 py-3 text-left">
                Organization
              </th>

              <th className="border-b px-4 py-3 text-left">
                Legal Name
              </th>

              <th className="border-b px-4 py-3 text-left">
                GSTIN
              </th>

              <th className="border-b px-4 py-3 text-left">
                Email
              </th>

              <th className="border-b px-4 py-3 text-center">
                Status
              </th>

              <th className="border-b px-4 py-3 text-center">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {filteredOrganizations.length === 0 ? (

              <tr>

                <td
                  colSpan={7}
                  className="py-10 text-center text-gray-500"
                >
                  No organizations found.
                </td>

              </tr>

            ) : (

              filteredOrganizations.map(
                (organization: Organization) => (

                  <tr
                    key={organization.id}
                    className="hover:bg-gray-50"
                  >

                    <td className="border-b px-4 py-3">
                      {organization.organization_code}
                    </td>

                    <td className="border-b px-4 py-3 font-medium">
                      {organization.organization_name}
                    </td>

                    <td className="border-b px-4 py-3">
                      {organization.legal_name}
                    </td>

                    <td className="border-b px-4 py-3">
                      {organization.gstin}
                    </td>

                    <td className="border-b px-4 py-3">
                      {organization.email}
                    </td>

                    <td className="border-b px-4 py-3 text-center">

                      <span
                        className={
                          organization.is_active
                            ? "rounded bg-green-100 px-3 py-1 text-sm font-medium text-green-700"
                            : "rounded bg-red-100 px-3 py-1 text-sm font-medium text-red-700"
                        }
                      >
                        {organization.is_active
                          ? "Active"
                          : "Inactive"}
                      </span>

                    </td>

                    <td className="border-b px-4 py-3 text-center">

                      <button
                        onClick={() =>
                          openEditDialog(organization)
                        }
                        className="mr-2 rounded bg-amber-500 px-3 py-1 text-white hover:bg-amber-600"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          setDeleteId(organization.id)
                        }
                        className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700"
                      >
                        Delete
                      </button>

                    </td>

                  </tr>
                )
              )

            )}

          </tbody>

        </table>

      </div>
            {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">

          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white shadow-2xl">

            <div className="flex items-center justify-between border-b px-6 py-4">

              <div>

                <h2 className="text-2xl font-bold">

                  {selectedOrganization
                    ? "Edit Organization"
                    : "New Organization"}

                </h2>

                <p className="text-sm text-gray-500">

                  {selectedOrganization
                    ? "Update organization information."
                    : "Create a new organization."}

                </p>

              </div>

              <button
                onClick={closeForm}
                className="text-3xl leading-none text-gray-500 hover:text-black"
              >
                ×
              </button>

            </div>

            <div className="p-6">

              <OrganizationForm
                initialData={
                  selectedOrganization ?? undefined
                }
                onSubmit={saveOrganization}
                loading={
                  createMutation.isPending ||
                  updateMutation.isPending
                }
                onCancel={closeForm}
              />

            </div>

          </div>

        </div>
      )}

      <ConfirmDialog
        open={deleteId !== null}
        title="Delete Organization"
        message="Are you sure you want to delete this organization? This action cannot be undone."
        loading={deleteMutation.isPending}
        onCancel={() => setDeleteId(null)}
        onConfirm={deleteOrganization}
      />

    </div>
  );
}