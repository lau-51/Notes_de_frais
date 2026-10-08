import type { ButtonHTMLAttributes, ReactNode, TextareaHTMLAttributes, InputHTMLAttributes } from "react";
import {
  BedDouble,
  CircleParking,
  Fuel,
  Gift,
  GraduationCap,
  MoreHorizontal,
  Package,
  Route,
  Smartphone,
  Ticket,
  TrainFront,
  UtensilsCrossed,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/cn";
import type { CategoryId } from "@/lib/expenses/types";

const ICONS: Record<CategoryId, LucideIcon> = {
  hotel: BedDouble,
  restaurant: UtensilsCrossed,
  carburant: Fuel,
  peage: Route,
  parking: CircleParking,
  transport: TrainFront,
  fournitures: Package,
  salon: Ticket,
  cadeaux: Gift,
  telecom: Smartphone,
  entretien: Wrench,
  formation: GraduationCap,
  divers: MoreHorizontal,
};

export function CategoryIcon({ id, className }: { id: CategoryId; className?: string }) {
  const Icon = ICONS[id];
  return <Icon className={className ?? "size-4"} strokeWidth={1.75} aria-hidden />;
}

const control =
  "h-11 w-full rounded-sm border border-border bg-bg px-3 text-base text-fg placeholder:text-subtle";

export function Button({
  variant = "primary",
  className,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" | "danger" }) {
  return (
    <button
      type={type}
      className={cn(
        "press inline-flex h-11 items-center justify-center gap-2 rounded-sm px-4 text-sm font-medium disabled:opacity-40",
        variant === "primary" && "bg-accent text-accent-fg",
        variant === "secondary" && "border border-border bg-surface-2 text-fg",
        variant === "ghost" && "bg-transparent text-fg",
        variant === "danger" && "border border-border text-danger",
        className,
      )}
      {...props}
    />
  );
}

export function Chip({
  active,
  className,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      type={type}
      className={cn(
        "press inline-flex h-11 shrink-0 items-center gap-2 rounded-sm border px-3 text-sm font-medium",
        active ? "border-accent bg-accent text-accent-fg" : "border-border bg-surface text-fg",
        className,
      )}
      {...props}
    />
  );
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-medium text-muted">{label}</span>
      {children}
      {hint ? <span className="text-sm text-subtle">{hint}</span> : null}
    </label>
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(control, props.className)} />;
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn(control, "min-h-24 py-2", props.className)} />;
}

export function Badge({
  tone = "neutral",
  children,
}: {
  tone?: "neutral" | "ok" | "warn" | "danger" | "info";
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
        tone === "neutral" && "border-border text-muted",
        tone === "ok" && "border-ok/40 text-ok",
        tone === "warn" && "border-warn/40 text-warn",
        tone === "danger" && "border-danger/40 text-danger",
        tone === "info" && "border-info/40 text-info",
      )}
    >
      {children}
    </span>
  );
}

export function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="press flex min-h-11 w-full items-center justify-between gap-3 rounded-sm border border-border bg-bg px-3 py-2 text-left text-sm"
    >
      <span>{label}</span>
      <span className={cn("relative h-6 w-11 shrink-0 rounded-full p-0.5", checked ? "bg-accent" : "bg-surface-2")}>
        <span className={cn("block size-5 rounded-full bg-bg", checked && "translate-x-5")} />
      </span>
    </button>
  );
}
