import type { ExpenseDraft } from "./types";
import { parseEuro } from "./format";

export function validateDraft(draft: ExpenseDraft, amountText: string, alcoholText: string): string[] {
  const errors: string[] = [];
  const amount = parseEuro(amountText);
  if (amount == null || amount <= 0) errors.push("Indiquez un montant TTC supérieur à zéro.");
  if (draft.merchant.trim().length < 2) errors.push("Indiquez le fournisseur.");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(draft.date)) errors.push("Indiquez la date du justificatif.");
  if (!draft.category) errors.push("Choisissez un poste de dépense.");
  const alcohol = alcoholText.trim() ? parseEuro(alcoholText) : 0;
  if (alcoholText.trim() && alcohol == null) errors.push("Le montant d'alcool n'est pas lisible.");
  if (alcohol != null && amount != null && alcohol > amount) {
    errors.push("Le montant d'alcool ne peut pas dépasser le total.");
  }
  return errors;
}
