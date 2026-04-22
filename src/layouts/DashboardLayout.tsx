import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { LogOut, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
//prettier-ignore
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
//prettier-ignore
import { commonLinks, userLinks, adminLinks, type NavLink } from "@/config/navLinks";

export default function DashboardLayout() {
  const { user, logout } = useAuth();
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
      <SidebarMenuItem key={link.route}>
        <SidebarMenuButton
          onClick={() => navigate(link.route)}
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium w-full transition-colors cursor-pointer",
            "text-zinc-400 hover:text-white hover:bg-[#2A3550]",
            isActive(link.route) &&
              "bg-brand-blue/20 text-brand-blue border border-brand-blue/30 hover:bg-brand-blue/25 hover:text-brand-blue",
          )}
        >
          {link.icon}
          <span>{link.name}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    ));

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden bg-[#0B1120]">
        {/* ── Sidebar ── */}
        <Sidebar className="border-r border-[#2A3550] bg-[#1A2235]">
          {/* Logo */}
          <SidebarHeader className="px-5 py-4 border-b border-[#2A3550]">
            <span className="text-white font-bold text-lg tracking-wide">
              Event Engine
            </span>
          </SidebarHeader>

          {/* Nav groups */}
          <SidebarContent className="py-3 gap-0">
            {/* General */}
            <SidebarGroup>
              <SidebarGroupLabel className="text-zinc-500 text-[10px] uppercase tracking-widest px-4 mb-1">
                General
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="px-2 gap-0.5">
                  {renderLinks(commonLinks)}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Account */}
            <SidebarGroup className="mt-4">
              <SidebarGroupLabel className="text-zinc-500 text-[10px] uppercase tracking-widest px-4 mb-1">
                Account
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="px-2 gap-0.5">
                  {renderLinks(userLinks)}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Admin-only */}
            {user?.role === "admin" && (
              <SidebarGroup className="mt-4">
                <SidebarGroupLabel className="text-zinc-500 text-[10px] uppercase tracking-widest px-4 mb-1">
                  Admin
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu className="px-2 gap-0.5">
                    {renderLinks(adminLinks)}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            )}
          </SidebarContent>

          {/* User footer */}
          <SidebarFooter className="border-t border-[#2A3550] px-3 py-3">
            <div className="flex items-center gap-3">
              {/* Avatar initials */}
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
                <LogOut size={16} />
              </button>
            </div>
          </SidebarFooter>
        </Sidebar>

        {/* ── Main area ── */}
        <SidebarInset className="flex flex-col flex-1 min-w-0 bg-[#0B1120]">
          {/* Top Navbar */}
          <header className="flex items-center gap-4 h-14 px-5 border-b border-[#2A3550] bg-[#1A2235] shrink-0">
            <SidebarTrigger className="text-zinc-400 hover:text-white transition-colors">
              <Menu size={20} />
            </SidebarTrigger>

            {/* Page breadcrumb / title placeholder */}
            <span className="text-sm text-zinc-300 font-medium capitalize">
              {location.pathname.split("/").filter(Boolean).at(-1) ??
                "Dashboard"}
            </span>

            <div className="flex-1" />

            {/* Right side: avatar */}
            <div className="flex items-center gap-2">
              <div className="size-7 rounded-full bg-brand-blue/20 border border-brand-blue/30 flex items-center justify-center">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.fullName}
                    className="size-7 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-xs font-semibold text-brand-blue">
                    {initials}
                  </span>
                )}
              </div>
              <span className="text-sm text-zinc-300 hidden sm:block">
                {user?.fullName}
              </span>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-y-auto p-6">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
