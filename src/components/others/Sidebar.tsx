import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import logo from "@/assets/event-engine-logo.png";
//prettier-ignore
import { commonLinks, userLinks, adminLinks, type NavLink } from "@/config/navLinks";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (route: string) =>
    route === "/dashboard"
      ? location.pathname === "/dashboard"
      : location.pathname.startsWith(route);

  const initials = user?.fullName
    ? user.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "D";

  const renderLinks = (links: NavLink[]) =>
    links.map((link) => (
      <button
        key={link.route}
        onClick={() => navigate(link.route)}
        title={collapsed ? link.name : undefined}
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium w-full transition-colors cursor-pointer",
          "text-zinc-400 hover:text-white hover:bg-[#2A3550]",
          collapsed && "justify-center px-2",
          isActive(link.route) &&
            "bg-brand-blue/20 text-brand-blue border border-brand-blue/30 hover:bg-brand-blue/25 hover:text-brand-blue",
        )}
      >
        <span className="shrink-0">{link.icon}</span>
        {!collapsed && <span className="truncate">{link.name}</span>}
      </button>
    ));

  return (
    <aside
      className={cn(
        "relative flex flex-col border-r border-[#2A3550] bg-[#1A2235] transition-all duration-300 shrink-0",
        collapsed ? "w-16" : "w-56",
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          "flex items-center border-b border-[#2A3550] px-4 h-14 shrink-0",
          collapsed ? "justify-center" : "gap-2",
        )}
      >
        {!collapsed && (
          <>
            <img
              src={logo}
              alt="Event Engine"
              className="h-8 object-contain rounded-lg"
            />
            <span className="text-white font-bold text-base tracking-wide truncate">
              Event Engine
            </span>
          </>
        )}
        {collapsed && (
          <img
            src={logo}
            alt="Event Engine"
            className="h-6 object-contain rounded-lg"
          />
        )}
      </div>

      {/* Nav groups */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
        {/* General */}
        <div>
          {!collapsed && (
            <p className="text-zinc-500 text-[10px] uppercase tracking-widest px-2 mb-1">
              General
            </p>
          )}
          <div className="space-y-0.5">{renderLinks(commonLinks)}</div>
        </div>

        {/* Account */}
        <div>
          {!collapsed && (
            <p className="text-zinc-500 text-[10px] uppercase tracking-widest px-2 mb-1">
              Account
            </p>
          )}
          <div className="space-y-0.5">{renderLinks(userLinks)}</div>
        </div>

        {/* Admin-only */}
        {user?.role === "admin" && (
          <div>
            {!collapsed && (
              <p className="text-zinc-500 text-[10px] uppercase tracking-widest px-2 mb-1">
                Admin
              </p>
            )}
            <div className="space-y-0.5">{renderLinks(adminLinks)}</div>
          </div>
        )}
      </nav>

      {/* User footer */}
      <div className="border-t border-[#2A3550] px-2 py-3 shrink-0">
        {collapsed ? (
          <div className="flex flex-col items-center gap-2">
            <div
              className="size-8 rounded-full bg-brand-blue/20 border border-brand-blue/30 flex items-center justify-center shrink-0"
              title={user?.fullName}
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.fullName}
                  className="size-8 rounded-full object-cover"
                />
              ) : (
                <span className="text-xs font-semibold text-brand-blue">
                  {initials}
                </span>
              )}
            </div>
            <button
              onClick={logout}
              title="Logout"
              className="p-1.5 rounded text-zinc-400 hover:text-red-400 hover:bg-[#2A3550] transition-colors"
            >
              <LogOut size={15} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3 px-1">
            <div className="size-8 rounded-full bg-brand-blue/20 border border-brand-blue/30 flex items-center justify-center shrink-0">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.fullName}
                  className="size-8 rounded-full object-cover"
                />
              ) : (
                <span className="text-xs font-semibold text-brand-blue">
                  {initials}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white truncate font-medium">
                {user?.fullName}
              </p>
              <p className="text-xs text-zinc-500 truncate">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              title="Logout"
              className="p-1.5 rounded text-zinc-400 hover:text-red-400 hover:bg-[#2A3550] transition-colors shrink-0"
            >
              <LogOut size={15} />
            </button>
          </div>
        )}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-14 -translate-y-1/2 z-10 size-6 rounded-full bg-[#1A2235] border border-[#2A3550] flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
      >
        {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
      </button>
    </aside>
  );
}
