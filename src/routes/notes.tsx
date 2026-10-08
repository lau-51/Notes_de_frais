import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { statusBadges } from "@/components/expense-form";
import { Badge, CategoryIcon, Chip, TextInput } from "@/components/ui";
import { CATEGORIES, categoryMeta } from "@/lib/expenses/categories";
import { eur, formatDate } from "@/lib/expenses/format";
import { useExpenses } from "@/lib/expenses/store";
import type { CategoryId } from "@/lib/expenses/types";

export const Route = createFileRoute("/notes")({ component: NotesPage });

function NotesPage() {
  const { expenses, fileCount } = useExpenses();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryId | "all">("all");
  const [onlyRefund, setOnlyRefund] = useState(false);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return expenses.filter((expense) => {
      if (category !== "all" && expense.category !== category) return false;
      if (onlyRefund && !(expense.payMethod === "cb_perso" && !expense.reimbursed)) return false;
      if (!needle) return true;
      const blob = `${expense.merchant} ${expense.purpose} ${expense.guests} ${expense.beneficiary} ${categoryMeta(expense.category).label}`.toLowerCase();
      return blob.includes(needle);
    });
  }, [category, expenses, onlyRefund, query]);

  const total = filtered.reduce((sum, expense) => sum + expense.amountTtc, 0);

  return (
    <div className="flex flex-col gap-4">
      <header>
        <h1 className="text-2xl leading-tight tracking-tight">Pièces</h1>
        <p className="mt-1 text-sm text-muted tabular-nums">
          {filtered.length} pièce{filtered.length > 1 ? "s" : ""} · {eur(total)}
        </p>
      </header>
      <TextInput value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Fournisseur, motif, convive" />
      <div className="-mx-4 flex gap-2 overflow-x-auto scroll-x px-4">
        <Chip active={category === "all" && !onlyRefund} onClick={() => { setCategory("all"); setOnlyRefund(false); }}>
          Toutes
        </Chip>
        <Chip active={onlyRefund} onClick={() => setOnlyRefund((value) => !value)}>
          À rembourser
        </Chip>
        {CATEGORIES.map((item) => (
          <Chip key={item.id} active={category === item.id} onClick={() => setCategory(item.id)}>
            <CategoryIcon id={item.id} />
            {item.short}
          </Chip>
        ))}
      </div>
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-sm text-muted">Aucune pièce ne correspond.</p>
          <Link to="/scan" className="mt-3 inline-flex h-11 items-center text-sm font-medium text-info">
            Scanner un justificatif
          </Link>
        </div>
      ) : (
        <ul className="divide-y divide-border border-y border-border">
          {filtered.map((expense) => {
            const badges = statusBadges(expense, fileCount(expense.id));
            return (
              <li key={expense.id}>
                <Link to="/notes/$id" params={{ id: expense.id }} className="flex items-center gap-3 py-3">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-sm bg-surface text-muted">
                    <CategoryIcon id={expense.category} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate">{expense.merchant}</span>
                    <span className="block text-sm text-muted">
                      {categoryMeta(expense.category).short} · {formatDate(expense.date)}
                    </span>
                    {badges.length > 0 ? (
                      <span className="mt-1 flex flex-wrap gap-1">
                        {badges.map((badge) => (
                          <Badge key={badge.label} tone={badge.tone}>
                            {badge.label}
                          </Badge>
                        ))}
                      </span>
                    ) : null}
                  </span>
                  <span className="shrink-0 tabular-nums font-medium">{eur(expense.amountTtc)}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
