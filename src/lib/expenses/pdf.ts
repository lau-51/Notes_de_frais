import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFImage, type PDFPage } from "pdf-lib";
import { categoryMeta, payLabel, vehicleLabel, fuelLabel } from "./categories";
import { eur, formatDate } from "./format";
import type { FiscalView } from "./fiscal";
import type { Expense, Settings } from "./types";

const PAGE_W = 595.28;
const PAGE_H = 841.89;
const MARGIN = 40;
const INK = rgb(0.12, 0.11, 0.09);
const MUTED = rgb(0.38, 0.35, 0.31);
const HAIR = rgb(0.78, 0.75, 0.7);

type DocFile = { name: string; mime: string; blob: Blob };

type Cursor = { page: PDFPage; y: number; font: PDFFont; bold: PDFFont };

function pdfSafe(value: string): string {
  return value
    .replace(/œ/g, "oe")
    .replace(/Œ/g, "OE")
    .replace(/€/g, "EUR")
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[—–]/g, "-")
    .replace(/…/g, "...")
    .replace(/[^\u0000-\u00FF]/g, "");
}

function wrap(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const words = pdfSafe(text).split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(next, size) > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function blank(pdf: PDFDocument, font: PDFFont, bold: PDFFont): Cursor {
  const page = pdf.addPage([PAGE_W, PAGE_H]);
  return { page, y: PAGE_H - MARGIN, font, bold };
}

function ensure(pdf: PDFDocument, cursor: Cursor, need: number): Cursor {
  if (cursor.y >= need) return cursor;
  return blank(pdf, cursor.font, cursor.bold);
}

function drawLines(pdf: PDFDocument, cursor: Cursor, lines: string[], size: number, color = INK, bold = false): Cursor {
  const font = bold ? cursor.bold : cursor.font;
  let c = cursor;
  for (const line of lines) {
    c = ensure(pdf, c, MARGIN + size);
    c.page.drawText(line, { x: MARGIN, y: c.y - size, size, font, color });
    c = { ...c, y: c.y - size - 4 };
  }
  return c;
}

function paragraph(pdf: PDFDocument, cursor: Cursor, text: string, size = 10, color = INK): Cursor {
  const lines = wrap(text, cursor.font, size, PAGE_W - MARGIN * 2);
  return drawLines(pdf, cursor, lines, size, color, false);
}

function heading(pdf: PDFDocument, cursor: Cursor, text: string): Cursor {
  const lines = wrap(text, cursor.bold, 16, PAGE_W - MARGIN * 2);
  return drawLines(pdf, cursor, lines, 16, INK, true);
}

function rule(cursor: Cursor): Cursor {
  const y = cursor.y - 6;
  cursor.page.drawLine({
    start: { x: MARGIN, y },
    end: { x: PAGE_W - MARGIN, y },
    thickness: 0.6,
    color: HAIR,
  });
  return { ...cursor, y: y - 12 };
}

function companyBlock(settings: Settings): string[] {
  const lines = [settings.raisonSociale.trim() || "Société non renseignée"];
  if (settings.siret.trim()) lines.push(`SIRET ${settings.siret.trim()}`);
  if (settings.dirigeant.trim()) lines.push(settings.dirigeant.trim());
  if (settings.adresse.trim()) lines.push(settings.adresse.trim());
  return lines;
}

function contextLine(expense: Expense): string {
  const bits = [categoryMeta(expense.category).label, payLabel(expense.payMethod)];
  if (expense.vehicle) bits.push(vehicleLabel(expense.vehicle));
  if (expense.fuel) bits.push(fuelLabel(expense.fuel));
  if (expense.guests.trim()) bits.push(expense.guests.trim());
  if (expense.beneficiary.trim()) bits.push(expense.beneficiary.trim());
  return bits.join(" · ");
}

async function drawImage(pdf: PDFDocument, cursor: Cursor, blob: Blob, mime: string): Promise<Cursor> {
  const bytes = new Uint8Array(await blob.arrayBuffer());
  let image: PDFImage;
  try {
    image = mime === "image/png" ? await pdf.embedPng(bytes) : await pdf.embedJpg(bytes);
  } catch {
    return paragraph(pdf, cursor, "Justificatif illisible.");
  }
  let c = cursor;
  const maxW = PAGE_W - MARGIN * 2;
  let maxH = c.y - MARGIN - 8;
  if (maxH < 220) {
    c = blank(pdf, c.font, c.bold);
    maxH = c.y - MARGIN;
  }
  const scale = Math.min(maxW / image.width, maxH / image.height);
  const w = image.width * scale;
  const h = image.height * scale;
  const x = (PAGE_W - w) / 2;
  const y = c.y - h;
  c.page.drawImage(image, { x, y, width: w, height: h });
  return { ...c, y: y - 16 };
}

async function appendFiles(pdf: PDFDocument, cursor: Cursor, files: DocFile[]): Promise<Cursor> {
  let c = cursor;
  for (const file of files) {
    if (file.mime === "application/pdf") {
      try {
        const src = await PDFDocument.load(await file.blob.arrayBuffer(), { ignoreEncryption: true });
        const pages = await pdf.copyPages(src, src.getPageIndices());
        pages.forEach((page) => pdf.addPage(page));
        c = blank(pdf, c.font, c.bold);
      } catch {
        c = paragraph(pdf, c, `PDF illisible : ${file.name}`);
      }
      continue;
    }
    c = await drawImage(pdf, c, file.blob, file.mime);
  }
  return c;
}

function numberPages(pdf: PDFDocument, font: PDFFont) {
  const pages = pdf.getPages();
  pages.forEach((page, index) => {
    const width = page.getSize().width;
    page.drawText(pdfSafe(`${index + 1} / ${pages.length}`), {
      x: width - MARGIN - 48,
      y: 22,
      size: 9,
      font,
      color: MUTED,
    });
  });
}

async function expenseBlock(
  pdf: PDFDocument,
  cursor: Cursor,
  expense: Expense,
  fiscal: FiscalView,
  files: DocFile[],
  withFiles: boolean,
): Promise<Cursor> {
  let c = heading(pdf, cursor, expense.merchant || "Justificatif");
  c = paragraph(pdf, c, `${formatDate(expense.date)} · ${contextLine(expense)}`, 10, MUTED);
  c = paragraph(
    pdf,
    c,
    `TTC ${eur(expense.amountTtc)} · HT ${eur(fiscal.ht)} · TVA ${eur(fiscal.vat)} · récupérable ${eur(fiscal.recoverable)} · charge ${eur(fiscal.charge)}`,
  );
  c = paragraph(pdf, c, `Compte ${fiscal.account} ${fiscal.accountLabel}`, 10, MUTED);
  if (expense.purpose.trim()) c = paragraph(pdf, c, expense.purpose.trim());
  c = paragraph(pdf, c, fiscal.title, 10, MUTED);
  if (withFiles && files.length > 0) c = await appendFiles(pdf, c, files);
  return { ...c, y: c.y - 8 };
}

export async function buildExpensePdf(
  expense: Expense,
  settings: Settings,
  fiscal: FiscalView,
  files: DocFile[],
): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  let c = blank(pdf, font, bold);
  c = drawLines(pdf, c, companyBlock(settings).map((line) => pdfSafe(line)), 10, MUTED);
  c = rule(c);
  c = await expenseBlock(pdf, c, expense, fiscal, files, true);
  c = paragraph(pdf, c, "Aide indicative. À faire valider par l'expert-comptable avant de passer l'écriture.", 9, MUTED);
  numberPages(pdf, font);
  return pdf.save();
}

export async function buildPeriodPdf(options: {
  settings: Settings;
  periodLabel: string;
  rows: { expense: Expense; fiscal: FiscalView; files: DocFile[] }[];
  totals: { paidTtc: number; charge: number; recoverable: number };
  includeFiles: boolean;
}): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  let c = blank(pdf, font, bold);
  c = drawLines(pdf, c, companyBlock(options.settings).map((line) => pdfSafe(line)), 10, MUTED);
  c = heading(pdf, { ...c, y: c.y - 8 }, "Récapitulatif des notes de frais");
  c = paragraph(pdf, c, options.periodLabel, 12);
  c = paragraph(
    pdf,
    c,
    `${options.rows.length} pièce${options.rows.length > 1 ? "s" : ""} · TTC ${eur(options.totals.paidTtc)} · charge ${eur(options.totals.charge)} · TVA récupérable ${eur(options.totals.recoverable)}`,
  );
  c = rule(c);
  if (options.rows.length === 0) {
    c = paragraph(pdf, c, "Aucune pièce sur cette période.");
  }
  for (const row of options.rows) {
    c = ensure(pdf, c, 120);
    c = await expenseBlock(pdf, c, row.expense, row.fiscal, row.files, options.includeFiles);
    c = rule(c);
  }
  c = paragraph(
    pdf,
    c,
    "Les comptes sont suggérés. La récupération de TVA dépend de la facture, du bénéficiaire et de l'intérêt de la société. Document interne, non certifié.",
    9,
    MUTED,
  );
  numberPages(pdf, font);
  return pdf.save();
}
