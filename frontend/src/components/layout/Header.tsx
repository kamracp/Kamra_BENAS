import { getCurrentUser, logout } from "../../services/api/auth";
export default function Header() {
  const user = getCurrentUser();
  function handleLogout() {
    logout();
  }
  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Kamra ClimateOS
        </h1>
        <p className="text-sm text-slate-500">
          Carbon Accounting. ESG Reporting. Net Zero.
        </p>
      </div>
      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Search..."
          className="w-72 rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-blue-500"
        />
        <button className="rounded-lg border border-slate-300 px-4 py-2 hover:bg-slate-100">
          Notifications
        </button>
        <div className="rounded-lg bg-slate-100 px-4 py-2 text-sm text-slate-700">
          {user ? user.email : "Not logged in"}
        </div>
        <button
          onClick={handleLogout}
          className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
