import { useMemo, useState } from "react";
import toast from "react-hot-toast";

import {
  useBuildings,
  useCreateBuilding,
  useUpdateBuilding,
  useDeleteBuilding,
} from "../hooks/useBuildings";

import BuildingForm from "../components/BuildingForm";

import type { Building, BuildingCreate } from "../api/buildingApi";

import ConfirmDialog from "../../../components/ui/ConfirmDialog";

export default function BuildingList() {
  const { data = [], isLoading, isError } = useBuildings();

  const createMutation = useCreateBuilding();
  const updateMutation = useUpdateBuilding();
  const deleteMutation = useDeleteBuilding();

  const [showForm, setShowForm] = useState(false);

  const [selectedBuilding, setSelectedBuilding] =
    useState<Building | null>(null);

  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [search, setSearch] = useState("");

  const filteredBuildings = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return data;
    }

    return data.filter((item) => {
      return (
        item.building_code.toLowerCase().includes(keyword) ||
        item.building_name.toLowerCase().includes(keyword) ||
        (item.city ?? "").toLowerCase().includes(keyword) ||
        (item.building_type ?? "").toLowerCase().includes(keyword)
      );
    });
  }, [data, search]);

  async function saveBuilding(formData: BuildingCreate) {
    try {
      if (selectedBuilding) {
        await updateMutation.mutateAsync({
          id: selectedBuilding.id,
          data: formData,
        });

        toast.success("Building updated successfully.");
      } else {
        await createMutation.mutateAsync(formData);

        toast.success("Building created successfully.");
      }

      setShowForm(false);
      setSelectedBuilding(null);
    } catch (error) {
      console.error(error);

      toast.error("Unable to save building.");
    }
  }

  async function deleteBuilding() {
    if (deleteId === null) return;

    try {
      await deleteMutation.mutateAsync(deleteId);

      toast.success("Building deleted successfully.");

      setDeleteId(null);
    } catch (error) {
      console.error(error);

      toast.error("Unable to delete building.");
    }
  }

  function openCreateDialog() {
    setSelectedBuilding(null);
    setShowForm(true);
  }

  function openEditDialog(building: Building) {
    setSelectedBuilding(building);
    setShowForm(true);
  }

  function closeForm() {
    setSelectedBuilding(null);
    setShowForm(false);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-10">
        Loading buildings...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-600">
        Unable to load buildings.
      </div>
    );
  }

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Buildings</h1>

          <p className="text-gray-500">
            BENAS Building Master Management
          </p>
        </div>

        <button
          onClick={openCreateDialog}
          className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white transition hover:bg-blue-700"
        >
          + New Building
        </button>
      </div>

      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by Code, Name, City or Type..."
          className="w-full rounded-lg border px-4 py-3 focus:border-blue-500 focus:outline-none"
        />
      </div>

      <div className="overflow-hidden rounded-xl border bg-white shadow">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="border-b px-4 py-3 text-left">Code</th>
              <th className="border-b px-4 py-3 text-left">Building</th>
              <th className="border-b px-4 py-3 text-left">Type</th>
              <th className="border-b px-4 py-3 text-left">City</th>
              <th className="border-b px-4 py-3 text-left">Floor Area</th>
              <th className="border-b px-4 py-3 text-center">Status</th>
              <th className="border-b px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredBuildings.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-10 text-center text-gray-500">
                  No buildings found.
                </td>
              </tr>
            ) : (
              filteredBuildings.map((building: Building) => (
                <tr key={building.id} className="hover:bg-gray-50">
                  <td className="border-b px-4 py-3">
                    {building.building_code}
                  </td>

                  <td className="border-b px-4 py-3 font-medium">
                    {building.building_name}
                  </td>

                  <td className="border-b px-4 py-3">
                    {building.building_type}
                  </td>

                  <td className="border-b px-4 py-3">{building.city}</td>

                  <td className="border-b px-4 py-3">
                    {building.total_floor_area
                      ? `${building.total_floor_area} sq.m`
                      : "-"}
                  </td>

                  <td className="border-b px-4 py-3 text-center">
                    <span
                      className={
                        building.is_active
                          ? "rounded bg-green-100 px-3 py-1 text-sm font-medium text-green-700"
                          : "rounded bg-red-100 px-3 py-1 text-sm font-medium text-red-700"
                      }
                    >
                      {building.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="border-b px-4 py-3 text-center">
                    <button
                      onClick={() => openEditDialog(building)}
                      className="mr-2 rounded bg-amber-500 px-3 py-1 text-white hover:bg-amber-600"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => setDeleteId(building.id)}
                      className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
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
                  {selectedBuilding ? "Edit Building" : "New Building"}
                </h2>

                <p className="text-sm text-gray-500">
                  {selectedBuilding
                    ? "Update building information."
                    : "Create a new building."}
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
              <BuildingForm
                initialData={selectedBuilding ?? undefined}
                onSubmit={saveBuilding}
                loading={
                  createMutation.isPending || updateMutation.isPending
                }
                onCancel={closeForm}
              />
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={deleteId !== null}
        title="Delete Building"
        message="Are you sure you want to delete this building? This action cannot be undone."
        loading={deleteMutation.isPending}
        onCancel={() => setDeleteId(null)}
        onConfirm={deleteBuilding}
      />
    </div>
  );
}
