import { NavLink } from "react-router-dom";
import {
  Building2,
  Factory,
  Gauge,
  Zap,
  Wind,
  Cpu,
  Droplets,
  Leaf,
  BarChart3,
  LayoutDashboard,
} from "lucide-react";

const menu = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    title: "Organizations",
    icon: Building2,
    path: "/organizations",
  },
  {
    title: "Buildings",
    icon: Factory,
    path: "/buildings",
  },
  {
    title: "Utilities",
    icon: Gauge,
    path: "/utilities",
  },
  {
    title: "Energy",
    icon: Zap,
    path: "/energy",
  },
  {
    title: "HVAC",
    icon: Wind,
    path: "/hvac",
  },
  {
    title: "Electrical",
    icon: Cpu,
    path: "/electrical",
  },
  {
    title: "Water",
    icon: Droplets,
    path: "/water",
  },
  {
    title: "Carbon",
    icon: Leaf,
    path: "/carbon",
  },
  {
    title: "ESG Reports",
    icon: BarChart3,
    path: "/esg",
  },
];
export default function Sidebar() {
  return (
    <aside className="w-72 bg-slate-900 text-white flex flex-col">

      <div className="border-b border-slate-700 p-6">

        <h1 className="text-2xl font-bold">
          BENAS
        </h1>

        <p className="mt-1 text-xs text-slate-400">
          Kamra Engineering Solutions
        </p>

      </div>

      <nav className="flex-1 overflow-y-auto p-4">

        <div className="space-y-2">

          {menu.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-4 py-3 transition ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`
                }
              >
                <Icon size={20} />

                <span>{item.title}</span>
              </NavLink>
            );
          })}

        </div>

      </nav>

      <div className="border-t border-slate-700 p-5">

        <div className="rounded-lg bg-slate-800 p-4">

          <p className="text-sm font-semibold">
            Version
          </p>

          <p className="mt-1 text-xs text-slate-400">
            BENAS Enterprise v0.1
          </p>

        </div>

      </div>

    </aside>
  );
}