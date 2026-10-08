import { addMonths, addWeeks, endOfISOWeek, endOfMonth, format, getISOWeek, startOfISOWeek, startOfMonth } from "date-fns";
import { fr } from "date-fns/locale";
import { dateKey } from "./format";

export type PeriodMode = "week" | "month";

export type Period = {
  mode: PeriodMode;
  startKey: string;
  endKey: string;
  label: string;
  fileKey: string;
};

function cap(s: string): string {
  return s ? s.charAt(0).toLocaleUpperCase("fr-FR") + s.slice(1) : s;
}

export function getPeriod(anchor: Date, mode: PeriodMode): Period {
  if (mode === "week") {
    const start = startOfISOWeek(anchor);
    const end = endOfISOWeek(anchor);
    const sameMonth = start.getMonth() === end.getMonth();
    const label = sameMonth
      ? `Semaine ${getISOWeek(start)} · ${format(start, "d", { locale: fr })} – ${format(end, "d MMM yyyy", { locale: fr })}`
      : `Semaine ${getISOWeek(start)} · ${format(start, "d MMM", { locale: fr })} – ${format(end, "d MMM yyyy", { locale: fr })}`;
    return {
      mode,
      startKey: dateKey(start),
      endKey: dateKey(end),
      label,
      fileKey: format(start, "RRRR-'W'II"),
    };
  }
  const start = startOfMonth(anchor);
  const end = endOfMonth(anchor);
  return {
    mode,
    startKey: dateKey(start),
    endKey: dateKey(end),
    label: cap(format(start, "MMMM yyyy", { locale: fr })),
    fileKey: format(start, "yyyy-MM"),
  };
}

export function shiftAnchor(anchor: Date, mode: PeriodMode, dir: -1 | 1): Date {
  return mode === "week" ? addWeeks(anchor, dir) : addMonths(anchor, dir);
}

export function inPeriod(date: string, period: Period): boolean {
  return date >= period.startKey && date <= period.endKey;
}
