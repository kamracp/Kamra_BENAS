import { useMemo, useState } from "react";
import toast from "react-hot-toast";

import {
  useFloors,
  useCreateFloor,
  useUpdateFloor,
  useDeleteFloor,
} from "../hooks/useFloors";
import { useBuildings } from "../../buildings/hooks/useBuildings";

import FloorForm from "../components/FloorForm";

import type { Floor, FloorCreate } from "../api/floorApi";

import ConfirmDialog from "../../../components/ui/ConfirmDialog";

export default function FloorList() {
  const { data: floors = [], isLoading, isError } = useFloors();
  const { data: buildings = [] } = useBuildings();

  const createMutation = useCreateFloor();
  const updateMutation = useUpdateFloor();
  const deleteMutation = useDeleteFloor();

  const [showForm, setShowForm] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState<Floor | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const buildingNameById = useMemo(() => {
    const map = new Map<number, string>();
    buildings.forEach((b) => map.set(b.id, b.building_name));
    return map;
  }, [buildings]);

  const filteredFloors = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return floors;
    return floors.filter(
      (f) =>
        f.floor_code.toLowerCase().includes(keyword) ||
        f.floor_name.toLowerCase().includes(keyword)
    );
  }, [floors, search]);

  async function saveFloor(formData: FloorCreate) {
    try {
      if (selectedFloor) {
        await updateMutation.mutateAsync({ id: selectedFloor.id, data: formData });
      } else {
        await createMutation.mutateAsync(formData);
      }
      setShowForm(false);
      setSelectedFloor(null);
    } catch (error) {
      console.error(error);
      toast.error("Unable to save floor.");
    }
  }

  async function deleteFloor() {
    if (deleteId === null) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      setDeleteId(null);
    } catch (error) {
      console.error(error);
      toast.error("Unable to delete floor.");
    }
  }

  function openCreateDialog() {
    setSelectedFloor(null);
    setShowForm(true);
  }

  function openEditDialog(floor: Floor) {
    setSelectedFloor(floor);
    setShowForm(true);
  }

  function closeForm() {
    setSelectedFloor(null);
    setShowForm(false);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-10">
        Loading floors...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-600">
        Unable to load floors.
      </div>
    );
  }

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Floors</h1>
          <p className="text-gray-500">Manage floors across your buildings</p>
        </div>
        <button
          onClick={openCreateDialog}
          className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white transition hover:bg-blue-700"
        >
          + Add Floor
        </button>
      </div>

      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by Code or Name..."
          className="w-full rounded-lg border px-4 py-3 focus:border-blue-500 focus:outline-none"
        />
      </div>

      <div className="overflow-hidden rounded-xl border bg-white shadow">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="border-b px-4 py-3 text-left">Code</th>
              <th className="border-b px-4 py-3 text-left">Name</th>
              <th className="border-b px-4 py-3 text-left">Building</th>
              <th className="border-b px-4 py-3 text-left">Floor #</th>
              <th className="border-b px-4 py-3 text-left">Gross Area</th>
              <th className="border-b px-4 py-3 text-center">Status</th>
              <th className="border-b px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredFloors.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-10 text-center text-gray-500">
                  No floors found.
                </td>
              </tr>
            ) : (
              filteredFloors.map((floor: Floor) => (
                <tr key={floor.id} className="hover:bg-gray-50">
                  <td className="border-b px-4 py-3">{floor.floor_code}</td>
                  <td className="border-b px-4 py-3 font-medium">
                    {floor.floor_name}
                  </td>
                  <td className="border-b px-4 py-3">
                    {buildingNameById.get(floor.building_id) ?? "-"}
                  </td>
                  <td className="border-b px-4 py-3">{floor.floor_number}</td>
                  <td className="border-b px-4 py-3">
                    {floor.gross_area_sqm ?? "-"}
                  </td>
                  <td className="border-b px-4 py-3 text-center">
                    <span
                      className={
                        floor.is_active
                          ? "rounded bg-green-100 px-3 py-1 text-sm font-medium text-green-700"
                          : "rounded bg-red-100 px-3 py-1 text-sm font-medium text-red-700"
                      }
                    >
                      {floor.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="border-b px-4 py-3 text-center">
                    <button
                      onClick={() => openEditDialog(floor)}
                      className="mr-2 rounded bg-amber-500 px-3 py-1 text-white hover:bg-amber-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteId(floor.id)}
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
                  {selectedFloor ? "Edit Floor" : "Add Floor"}
                </h2>
                <p className="text-sm text-gray-500">
                  {selectedFloor
                    ? "Update floor information."
                    : "Register a new floor."}
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
              <FloorForm
                buildings={buildings}
                initialData={selectedFloor ?? undefined}
                onSubmit={saveFloor}
                loading={createMutation.isPending || updateMutation.isPending}
                onCancel={closeForm}
              />
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={deleteId !== null}
        title="Delete Floor"
        message="Are you sure you want to delete this floor? This action cannot be undone."
        loading={deleteMutation.isPending}
        onCancel={() => setDeleteId(null)}
        onConfirm={deleteFloor}
      />
    </div>
  );
}