import { useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Camera, FolderOutput, LayoutDashboard, Scale, Settings, ScrollText } from "lucide-react";
import { Toaster } from "sonner";
import { SettingsDialog } from "@/components/settings-dialog";
import { useRegisterPwa } from "@/lib/pwa";
import { cn } from "@/lib/cn";
import { useExpenses } from "@/lib/expenses/store";

const LINKS = [
  { to: "/", label: "Tableau", icon: LayoutDashboard },
  { to: "/notes", label: "Pièces", icon: ScrollText },
  { to: "/export", label: "Export", icon: FolderOutput },
  { to: "/guide", label: "Fiscal", icon: Scale },
] as const;

export function Shell({ children }: { children: ReactNode }) {
  const { ready, error, settings } = useExpenses();
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (state) => state.location.pathname });
  useRegisterPwa();

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <header className="no-print sticky top-0 z-20 border-b border-border bg-bg/95">
        <div className="mx-auto flex h-16 w-full max-w-3xl items-center justify-between gap-3 px-4">
          <Link to="/" className="min-w-0">
            <span className="block font-display text-lg leading-tight tracking-tight">Frais de domaine</span>
            <span className="block truncate text-sm text-muted">
              {settings.raisonSociale.trim() || "Notes de frais · SARL viticole"}
            </span>
          </Link>
          <button
            type="button"
            className="press flex size-11 items-center justify-center rounded-sm border border-border"
            aria-label="Réglages de la société"
            onClick={() => setOpen(true)}
          >
            <Settings className="size-5" aria-hidden />
          </button>
        </div>
      </header>
      <main className="app-main mx-auto w-full max-w-3xl px-4 pt-5">
        {error ? <p className="text-sm text-danger">{error}</p> : ready ? children : <p className="text-muted">Ouverture du carnet…</p>}
      </main>
      <nav className="no-print app-nav fixed inset-x-0 bottom-0 z-20 border-t border-border bg-surface" aria-label="Navigation">
        <div className="mx-auto grid w-full max-w-3xl grid-cols-5">
          <NavItem to="/" label="Tableau" icon={LayoutDashboard} active={path === "/"} />
          <NavItem to="/notes" label="Pièces" icon={ScrollText} active={path.startsWith("/notes")} />
          <Link
            to="/scan"
            className={cn(
              "flex flex-col items-center justify-center gap-1 text-xs",
              path === "/scan" ? "text-fg" : "text-muted",
            )}
            aria-current={path === "/scan" ? "page" : undefined}
          >
            <span className="flex size-10 items-center justify-center rounded-full bg-accent text-accent-fg">
              <Camera className="size-5" aria-hidden />
            </span>
            Scanner
          </Link>
          {LINKS.slice(2).map((item) => (
            <NavItem key={item.to} to={item.to} label={item.label} icon={item.icon} active={path.startsWith(item.to)} />
          ))}
        </div>
      </nav>
      <Toaster theme="dark" position="top-center" />
      {open ? <SettingsDialog onClose={() => setOpen(false)} /> : null}
    </div>
  );
}

function NavItem({
  to,
  label,
  icon: Icon,
  active,
}: {
  to: "/" | "/notes" | "/export" | "/guide";
  label: string;
  icon: typeof LayoutDashboard;
  active: boolean;
}) {
  return (
    <Link
      to={to}
      aria-current={active ? "page" : undefined}
      className={cn("flex min-h-16 flex-col items-center justify-center gap-1 text-xs", active ? "text-fg" : "text-muted")}
    >
      <Icon className="size-5" aria-hidden />
      {label}
    </Link>
  );
}
