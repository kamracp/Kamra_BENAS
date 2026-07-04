const kpis = [
  {
    title: "Organizations",
    value: "0",
    color: "bg-blue-50 border-blue-200",
  },
  {
    title: "Buildings",
    value: "0",
    color: "bg-green-50 border-green-200",
  },
  {
    title: "Electricity",
    value: "0 kWh",
    color: "bg-yellow-50 border-yellow-200",
  },
  {
    title: "Carbon",
    value: "0 tCO₂e",
    color: "bg-red-50 border-red-200",
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          Enterprise Energy Dashboard
        </h1>

        <p className="text-slate-500">
          Operational overview of your building portfolio
        </p>
      </div>

      {/* KPI */}

      <div className="grid gap-6 lg:grid-cols-4">

        {kpis.map((item) => (
          <div
            key={item.title}
            className={`rounded-xl border p-6 shadow-sm ${item.color}`}
          >
            <p className="text-sm text-slate-500">
              {item.title}
            </p>

            <h2 className="mt-3 text-4xl font-bold">
              {item.value}
            </h2>
          </div>
        ))}

      </div>

      {/* Second Row */}

      <div className="grid gap-6 xl:grid-cols-2">

        <div className="rounded-xl border bg-white p-6 shadow-sm">

          <h2 className="text-xl font-semibold">
            Building Portfolio
          </h2>

          <table className="mt-5 w-full">

            <tbody>

              <tr className="border-b">
                <td className="py-3">Commercial Buildings</td>
                <td className="text-right font-semibold">0</td>
              </tr>

              <tr className="border-b">
                <td className="py-3">Industrial Plants</td>
                <td className="text-right font-semibold">0</td>
              </tr>

              <tr className="border-b">
                <td className="py-3">Hospitals</td>
                <td className="text-right font-semibold">0</td>
              </tr>

              <tr className="border-b">
                <td className="py-3">Hotels</td>
                <td className="text-right font-semibold">0</td>
              </tr>

              <tr>
                <td className="py-3">Universities</td>
                <td className="text-right font-semibold">0</td>
              </tr>

            </tbody>

          </table>

        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">

          <h2 className="text-xl font-semibold">
            Utility Summary
          </h2>

          <table className="mt-5 w-full">

            <tbody>

              <tr className="border-b">
                <td className="py-3">Electricity</td>
                <td className="text-right">0 kWh</td>
              </tr>

              <tr className="border-b">
                <td className="py-3">Water</td>
                <td className="text-right">0 m³</td>
              </tr>

              <tr className="border-b">
                <td className="py-3">Natural Gas</td>
                <td className="text-right">0 Nm³</td>
              </tr>

              <tr className="border-b">
                <td className="py-3">Diesel</td>
                <td className="text-right">0 Litres</td>
              </tr>

              <tr>
                <td className="py-3">Steam</td>
                <td className="text-right">0 Tonnes</td>
              </tr>

            </tbody>

          </table>

        </div>

      </div>

      {/* Third Row */}

      <div className="grid gap-6 xl:grid-cols-3">

        <div className="rounded-xl border bg-white p-6 shadow-sm">

          <h2 className="text-xl font-semibold">
            Carbon Status
          </h2>

          <div className="mt-5 space-y-4">

            <div>Scope 1 : 0 tCO₂e</div>

            <div>Scope 2 : 0 tCO₂e</div>

            <div>Scope 3 : 0 tCO₂e</div>

          </div>

        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">

          <h2 className="text-xl font-semibold">
            Active Alerts
          </h2>

          <p className="mt-5 text-green-600">
            No active alerts
          </p>

        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">

          <h2 className="text-xl font-semibold">
            AI Recommendations
          </h2>

          <p className="mt-5 text-slate-500">
            AI insights will appear after energy data is available.
          </p>

        </div>

      </div>

    </div>
  );
}