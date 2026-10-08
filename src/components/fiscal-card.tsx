import { eur } from "@/lib/expenses/format";
import type { FiscalView, Verdict } from "@/lib/expenses/fiscal";
import { Badge } from "@/components/ui";

const TONE: Record<Verdict, "ok" | "warn" | "danger" | "info"> = {
  ok: "ok",
  partial: "info",
  no_vat: "warn",
  check: "warn",
  personal: "danger",
};

export function FiscalCard({ fiscal }: { fiscal: FiscalView | null }) {
  if (!fiscal) {
    return (
      <section className="rounded-xl border border-border bg-surface p-4">
        <h2 className="text-lg leading-tight">Lecture fiscale</h2>
        <p className="mt-2 text-sm text-muted">Choisissez un poste et un montant pour voir la charge et la TVA.</p>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-border bg-surface p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg leading-tight">Lecture fiscale</h2>
        <Badge tone={TONE[fiscal.verdict]}>{fiscal.title}</Badge>
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-3">
        <Stat label="HT" value={eur(fiscal.ht)} />
        <Stat label="TVA" value={eur(fiscal.vat)} />
        <Stat label="TVA récupérable" value={eur(fiscal.recoverable)} />
        <Stat label="Charge" value={eur(fiscal.charge)} />
      </dl>
      <p className="mt-3 text-sm text-muted">
        Compte suggéré {fiscal.account} · {fiscal.accountLabel}
      </p>
      <div className="mt-3 flex flex-col gap-2">
        {fiscal.details.map((line) => (
          <p key={line} className="text-sm text-muted">
            {line}
          </p>
        ))}
        {fiscal.warnings.map((line) => (
          <p key={line} className="text-sm text-warn">
            {line}
          </p>
        ))}
      </div>
      {fiscal.lines.length > 0 ? (
        <ul className="mt-4 flex flex-col gap-2 border-t border-border pt-3">
          {fiscal.lines.map((line) => (
            <li key={`${line.side}-${line.account}`} className="flex items-baseline justify-between gap-3 text-sm">
              <span>
                <span className="text-muted">{line.side === "debit" ? "Débit" : "Crédit"} </span>
                <span className="tabular-nums">{line.account}</span> {line.label}
              </span>
              <span className="shrink-0 tabular-nums">{eur(line.amount)}</span>
            </li>
          ))}
        </ul>
      ) : null}
      <p className="mt-3 text-sm text-subtle">
        Aide indicative, pas l'avis de votre expert-comptable. Les comptes se calent sur votre plan comptable.
      </p>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-sm bg-bg px-3 py-2">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="tabular-nums text-base font-medium">{value}</dd>
    </div>
  );
}
