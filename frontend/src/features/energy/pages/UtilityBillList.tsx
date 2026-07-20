import { useState } from "react";
import { Plus, Receipt } from "lucide-react";
import UtilityBillForm from "../components/UtilityBillForm";
import {
  useUtilityBills,
  useUtilityBillsByMeter,
  useCreateUtilityBill,
  useUpdateUtilityBill,
  useDeleteUtilityBill,
  type UtilityBill,
} from "../hooks/useUtilityBills";
import { useEnergyMeters } from "../hooks/useEnergyMeters";

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(value?: string): string {
  if (!value) return "—";
  const d = new Date(value);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatAmount(amount?: number, currency?: string): string {
  if (amount === undefined || amount === null) return "—";
  return `${currency ?? "INR"} ${amount.toLocaleString("en-IN")}`;
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function UtilityBillList() {
  const [showForm, setShowForm] = useState(false);
  const [editingBill, setEditingBill] = useState<UtilityBill | null>(null);
  const [meterFilter, setMeterFilter] = useState<number>(0);

  const { data: meters = [] } = useEnergyMeters();
  const allBills = useUtilityBills();
  const filteredBills = useUtilityBillsByMeter(meterFilter);

  const activeQuery = meterFilter ? filteredBills : allBills;
  const { data: bills = [], isLoading, isError } = activeQuery;

  const createBill = useCreateUtilityBill();
  const updateBill = useUpdateUtilityBill();
  const deleteBill = useDeleteUtilityBill();

  // meter_id -> meter lookup for table display
  const meterById = new Map(meters.map((m) => [m.id, m]));

  function closeForm() {
    setShowForm(false);
    setEditingBill(null);
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <h1 className="mb-4 text-2xl font-bold">Utility Bills</h1>
        <p>Loading bills...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <h1 className="mb-4 text-2xl font-bold">Utility Bills</h1>
        <p className="text-red-600">Unable to load utility bills.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold">
            <Receipt size={28} className="text-emerald-600" />
            Utility Bills
          </h1>
          <p className="text-gray-500">
            Record consumption and costs for each meter, bill by bill.
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          <Plus size={18} />
          Add Bill
        </button>
      </div>

      {/* Meter filter */}
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-gray-700">
          Filter by meter:
        </label>
        <select
          className="rounded-lg border border-gray-300 p-2 text-sm"
          value={meterFilter}
          onChange={(e) => setMeterFilter(Number(e.target.value))}
        >
          <option value={0}>All meters</option>
          {meters.map((m) => (
            <option key={m.id} value={m.id}>
              {m.meter_name} ({m.meter_code})
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border bg-white shadow">
        <table className="min-w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">Bill No.</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Meter</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Period</th>
              <th className="px-4 py-3 text-right text-sm font-semibold">Consumption</th>
              <th className="px-4 py-3 text-right text-sm font-semibold">Amount</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Due Date</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bills.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-gray-500">
                  No bills found. Add your first bill.
                </td>
              </tr>
            ) : (
              bills.map((bill) => {
                const meter = meterById.get(bill.meter_id);
                return (
                  <tr key={bill.id} className="border-t hover:bg-slate-50">
                    <td className="px-4 py-3 font-mono text-sm">
                      {bill.bill_number ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">
                      {meter
                        ? `${meter.meter_name} (${meter.meter_code})`
                        : `Meter #${bill.meter_id}`}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {formatDate(bill.billing_period_start)} –{" "}
                      {formatDate(bill.billing_period_end)}
                    </td>
                    <td className="px-4 py-3 text-right text-sm">
                      {bill.consumption.toLocaleString("en-IN")}{" "}
                      <span className="text-gray-500">{meter?.unit ?? ""}</span>
                    </td>
                    <td className="px-4 py-3 text-right text-sm">
                      {formatAmount(bill.amount, bill.currency)}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {formatDate(bill.due_date)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            setEditingBill(bill);
                            setShowForm(true);
                          }}
                          className="text-sm text-blue-600 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            if (
                              confirm(
                                `Delete bill "${bill.bill_number ?? bill.id}"?`
                              )
                            ) {
                              deleteBill.mutate(bill.id);
                            }
                          }}
                          className="text-sm text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Bill Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl">
            <UtilityBillForm
              initialData={editingBill ?? undefined}
              meters={meters}
              onSubmit={(data) => {
                if (editingBill) {
                  updateBill.mutate(
                    { id: editingBill.id, data },
                    { onSuccess: closeForm }
                  );
                } else {
                  createBill.mutate(data, { onSuccess: closeForm });
                }
              }}
              onCancel={closeForm}
              loading={createBill.isPending || updateBill.isPending}
            />
          </div>
        </div>
      )}
    </div>
  );
}
