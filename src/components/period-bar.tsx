import { ChevronLeft, ChevronRight } from "lucide-react";
import { useExpenses } from "@/lib/expenses/store";
import { cn } from "@/lib/cn";

export function PeriodBar() {
  const { mode, setMode, period, shiftPeriod, canGoNext } = useExpenses();
  if (!period) return null;
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 rounded-lg bg-surface p-1" role="tablist" aria-label="Période">
        <PeriodTab active={mode === "week"} onClick={() => setMode("week")}>
          Semaine
        </PeriodTab>
        <PeriodTab active={mode === "month"} onClick={() => setMode("month")}>
          Mois
        </PeriodTab>
      </div>
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          className="press flex size-11 items-center justify-center rounded-sm border border-border"
          aria-label="Période précédente"
          onClick={() => shiftPeriod(-1)}
        >
          <ChevronLeft className="size-5" aria-hidden />
        </button>
        <p className="min-w-0 text-center text-sm font-medium">{period.label}</p>
        <button
          type="button"
          className="press flex size-11 items-center justify-center rounded-sm border border-border disabled:opacity-40"
          aria-label="Période suivante"
          disabled={!canGoNext}
          onClick={() => shiftPeriod(1)}
        >
          <ChevronRight className="size-5" aria-hidden />
        </button>
      </div>
    </div>
  );
}

function PeriodTab({ active, onClick, children }: { active: boolean; onClick: () => void; children: string }) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn("press h-11 rounded-md text-sm font-medium", active ? "bg-surface-2 text-fg" : "text-muted")}
    >
      {children}
    </button>
  );
}
