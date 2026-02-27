import React from "react";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Activity, BrainCircuit, Target, Settings } from "lucide-react";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  className?: string;
}

export function Sidebar({ className, activeTab, setActiveTab }: SidebarProps) {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "live-trades", label: "Live Trades", icon: Activity },
    { id: "analysis", label: "AI Analysis", icon: BrainCircuit },
    { id: "guidance", label: "Pro Guidance", icon: Target },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className={cn("flex h-screen w-64 flex-col border-r bg-[var(--card)] px-4 py-6", className)}>
      <div className="flex items-center gap-2 px-2 mb-8">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)]">
          <BrainCircuit className="h-5 w-5" />
        </div>
        <span className="text-lg font-bold tracking-tight">TradeMind AI</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-[var(--primary)]/10 text-[var(--primary)]"
                  : "text-[var(--muted-foreground)] hover:bg-[var(--accent)] hover:text-[var(--foreground)]"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto px-2">
        <div className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-4">
          <p className="text-xs font-medium text-[var(--muted-foreground)]">MT5 Status</p>
          <div className="mt-2 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-[var(--success)] shadow-[0_0_8px_var(--success)]" />
            <span className="text-sm font-semibold">Connected</span>
          </div>
          <p className="mt-1 text-xs text-[var(--muted-foreground)]">Account: 10948572</p>
        </div>
      </div>
    </div>
  );
}
