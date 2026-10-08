import JSZip from "jszip";
import { categoryMeta, payLabel } from "./categories";
import type { BackupPayload } from "./db";
import { csvCell, frNum, slug } from "./format";
import { fiscalOf, type PeriodSummary } from "./fiscal";
import { buildExpensePdf, buildPeriodPdf } from "./pdf";
import type { Period } from "./periods";
import type { Expense, FileMeta, LoadedFile, Settings } from "./types";

export function dossierName(settings: Settings, period: Period): string {
  return `notes-frais_${period.fileKey}_${slug(settings.raisonSociale || "domaine")}.zip`;
}

function pieceName(expense: Expense): string {
  return `${expense.date}_${expense.category}_${slug(expense.merchant)}_${expense.id.slice(0, 6)}.pdf`;
}

function csvFor(expenses: Expense[], all: Expense[], settings: Settings): string {
  const headers = [
    "Date",
    "Fournisseur",
    "Poste",
    "Compte",
    "Libellé compte",
    "TTC",
    "HT",
    "Taux TVA",
    "TVA",
    "TVA récupérable",
    "TVA non déductible",
    "Charge déductible",
    "Paiement",
    "Remboursé",
    "Facture au nom de la société",
    "Motif",
    "Convives",
    "Bénéficiaire",
    "Véhicule",
    "Carburant",
    "Verdict",
    "Id",
  ];
  const lines = [headers.map(csvCell).join(";")];
  for (const expense of expenses) {
    const fiscal = fiscalOf(expense, all, settings.assujettiTva);
    const row = [
      expense.date,
      expense.merchant,
      categoryMeta(expense.category).label,
      fiscal.account,
      fiscal.accountLabel,
      frNum(expense.amountTtc),
      frNum(fiscal.ht),
      String(expense.vatRate).replace(".", ","),
      frNum(fiscal.vat),
      frNum(fiscal.recoverable),
      frNum(fiscal.vat - fiscal.recoverable),
      frNum(fiscal.charge),
      payLabel(expense.payMethod),
      expense.reimbursed ? "oui" : "non",
      expense.invoiceToCompany ? "oui" : "non",
      expense.purpose,
      expense.guests,
      expense.beneficiary,
      expense.vehicle ?? "",
      expense.fuel ?? "",
      fiscal.title,
      expense.id,
    ];
    lines.push(row.map(csvCell).join(";"));
  }
  return `\uFEFF${lines.join("\r\n")}`;
}

export async function buildDossierZip(options: {
  settings: Settings;
  period: Period;
  expenses: Expense[];
  all: Expense[];
  summary: PeriodSummary;
  loadFiles: (expenseId: string) => Promise<LoadedFile[]>;
}): Promise<Blob> {
  const zip = new JSZip();
  const folder = zip.folder("pieces");
  const rows: { expense: Expense; fiscal: ReturnType<typeof fiscalOf>; files: LoadedFile[] }[] = [];
  for (const expense of options.expenses) {
    const files = await options.loadFiles(expense.id);
    const fiscal = fiscalOf(expense, options.all, options.settings.assujettiTva);
    rows.push({ expense, fiscal, files });
    const bytes = await buildExpensePdf(expense, options.settings, fiscal, files);
    folder?.file(pieceName(expense), bytes);
  }
  const summaryPdf = await buildPeriodPdf({
    settings: options.settings,
    periodLabel: options.period.label,
    rows,
    totals: {
      paidTtc: options.summary.paidTtc,
      charge: options.summary.charge,
      recoverable: options.summary.recoverable,
    },
    includeFiles: true,
  });
  zip.file("recapitulatif.pdf", summaryPdf);
  zip.file("ecritures.csv", csvFor(options.expenses, options.all, options.settings));
  return zip.generateAsync({ type: "blob" });
}

export async function buildSummaryPdf(options: {
  settings: Settings;
  period: Period;
  expenses: Expense[];
  all: Expense[];
  summary: PeriodSummary;
  loadFiles: (expenseId: string) => Promise<LoadedFile[]>;
  includeFiles: boolean;
}): Promise<Blob> {
  const rows = [];
  for (const expense of options.expenses) {
    const files = options.includeFiles ? await options.loadFiles(expense.id) : [];
    rows.push({
      expense,
      fiscal: fiscalOf(expense, options.all, options.settings.assujettiTva),
      files,
    });
  }
  const bytes = await buildPeriodPdf({
    settings: options.settings,
    periodLabel: options.period.label,
    rows,
    totals: {
      paidTtc: options.summary.paidTtc,
      charge: options.summary.charge,
      recoverable: options.summary.recoverable,
    },
    includeFiles: options.includeFiles,
  });
  return new Blob([Uint8Array.from(bytes)], { type: "application/pdf" });
}

export async function buildBackupZip(settings: Settings, expenses: Expense[], files: LoadedFile[]): Promise<Blob> {
  const zip = new JSZip();
  const payload: BackupPayload = {
    version: 1,
    exportedAt: new Date().toISOString(),
    settings,
    expenses,
    files: files.map(({ blob: _blob, ...meta }) => meta),
  };
  zip.file("sauvegarde.json", JSON.stringify(payload));
  const folder = zip.folder("files");
  for (const file of files) folder?.file(file.id, file.blob);
  return zip.generateAsync({ type: "blob" });
}

export async function readBackup(file: File): Promise<{ payload: BackupPayload; blobs: { id: string; blob: Blob }[] }> {
  const zip = await JSZip.loadAsync(await file.arrayBuffer());
  const jsonFile = zip.file("sauvegarde.json");
  if (!jsonFile) throw new Error("Ce fichier n'est pas une sauvegarde du carnet.");
  const payload = JSON.parse(await jsonFile.async("string")) as BackupPayload;
  if (payload.version !== 1 || !Array.isArray(payload.expenses) || !Array.isArray(payload.files)) {
    throw new Error("Sauvegarde illisible.");
  }
  const blobs: { id: string; blob: Blob }[] = [];
  for (const meta of payload.files) {
    const entry = zip.file(`files/${meta.id}`);
    if (!entry) continue;
    const blob = await entry.async("blob");
    blobs.push({ id: meta.id, blob: blob.type ? blob : new Blob([blob], { type: meta.mime }) });
  }
  return { payload, blobs };
}

export type { FileMeta };
