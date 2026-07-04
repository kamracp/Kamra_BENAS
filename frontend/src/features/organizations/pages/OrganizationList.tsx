import { useState } from "react";

import {
  useOrganizations,
  useCreateOrganization,
  useDeleteOrganization,
} from "../hooks/useOrganizations";

import OrganizationForm from "../components/OrganizationForm";

import type {
  Organization,
  OrganizationCreate,
} from "../api/organizationApi";

export default function OrganizationList() {
  const { data = [], isLoading, isError } = useOrganizations();

  const createMutation = useCreateOrganization();
  const deleteMutation = useDeleteOrganization();

  const [showForm, setShowForm] = useState(false);

  const [search, setSearch] = useState("");

  const filtered = data.filter((item) => {
    const keyword = search.toLowerCase();

    return (
      item.organization_name.toLowerCase().includes(keyword) ||
      item.organization_code.toLowerCase().includes(keyword) ||
      item.email.toLowerCase().includes(keyword)
    );
  });

  async function saveOrganization(
    data: OrganizationCreate
  ) {
    await createMutation.mutateAsync(data);
    setShowForm(false);
  }

  async function deleteOrganization(id: number) {
    if (!confirm("Delete Organization?")) return;

    await deleteMutation.mutateAsync(id);
  }

  if (isLoading)
    return (
      <div className="p-8">
        Loading Organizations...
      </div>
    );

  if (isError)
    return (
      <div className="p-8 text-red-600">
        Unable to load organizations.
      </div>
    );

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
          onClick={() => setShowForm(!showForm)}
          className="rounded bg-blue-600 px-5 py-2 text-white"
        >
          {showForm ? "Close" : "New Organization"}
        </button>

      </div>

      {showForm && (
        <OrganizationForm
          onSubmit={saveOrganization}
          loading={createMutation.isPending}
          onCancel={() => setShowForm(false)}
        />
      )}

      <input
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        placeholder="Search..."
        className="w-full rounded border px-4 py-2"
      />

      <table className="min-w-full border">

        <thead className="bg-gray-100">

          <tr>

            <th className="border p-3">Code</th>

            <th className="border p-3">
              Organization
            </th>

            <th className="border p-3">
              Email
            </th>

            <th className="border p-3">
              GSTIN
            </th>

            <th className="border p-3">
              Status
            </th>

            <th className="border p-3">
              Action
            </th>

          </tr>

        </thead>

        <tbody>

          {filtered.map((org: Organization) => (

            <tr key={org.id}>

              <td className="border p-3">
                {org.organization_code}
              </td>

              <td className="border p-3">
                {org.organization_name}
              </td>

              <td className="border p-3">
                {org.email}
              </td>

              <td className="border p-3">
                {org.gstin}
              </td>

              <td className="border p-3">
                {org.is_active
                  ? "Active"
                  : "Inactive"}
              </td>

              <td className="border p-3">

                <button
                  onClick={() =>
                    deleteOrganization(org.id)
                  }
                  className="rounded bg-red-600 px-3 py-1 text-white"
                >
                  Delete
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}