import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { SegmentProvider } from "../context/SegmentContext";
export default function MainLayout() {
  return (
    <SegmentProvider>
      <div className="flex h-screen bg-slate-100">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </SegmentProvider>
  );
}
