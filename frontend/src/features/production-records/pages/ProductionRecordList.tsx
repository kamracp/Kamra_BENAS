import { useMemo, useState } from "react";
import toast from "react-hot-toast";

import {
  useProductionRecords,
  useCreateProductionRecord,
  useUpdateProductionRecord,
  useDeleteProductionRecord,
} from "../hooks/useProductionRecords";
import { useManufacturingUnits } from "../../manufacturing-units/hooks/useManufacturingUnits";

import ProductionRecordForm from "../components/ProductionRecordForm";

import type {
  ProductionRecord,
  ProductionRecordCreate,
} from "../api/productionRecordApi";

import ConfirmDialog from "../../../components/ui/ConfirmDialog";

export default function ProductionRecordList() {
  const { data: records = [], isLoading, isError } = useProductionRecords();
  const { data: units = [] } = useManufacturingUnits();

  const createMutation = useCreateProductionRecord();
  const updateMutation = useUpdateProductionRecord();
  const deleteMutation = useDeleteProductionRecord();

  const [showForm, setShowForm] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ProductionRecord | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const unitNameById = useMemo(() => {
    const map = new Map<number, string>();
    units.forEach((u) => map.set(u.id, `${u.unit_name} (${u.unit_code})`));
    return map;
  }, [units]);

  async function saveRecord(formData: ProductionRecordCreate) {
    try {
      if (selectedRecord) {
        await updateMutation.mutateAsync({ id: selectedRecord.id, data: formData });
      } else {
        await createMutation.mutateAsync(formData);
      }

      setShowForm(false);
      setSelectedRecord(null);
    } catch (error) {
      console.error(error);
      toast.error("Unable to save production record.");
    }
  }

  async function deleteRecord() {
    if (deleteId === null) return;

    try {
      await deleteMutation.mutateAsync(deleteId);
      setDeleteId(null);
    } catch (error) {
      console.error(error);
      toast.error("Unable to delete production record.");
    }
  }

  function openCreateDialog() {
    setSelectedRecord(null);
    setShowForm(true);
  }

  function openEditDialog(record: ProductionRecord) {
    setSelectedRecord(record);
    setShowForm(true);
  }

  function closeForm() {
    setSelectedRecord(null);
    setShowForm(false);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-10">
        Loading production records...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-600">
        Unable to load production records.
      </div>
    );
  }

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Production Records</h1>

          <p className="text-gray-500">
            Feeds the SEC/EnPI engine for each manufacturing unit
          </p>
        </div>

        <button
          onClick={openCreateDialog}
          className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white transition hover:bg-blue-700"
        >
          + Add Production Record
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border bg-white shadow">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="border-b px-4 py-3 text-left">Manufacturing Unit</th>
              <th className="border-b px-4 py-3 text-left">Period</th>
              <th className="border-b px-4 py-3 text-left">Production</th>
              <th className="border-b px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-10 text-center text-gray-500">
                  No production records found.
                </td>
              </tr>
            ) : (
              records.map((record: ProductionRecord) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="border-b px-4 py-3 font-medium">
                    {unitNameById.get(record.manufacturing_unit_id) ?? "-"}
                  </td>

                  <td className="border-b px-4 py-3">
                    {record.period_start} to {record.period_end}
                  </td>

                  <td className="border-b px-4 py-3">
                    {record.production_quantity} {record.production_unit}
                  </td>

                  <td className="border-b px-4 py-3 text-center">
                    <button
                      onClick={() => openEditDialog(record)}
                      className="mr-2 rounded bg-amber-500 px-3 py-1 text-white hover:bg-amber-600"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => setDeleteId(record.id)}
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
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <div>
                <h2 className="text-2xl font-bold">
                  {selectedRecord ? "Edit Production Record" : "Add Production Record"}
                </h2>
              </div>

              <button
                onClick={closeForm}
                className="text-3xl leading-none text-gray-500 hover:text-black"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              <ProductionRecordForm
                units={units}
                initialData={selectedRecord ?? undefined}
                onSubmit={saveRecord}
                loading={createMutation.isPending || updateMutation.isPending}
                onCancel={closeForm}
              />
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={deleteId !== null}
        title="Delete Production Record"
        message="Are you sure you want to delete this production record? This action cannot be undone."
        loading={deleteMutation.isPending}
        onCancel={() => setDeleteId(null)}
        onConfirm={deleteRecord}
      />
    </div>
  );
}
