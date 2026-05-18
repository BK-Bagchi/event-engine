import { Outlet } from "react-router-dom";
import Sidebar from "@/components/others/Sidebar";

export default function DashboardLayout() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#0B1120]">
      {/* ── Sidebar ── */}
      <Sidebar />

      {/* ── Main content ── */}
      <main className="flex-1 min-w-0 overflow-y-auto p-6 bg-[#0B1120]">
        <Outlet />
      </main>
    </div>
  );
}
