"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";
import {
  LayoutDashboard,
  MessageSquare,
  MapPin,
  Users,
  ShieldAlert,
  Compass,
  Accessibility,
  HeartHandshake,
  Settings,
  Tv,
  LogOut,
  Train,
  Sliders
} from "lucide-react";

interface SidebarLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  badge?: string;
  isActive: boolean;
  isAuthorized: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ href, icon, label, badge, isActive, isAuthorized }) => {
  return (
    <Link href={href} className="block">
      <div
        className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
          isActive
            ? "bg-purple-600/20 border-l-[3px] border-purple-500 text-white pl-4"
            : "text-muted-foreground hover:bg-white/5 hover:text-white"
        } ${!isAuthorized ? "opacity-40 hover:opacity-70" : ""}`}
      >
        <div className="flex items-center gap-2.5">
          <span className={isActive ? "text-purple-400" : "text-muted-foreground"}>{icon}</span>
          <span>{label}</span>
        </div>
        {badge && (
          <span className="bg-purple-500/15 border border-purple-500/30 text-purple-300 px-1.5 py-0.5 rounded-md text-[9px] font-bold tracking-wide uppercase">
            {badge}
          </span>
        )}
      </div>
    </Link>
  );
};

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { userRole } = useApp();

  // Navigation schema defining which roles have primary clearance for specific features
  const coreLinks = [
    { href: "/dashboard", icon: <LayoutDashboard className="w-4 h-4" />, label: "Operations Room", roles: ["fan", "organizer", "volunteer", "security", "medical", "admin"] },
    { href: "/ai-assistant", icon: <MessageSquare className="w-4 h-4" />, label: "AI Fan Assistant", roles: ["fan", "organizer", "volunteer", "security", "medical", "admin"] },
    { href: "/navigation", icon: <MapPin className="w-4 h-4" />, label: "Smart Navigation", roles: ["fan", "organizer", "volunteer", "security", "medical", "admin"] },
    { href: "/transportation", icon: <Train className="w-4 h-4" />, label: "Transportation Hub", roles: ["fan", "organizer", "volunteer", "security", "medical", "admin"] },
    { href: "/accessibility", icon: <Accessibility className="w-4 h-4" />, label: "Accessibility Portal", roles: ["fan", "organizer", "volunteer", "security", "medical", "admin"] },
  ];

  const opsLinks = [
    { href: "/crowd-analytics", icon: <Users className="w-4 h-4" />, label: "Crowd Analytics", roles: ["organizer", "security", "admin"] },
    { href: "/security", icon: <ShieldAlert className="w-4 h-4" />, label: "Security & Dispatch", roles: ["organizer", "security", "medical", "admin"] },
    { href: "/volunteer", icon: <HeartHandshake className="w-4 h-4" />, label: "Volunteer Portal", roles: ["organizer", "volunteer", "admin"] },
    { href: "/admin", icon: <Sliders className="w-4 h-4" />, label: "Admin Console", roles: ["admin", "organizer"] },
  ];

  const sysLinks = [
    { href: "/settings", icon: <Settings className="w-4 h-4" />, label: "Settings", roles: ["fan", "organizer", "volunteer", "security", "medical", "admin"] },
  ];

  // Helper check to verify if the active role matches the page scope
  const isAuthorized = (allowedRoles: string[]) => {
    return allowedRoles.includes(userRole);
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 glass-panel border-r border-white/5 h-[calc(100vh-62px)] p-4 justify-between shrink-0">
      <div className="space-y-6">
        {/* Core Services Group */}
        <div className="space-y-1.5">
          <p className="px-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Core Operations</p>
          <div className="space-y-1">
            {coreLinks.map((link) => (
              <SidebarLink
                key={link.href}
                href={link.href}
                icon={link.icon}
                label={link.label}
                isActive={pathname === link.href}
                isAuthorized={isAuthorized(link.roles)}
              />
            ))}
          </div>
        </div>

        {/* Operational Portals Group */}
        <div className="space-y-1.5">
          <p className="px-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Command Portals</p>
          <div className="space-y-1">
            {opsLinks.map((link) => (
              <SidebarLink
                key={link.href}
                href={link.href}
                icon={link.icon}
                label={link.label}
                isActive={pathname === link.href}
                isAuthorized={isAuthorized(link.roles)}
                badge={link.roles.includes(userRole) ? "Access" : undefined}
              />
            ))}
          </div>
        </div>
      </div>

      {/* System Settings & Switcher */}
      <div className="space-y-4">
        <div className="space-y-1 border-t border-white/5 pt-4">
          {sysLinks.map((link) => (
            <SidebarLink
              key={link.href}
              href={link.href}
              icon={link.icon}
              label={link.label}
              isActive={pathname === link.href}
              isAuthorized={isAuthorized(link.roles)}
            />
          ))}
          <SidebarLink
            href="/login"
            icon={<LogOut className="w-4 h-4" />}
            label="Logout Session"
            isActive={pathname === "/login"}
            isAuthorized={true}
          />
        </div>

        {/* Mini Role Status Display */}
        <div className="p-3 bg-white/5 rounded-lg border border-white/5 flex gap-2 items-center">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <div className="flex flex-col">
            <span className="text-[10px] text-muted-foreground leading-none font-bold uppercase">Role Token</span>
            <span className="text-xs font-bold text-white capitalize mt-0.5">{userRole} view</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
