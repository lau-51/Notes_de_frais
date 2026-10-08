import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PeriodBar } from "@/components/period-bar";
import { Button } from "@/components/ui";
import { eur } from "@/lib/expenses/format";
import { summarize } from "@/lib/expenses/fiscal";
import { getPeriod, inPeriod, shiftAnchor } from "@/lib/expenses/periods";
import { useExpenses } from "@/lib/expenses/store";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const { expenses, settings, period, mode, anchor, fileCount, clearExamples } = useExpenses();
  const hasExamples = expenses.some((expense) => expense.example);
  const current = useMemo(() => {
    if (!period) return [];
    return expenses.filter((expense) => inPeriod(expense.date, period));
  }, [expenses, period]);
  const summary = useMemo(
    () => summarize(current, expenses, fileCount, settings.assujettiTva),
    [current, expenses, fileCount, settings.assujettiTva],
  );
  const previousPaid = useMemo(() => {
    if (!anchor || !period) return 0;
    const prev = getPeriod(shiftAnchor(anchor, mode, -1), mode);
    const rows = expenses.filter((expense) => expense.professional && inPeriod(expense.date, prev));
    return rows.reduce((sum, expense) => sum + expense.amountTtc, 0);
  }, [anchor, expenses, mode, period]);

  if (!period) return null;
  const delta = previousPaid > 0 ? Math.round(((summary.paidTtc - previousPaid) / previousPaid) * 100) : null;

  return (
    <div className="flex flex-col gap-5">
      <header>
        <h1 className="text-2xl leading-tight tracking-tight">Tableau</h1>
        <p className="mt-1 text-sm text-muted">Dépenses professionnelles de la période, par poste et au total.</p>
      </header>
      <PeriodBar />
      {hasExamples ? (
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-sm">Des exemples illustrent le carnet. Effacez-les avant vos vrais justificatifs.</p>
          <Button
            variant="secondary"
            className="mt-3"
            onClick={() => {
              void clearExamples();
            }}
          >
            Effacer les exemples
          </Button>
        </div>
      ) : null}
      {!settings.raisonSociale.trim() ? (
        <p className="text-sm text-muted">Renseignez la raison sociale dans les réglages : elle sera imprimée sur les PDF.</p>
      ) : null}
      <section className="grid grid-cols-2 gap-3">
        <Tile label="Payé TTC" value={eur(summary.paidTtc)} />
        <Tile label="Charges" value={eur(summary.charge)} />
        <Tile label="TVA à récupérer" value={eur(summary.recoverable)} />
        <Tile label="Pièces" value={String(summary.count)} />
      </section>
      {delta != null ? (
        <p className="text-sm text-muted tabular-nums">
          {delta > 0 ? "+" : ""}
          {delta} % par rapport à la période précédente ({eur(previousPaid)}).
        </p>
      ) : null}
      {summary.personalTtc > 0 ? (
        <p className="text-sm text-muted">Dont {eur(summary.personalTtc)} de dépenses personnelles, hors charges.</p>
      ) : null}

      <section className="flex flex-col gap-3">
        <h2 className="text-lg leading-tight">Par poste</h2>
        {summary.byCategory.length === 0 ? (
          <p className="text-sm text-muted">Aucune dépense professionnelle sur cette période.</p>
        ) : (
          <>
            <CategoryChart rows={summary.byCategory.map((row) => ({ label: row.label, euros: row.ttc / 100 }))} />
            <ul className="divide-y divide-border border-y border-border">
              {summary.byCategory.map((row) => (
                <li key={row.id} className="flex items-baseline justify-between gap-3 py-3">
                  <span className="min-w-0">
                    <span className="block">{row.label}</span>
                    <span className="text-sm text-muted">
                      Charge {eur(row.charge)} · TVA {eur(row.recoverable)}
                    </span>
                  </span>
                  <span className="shrink-0 tabular-nums font-medium">{eur(row.ttc)}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      {summary.flags.length > 0 ? (
        <section>
          <h2 className="text-lg leading-tight">À vérifier</h2>
          <ul className="mt-2 divide-y divide-border border-y border-border">
            {summary.flags.map((flag) => (
              <li key={`${flag.id}-${flag.text}`}>
                <Link to="/notes/$id" params={{ id: flag.id }} className="block py-3">
                  <span className="block">{flag.merchant}</span>
                  <span className="text-sm text-warn">{flag.text}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section>
        <div className="mb-2 flex items-baseline justify-between">
          <h2 className="text-lg leading-tight">Pièces de la période</h2>
          <Link to="/notes" className="text-sm text-muted">
            Tout voir
          </Link>
        </div>
        {current.length === 0 ? (
          <Link to="/scan" className="text-sm text-info">
            Scanner un justificatif
          </Link>
        ) : (
          <ul className="divide-y divide-border border-y border-border">
            {current.slice(0, 6).map((expense) => (
              <li key={expense.id}>
                <Link to="/notes/$id" params={{ id: expense.id }} className="flex items-baseline justify-between gap-3 py-3">
                  <span className="min-w-0">
                    <span className="block truncate">{expense.merchant}</span>
                    <span className="text-sm text-muted">{expense.date}</span>
                  </span>
                  <span className="shrink-0 tabular-nums">{eur(expense.amountTtc)}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Tile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-1 font-display text-xl leading-tight tabular-nums">{value}</p>
    </div>
  );
}

function CategoryChart({ rows }: { rows: { label: string; euros: number }[] }) {
  const [mod, setMod] = useState<typeof import("recharts") | null>(null);
  useEffect(() => {
    let live = true;
    void import("recharts").then((loaded) => {
      if (live) setMod(loaded);
    });
    return () => {
      live = false;
    };
  }, []);
  if (!mod) return <div className="h-64 rounded-xl bg-surface" />;
  const { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } = mod;
  return (
    <div className="h-64 w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={rows} layout="vertical" margin={{ left: 0, right: 8, top: 4, bottom: 4 }}>
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="label"
            width={92}
            tick={{ fill: "var(--color-muted)", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: "var(--color-surface-2)" }}
            formatter={(value) => eur(Math.round(Number(value) * 100))}
          />
          <Bar dataKey="euros" fill="var(--color-info)" radius={[0, 4, 4, 0]} barSize={12} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
