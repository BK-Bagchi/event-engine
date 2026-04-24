//prettier-ignore
import { LayoutDashboard, FolderKanban, ServerCog, LayoutTemplate, Settings, UserCog, Users, BarChart3, ShieldCheck } from "lucide-react";

export type NavLink = {
  name: string;
  icon: React.ReactNode;
  route: string;
};

export const commonLinks: NavLink[] = [
  {
    name: "Overview",
    icon: <LayoutDashboard size={18} />,
    route: "/dashboard",
  },
  {
    name: "Projects",
    icon: <FolderKanban size={18} />,
    route: "/dashboard/projects",
  },
  {
    name: "Services",
    icon: <ServerCog size={18} />,
    route: "/dashboard/services",
  },
  {
    name: "Templates",
    icon: <LayoutTemplate size={18} />,
    route: "/dashboard/templates",
  },
];

export const userLinks: NavLink[] = [
  {
    name: "Profile",
    icon: <UserCog size={18} />,
    route: "/dashboard/profile",
  },
  {
    name: "Settings",
    icon: <Settings size={18} />,
    route: "/dashboard/settings",
  },
];

export const adminLinks: NavLink[] = [
  {
    name: "Users",
    icon: <Users size={18} />,
    route: "/dashboard/users",
  },
  {
    name: "Analytics",
    icon: <BarChart3 size={18} />,
    route: "/dashboard/analytics",
  },
  {
    name: "Moderation",
    icon: <ShieldCheck size={18} />,
    route: "/dashboard/moderation",
  },
];
