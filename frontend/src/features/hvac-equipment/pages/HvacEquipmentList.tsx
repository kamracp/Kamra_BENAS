import { useMemo, useState } from "react";
import toast from "react-hot-toast";

import {
  useHvacEquipment,
  useCreateHvacEquipment,
  useUpdateHvacEquipment,
  useDeleteHvacEquipment,
} from "../hooks/useHvacEquipment";
import { useBuildings } from "../../buildings/hooks/useBuildings";

import HvacEquipmentForm from "../components/HvacEquipmentForm";

import type { HvacEquipment, HvacEquipmentCreate } from "../api/hvacEquipmentApi";

import ConfirmDialog from "../../../components/ui/ConfirmDialog";

export default function HvacEquipmentList() {
  const { data: equipmentList = [], isLoading, isError } = useHvacEquipment();
  const { data: buildings = [] } = useBuildings();

  const createMutation = useCreateHvacEquipment();
  const updateMutation = useUpdateHvacEquipment();
  const deleteMutation = useDeleteHvacEquipment();

  const [showForm, setShowForm] = useState(false);

  const [selectedEquipment, setSelectedEquipment] =
    useState<HvacEquipment | null>(null);

  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [search, setSearch] = useState("");

  const buildingNameById = useMemo(() => {
    const map = new Map<number, string>();
    buildings.forEach((b) => map.set(b.id, b.building_name));
    return map;
  }, [buildings]);

  const filteredEquipment = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return equipmentList;
    }

    return equipmentList.filter((item) => {
      return (
        item.equipment_code.toLowerCase().includes(keyword) ||
        item.equipment_name.toLowerCase().includes(keyword) ||
        item.equipment_type.toLowerCase().includes(keyword)
      );
    });
  }, [equipmentList, search]);

  async function saveEquipment(formData: HvacEquipmentCreate) {
    try {
      if (selectedEquipment) {
        await updateMutation.mutateAsync({
          id: selectedEquipment.id,
          data: formData,
        });

        toast.success("Equipment updated successfully.");
      } else {
        await createMutation.mutateAsync(formData);

        toast.success("Equipment created successfully.");
      }

      setShowForm(false);
      setSelectedEquipment(null);
    } catch (error) {
      console.error(error);

      toast.error("Unable to save equipment.");
    }
  }

  async function deleteEquipment() {
    if (deleteId === null) return;

    try {
      await deleteMutation.mutateAsync(deleteId);

      toast.success("Equipment deleted successfully.");

      setDeleteId(null);
    } catch (error) {
      console.error(error);

      toast.error("Unable to delete equipment.");
    }
  }

  function openCreateDialog() {
    setSelectedEquipment(null);
    setShowForm(true);
  }

  function openEditDialog(equipment: HvacEquipment) {
    setSelectedEquipment(equipment);
    setShowForm(true);
  }

  function closeForm() {
    setSelectedEquipment(null);
    setShowForm(false);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-10">
        Loading HVAC equipment...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-600">
        Unable to load HVAC equipment.
      </div>
    );
  }

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">HVAC Equipment</h1>

          <p className="text-gray-500">
            Engineering-based energy &amp; emissions estimation
          </p>
        </div>

        <button
          onClick={openCreateDialog}
          className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white transition hover:bg-blue-700"
        >
          + Add Equipment
        </button>
      </div>

      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by Code, Name or Type..."
          className="w-full rounded-lg border px-4 py-3 focus:border-blue-500 focus:outline-none"
        />
      </div>

      <div className="overflow-hidden rounded-xl border bg-white shadow">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="border-b px-4 py-3 text-left">Code</th>
              <th className="border-b px-4 py-3 text-left">Name</th>
              <th className="border-b px-4 py-3 text-left">Type</th>
              <th className="border-b px-4 py-3 text-left">Building</th>
              <th className="border-b px-4 py-3 text-left">Capacity</th>
              <th className="border-b px-4 py-3 text-left">Est. Energy</th>
              <th className="border-b px-4 py-3 text-center">Status</th>
              <th className="border-b px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredEquipment.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-10 text-center text-gray-500">
                  No HVAC equipment found.
                </td>
              </tr>
            ) : (
              filteredEquipment.map((equipment: HvacEquipment) => (
                <tr key={equipment.id} className="hover:bg-gray-50">
                  <td className="border-b px-4 py-3">
                    {equipment.equipment_code}
                  </td>

                  <td className="border-b px-4 py-3 font-medium">
                    {equipment.equipment_name}
                  </td>

                  <td className="border-b px-4 py-3">
                    {equipment.equipment_type}
                  </td>

                  <td className="border-b px-4 py-3">
                    {buildingNameById.get(equipment.building_id) ?? "-"}
                  </td>

                  <td className="border-b px-4 py-3">
                    {equipment.capacity_kw} kW
                  </td>

                  <td className="border-b px-4 py-3">
                    {equipment.estimated_monthly_energy_kwh.toLocaleString()}{" "}
                    kWh/mo
                  </td>

                  <td className="border-b px-4 py-3 text-center">
                    <span
                      className={
                        equipment.is_active
                          ? "rounded bg-green-100 px-3 py-1 text-sm font-medium text-green-700"
                          : "rounded bg-red-100 px-3 py-1 text-sm font-medium text-red-700"
                      }
                    >
                      {equipment.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="border-b px-4 py-3 text-center">
                    <button
                      onClick={() => openEditDialog(equipment)}
                      className="mr-2 rounded bg-amber-500 px-3 py-1 text-white hover:bg-amber-600"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => setDeleteId(equipment.id)}
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
                  {selectedEquipment ? "Edit Equipment" : "Add Equipment"}
                </h2>

                <p className="text-sm text-gray-500">
                  {selectedEquipment
                    ? "Update HVAC equipment information."
                    : "Register a new HVAC equipment unit."}
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
              <HvacEquipmentForm
                buildings={buildings}
                initialData={selectedEquipment ?? undefined}
                onSubmit={saveEquipment}
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
        title="Delete HVAC Equipment"
        message="Are you sure you want to delete this equipment? This action cannot be undone."
        loading={deleteMutation.isPending}
        onCancel={() => setDeleteId(null)}
        onConfirm={deleteEquipment}
      />
    </div>
  );
}
