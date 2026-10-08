import { useEffect, useMemo, useRef, useState } from "react";
import { Camera, FileText, ImagePlus, Printer, Share2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Attachment } from "@/components/attachments";
import { FiscalCard } from "@/components/fiscal-card";
import { Button, CategoryIcon, Chip, Field, TextArea, TextInput, Toggle } from "@/components/ui";
import { CATEGORIES, categoryMeta, FUELS, MEALS, PAY_METHODS, STAYS, VEHICLES } from "@/lib/expenses/categories";
import { analyzeExpense, fiscalOf, peerGifts } from "@/lib/expenses/fiscal";
import { centsToInput, parseEuro, slug } from "@/lib/expenses/format";
import { prepareFile } from "@/lib/expenses/images";
import { buildExpensePdf } from "@/lib/expenses/pdf";
import { isAbortError, printBlob, shareBlob } from "@/lib/expenses/share";
import { VAT_RATES, type CategoryId, type Expense, type ExpenseDraft, type Settings } from "@/lib/expenses/types";
import { validateDraft } from "@/lib/expenses/validate";

export function ExpenseForm({
  initial,
  expenses,
  settings,
  attachments,
  expenseId,
  createdAt,
  submitLabel,
  autoFocusAmount,
  onAdd,
  onRemove,
  onSubmit,
  onDelete,
}: {
  initial: ExpenseDraft;
  expenses: Expense[];
  settings: Settings;
  attachments: Attachment[];
  expenseId?: string;
  createdAt?: string;
  submitLabel: string;
  autoFocusAmount?: boolean;
  onAdd: (files: Attachment[]) => void;
  onRemove: (key: string) => void;
  onSubmit: (draft: ExpenseDraft) => Promise<void>;
  onDelete?: () => Promise<void>;
}) {
  const [draft, setDraft] = useState(initial);
  const [amountText, setAmountText] = useState(initial.amountTtc ? centsToInput(initial.amountTtc) : "");
  const [alcoholText, setAlcoholText] = useState(initial.alcoholTtc ? centsToInput(initial.alcoholTtc) : "");
  const [errors, setErrors] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [zoom, setZoom] = useState<string | null>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const categoryRow = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = categoryRow.current;
    if (!root || !draft.category) return;
    root.querySelector<HTMLElement>(`[data-category="${draft.category}"]`)?.scrollIntoView({
      inline: "center",
      block: "nearest",
    });
  }, [draft.category]);

  const merchants = useMemo(() => {
    const names = new Set<string>();
    for (const expense of expenses) if (expense.merchant.trim()) names.add(expense.merchant.trim());
    return [...names].slice(0, 24);
  }, [expenses]);

  function patch(partial: Partial<ExpenseDraft>) {
    setDraft((current) => ({ ...current, ...partial }));
  }

  function chooseCategory(id: CategoryId) {
    const meta = categoryMeta(id);
    setDraft((current) => ({
      ...current,
      category: id,
      vatRate: meta.defaultVat,
      vehicle: id === "carburant" || id === "entretien" ? (current.vehicle ?? settings.defaultVehicle) : null,
      fuel: id === "carburant" ? (current.fuel ?? settings.defaultFuel) : null,
      stayFor: id === "hotel" ? (current.stayFor ?? "dirigeant") : null,
      mealKind: id === "restaurant" ? (current.mealKind ?? "affaires") : null,
    }));
    if (id !== "restaurant") setAlcoholText("");
  }

  function collect(): ExpenseDraft | null {
    const amount = parseEuro(amountText);
    const alcohol = alcoholText.trim() ? parseEuro(alcoholText) : null;
    const next: ExpenseDraft = {
      ...draft,
      merchant: draft.merchant.trim(),
      purpose: draft.purpose.trim(),
      guests: draft.guests.trim(),
      beneficiary: draft.beneficiary.trim(),
      comment: draft.comment.trim(),
      amountTtc: amount ?? 0,
      alcoholTtc: draft.category === "restaurant" && alcohol ? alcohol : null,
    };
    const found = validateDraft(next, amountText, alcoholText);
    setErrors(found);
    if (found.length || amount == null || !next.category) return null;
    return next;
  }

  const live = useMemo(() => {
    if (!draft.category) return null;
    const amount = parseEuro(amountText);
    if (amount == null) return null;
    const alcohol = alcoholText.trim() ? parseEuro(alcoholText) : null;
    const core = {
      ...draft,
      category: draft.category,
      amountTtc: amount,
      alcoholTtc: draft.category === "restaurant" && alcohol ? alcohol : null,
    };
    return analyzeExpense(core, {
      assujettiTva: settings.assujettiTva,
      peerGiftsTtc: peerGifts(
        {
          id: expenseId ?? "apercu",
          date: core.date,
          beneficiary: core.beneficiary,
          category: core.category,
          professional: core.professional,
        },
        expenses,
      ),
    });
  }, [alcoholText, amountText, draft, expenseId, expenses, settings.assujettiTva]);

  const duplicate = useMemo(() => {
    const amount = parseEuro(amountText);
    const merchant = draft.merchant.trim().toLowerCase();
    if (amount == null || merchant.length < 2) return false;
    return expenses.some(
      (expense) =>
        expense.id !== expenseId &&
        expense.date === draft.date &&
        expense.amountTtc === amount &&
        expense.merchant.trim().toLowerCase() === merchant,
    );
  }, [amountText, draft.date, draft.merchant, expenseId, expenses]);

  async function addPicked(list: FileList | null) {
    if (!list?.length) return;
    const next: Attachment[] = [];
    for (const file of Array.from(list)) {
      try {
        const prepared = await prepareFile(file);
        next.push({
          key: crypto.randomUUID(),
          name: prepared.name,
          mime: prepared.mime,
          blob: prepared.blob,
          url: URL.createObjectURL(prepared.blob),
        });
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Fichier refusé");
      }
    }
    if (next.length) onAdd(next);
  }

  async function submit() {
    const next = collect();
    if (!next) return;
    setBusy(true);
    try {
      await onSubmit(next);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Enregistrement impossible");
    } finally {
      setBusy(false);
    }
  }

  async function output(kind: "print" | "share") {
    const next = collect();
    if (!next?.category) return;
    const expense: Expense = {
      ...next,
      category: next.category,
      id: expenseId ?? "apercu",
      createdAt: createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      example: false,
    };
    setBusy(true);
    try {
      const fiscal = fiscalOf(expense, expenses, settings.assujettiTva);
      const bytes = await buildExpensePdf(
        expense,
        settings,
        fiscal,
        attachments.map((file) => ({ name: file.name, mime: file.mime, blob: file.blob })),
      );
      const blob = new Blob([Uint8Array.from(bytes)], { type: "application/pdf" });
      const filename = `${expense.date}_${slug(expense.merchant)}.pdf`;
      if (kind === "print") {
        printBlob(blob);
      } else {
        const result = await shareBlob(blob, filename, "application/pdf");
        if (result === "downloaded") toast.success("PDF téléchargé");
      }
    } catch (error) {
      if (!isAbortError(error)) toast.error("PDF impossible pour le moment");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={(event) => {
        event.preventDefault();
        void submit();
      }}
    >
      <section className="flex flex-col gap-3">
        <div className="flex gap-2 overflow-x-auto scroll-x">
          {attachments.map((file) => (
            <div key={file.key} className="relative shrink-0">
              {file.mime.startsWith("image/") ? (
                <button type="button" onClick={() => setZoom(file.url)} className="block">
                  <img src={file.url} alt={file.name} className="h-28 w-24 rounded-sm object-cover" />
                </button>
              ) : (
                <a
                  href={file.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-28 w-24 flex-col items-center justify-center gap-2 rounded-sm border border-border bg-surface text-xs"
                >
                  <FileText className="size-5" aria-hidden />
                  PDF
                </a>
              )}
              <button
                type="button"
                aria-label={`Retirer ${file.name}`}
                onClick={() => onRemove(file.key)}
                className="press absolute right-1 top-1 flex size-8 items-center justify-center rounded-full bg-bg text-fg"
              >
                <Trash2 className="size-3.5" aria-hidden />
              </button>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="secondary" onClick={() => cameraRef.current?.click()}>
            <Camera className="size-4" aria-hidden />
            Photo
          </Button>
          <Button variant="secondary" onClick={() => fileRef.current?.click()}>
            <ImagePlus className="size-4" aria-hidden />
            Importer
          </Button>
        </div>
        <input
          ref={cameraRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="sr-only"
          onChange={(event) => {
            void addPicked(event.target.files);
            event.target.value = "";
          }}
        />
        <input
          ref={fileRef}
          type="file"
          accept="image/*,application/pdf"
          multiple
          className="sr-only"
          onChange={(event) => {
            void addPicked(event.target.files);
            event.target.value = "";
          }}
        />
        {attachments.length === 0 ? (
          <p className="text-sm text-subtle">Sans photo, la pièce reste enregistrée mais marquée incomplète.</p>
        ) : null}
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Montant TTC">
          <TextInput
            inputMode="decimal"
            autoFocus={autoFocusAmount}
            autoComplete="off"
            placeholder="0,00"
            value={amountText}
            onChange={(event) => setAmountText(event.target.value)}
          />
        </Field>
        <Field label="Date">
          <TextInput type="date" value={draft.date} onChange={(event) => patch({ date: event.target.value })} />
        </Field>
      </div>
      <Field label="Fournisseur">
        <TextInput
          list="merchants"
          autoComplete="off"
          placeholder="Hôtel, station, restaurant…"
          value={draft.merchant}
          onChange={(event) => patch({ merchant: event.target.value })}
        />
        <datalist id="merchants">
          {merchants.map((name) => (
            <option key={name} value={name} />
          ))}
        </datalist>
      </Field>

      <fieldset>
        <legend className="mb-2 text-sm font-medium text-muted">Poste</legend>
        <div ref={categoryRow} className="-mx-4 flex gap-2 overflow-x-auto scroll-x px-4 pb-1">
          {CATEGORIES.map((category) => (
            <Chip
              key={category.id}
              data-category={category.id}
              active={draft.category === category.id}
              onClick={() => chooseCategory(category.id)}
            >
              <CategoryIcon id={category.id} />
              {category.short}
            </Chip>
          ))}
        </div>
      </fieldset>

      {draft.category === "hotel" ? (
        <Choice label="Qui est hébergé ?" value={draft.stayFor} options={STAYS} onChange={(stayFor) => patch({ stayFor })} />
      ) : null}
      {draft.category === "restaurant" ? (
        <Choice label="Quel repas ?" value={draft.mealKind} options={MEALS} onChange={(mealKind) => patch({ mealKind })} />
      ) : null}
      {draft.category === "carburant" || draft.category === "entretien" ? (
        <Choice label="Véhicule" value={draft.vehicle} options={VEHICLES} onChange={(vehicle) => patch({ vehicle })} />
      ) : null}
      {draft.category === "carburant" ? (
        <Choice label="Carburant" value={draft.fuel} options={FUELS} onChange={(fuel) => patch({ fuel })} />
      ) : null}

      <fieldset>
        <legend className="mb-2 text-sm font-medium text-muted">Taux de TVA du justificatif</legend>
        <div className="flex flex-wrap gap-2">
          {VAT_RATES.map((rate) => (
            <Chip key={rate} active={draft.vatRate === rate} onClick={() => patch({ vatRate: rate })}>
              {rate === 0 ? "Sans TVA" : `${String(rate).replace(".", ",")} %`}
            </Chip>
          ))}
        </div>
      </fieldset>

      {draft.category === "restaurant" ? (
        <Field label="Dont alcool, TTC" hint="Laissé vide si la note ne sépare pas l'alcool. Le reste suit le taux choisi.">
          <TextInput
            inputMode="decimal"
            placeholder="0,00"
            value={alcoholText}
            onChange={(event) => setAlcoholText(event.target.value)}
          />
        </Field>
      ) : null}

      <Toggle
        label="Dépense professionnelle"
        checked={draft.professional}
        onChange={(professional) => patch({ professional })}
      />
      <Toggle
        label="Facture ou ticket au nom de la société"
        checked={draft.invoiceToCompany}
        onChange={(invoiceToCompany) => patch({ invoiceToCompany })}
      />

      <Choice label="Paiement" value={draft.payMethod} options={PAY_METHODS} onChange={(payMethod) => patch({ payMethod })} />
      {draft.payMethod === "cb_perso" ? (
        <Toggle label="Déjà remboursé au dirigeant" checked={draft.reimbursed} onChange={(reimbursed) => patch({ reimbursed })} />
      ) : null}

      <Field label="Motif" hint="Lieu, personne rencontrée, lien avec le domaine.">
        <TextArea value={draft.purpose} onChange={(event) => patch({ purpose: event.target.value })} />
      </Field>
      {draft.category === "restaurant" || (draft.category === "hotel" && draft.stayFor === "tiers") ? (
        <Field label="Convives ou tiers">
          <TextInput
            value={draft.guests}
            placeholder="Nom et qualité"
            onChange={(event) => patch({ guests: event.target.value })}
          />
        </Field>
      ) : null}
      {draft.category === "cadeaux" ? (
        <Field label="Bénéficiaire" hint="Sert à suivre le plafond de 73 € TTC par an.">
          <TextInput value={draft.beneficiary} onChange={(event) => patch({ beneficiary: event.target.value })} />
        </Field>
      ) : null}
      <Field label="Commentaire">
        <TextInput value={draft.comment} onChange={(event) => patch({ comment: event.target.value })} />
      </Field>

      {duplicate ? (
        <p className="text-sm text-warn">Une pièce avec le même jour, le même fournisseur et le même montant existe déjà.</p>
      ) : null}
      {errors.length > 0 ? (
        <ul className="flex flex-col gap-1">
          {errors.map((error) => (
            <li key={error} className="text-sm text-danger">
              {error}
            </li>
          ))}
        </ul>
      ) : null}

      <FiscalCard fiscal={live} />

      <div className="grid gap-2 sm:grid-cols-3">
        <Button type="submit" disabled={busy} className="w-full sm:col-span-3">
          {busy ? "Patientez…" : submitLabel}
        </Button>
        <Button variant="secondary" className="w-full" disabled={busy} onClick={() => void output("print")}>
          <Printer className="size-4" aria-hidden />
          Imprimer
        </Button>
        <Button variant="secondary" className="w-full" disabled={busy} onClick={() => void output("share")}>
          <Share2 className="size-4" aria-hidden />
          Partager le PDF
        </Button>
        {onDelete ? (
          confirmDelete ? (
            <Button
              variant="danger"
              className="w-full"
              onClick={() => {
                void onDelete().catch(() => toast.error("Suppression impossible"));
              }}
            >
              Confirmer
            </Button>
          ) : (
            <Button variant="danger" className="w-full" onClick={() => setConfirmDelete(true)}>
              Supprimer
            </Button>
          )
        ) : (
          <span className="hidden sm:block" />
        )}
      </div>
      {zoom ? (
        <button type="button" className="fixed inset-0 z-40 bg-bg p-4" onClick={() => setZoom(null)} aria-label="Fermer l'aperçu">
          <img src={zoom} alt="" className="mx-auto h-full w-full object-contain" />
        </button>
      ) : null}
    </form>
  );
}

function Choice<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T | null;
  options: { id: T; label: string }[];
  onChange: (id: T) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-medium text-muted">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <Chip key={option.id} active={value === option.id} onClick={() => onChange(option.id)}>
            {option.label}
          </Chip>
        ))}
      </div>
    </fieldset>
  );
}

export function statusBadges(expense: Expense, files: number) {
  const badges: { label: string; tone: "warn" | "neutral" | "ok" }[] = [];
  if (files === 0) badges.push({ label: "Sans pièce", tone: "warn" });
  if (expense.payMethod === "cb_perso" && !expense.reimbursed) badges.push({ label: "À rembourser", tone: "warn" });
  if (!expense.professional) badges.push({ label: "Personnelle", tone: "neutral" });
  return badges;
}
