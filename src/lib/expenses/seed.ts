import { addDays, startOfISOWeek } from "date-fns";
import { dateKey } from "./format";
import type { Expense, NewFile } from "./types";

function dayInCurrentWeek(offset: number): string {
  const today = new Date();
  const start = startOfISOWeek(today);
  const date = addDays(start, offset);
  return dateKey(date.getTime() > today.getTime() ? today : date);
}

function ticket(title: string, lines: string[]): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = 900;
  canvas.height = 1200;
  const ctx = canvas.getContext("2d");
  if (!ctx) return Promise.reject(new Error("canvas"));
  ctx.fillStyle = "#f4f0e8";
  ctx.fillRect(0, 0, 900, 1200);
  ctx.strokeStyle = "#453f37";
  ctx.lineWidth = 4;
  ctx.strokeRect(36, 36, 828, 1128);
  ctx.fillStyle = "#9c9488";
  ctx.font = "600 28px sans-serif";
  ctx.fillText("EXEMPLE", 72, 110);
  ctx.fillStyle = "#1a1814";
  ctx.font = "600 42px serif";
  ctx.fillText(title, 72, 180);
  ctx.font = "28px sans-serif";
  let y = 260;
  for (const line of lines) {
    ctx.fillText(line, 72, y);
    y += 52;
  }
  ctx.fillStyle = "#9c9488";
  ctx.font = "24px sans-serif";
  ctx.fillText("Pièce de démonstration, à supprimer.", 72, 1080);
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("jpeg"))), "image/jpeg", 0.86);
  });
}

export async function buildExamples(): Promise<{ expenses: Expense[]; files: { expenseId: string; file: NewFile }[] }> {
  const now = new Date().toISOString();
  const specs: { expense: Expense; lines: string[] }[] = [
    {
      expense: {
        id: crypto.randomUUID(),
        createdAt: now,
        updatedAt: now,
        example: true,
        date: dayInCurrentWeek(0),
        merchant: "Hôtel de la Butte",
        category: "hotel",
        amountTtc: 18600,
        vatRate: 10,
        alcoholTtc: null,
        payMethod: "cb_societe",
        reimbursed: false,
        professional: true,
        invoiceToCompany: true,
        vehicle: null,
        fuel: null,
        stayFor: "dirigeant",
        mealKind: null,
        guests: "",
        purpose: "Nuit à Épernay avant un rendez-vous courtier.",
        beneficiary: "",
        comment: "",
      },
      lines: ["Épernay", "Nuitée · 1 personne", "186,00 EUR TTC", "TVA 10 %", "CB société"],
    },
    {
      expense: {
        id: crypto.randomUUID(),
        createdAt: now,
        updatedAt: now,
        example: true,
        date: dayInCurrentWeek(0),
        merchant: "Le Raisin Doré",
        category: "restaurant",
        amountTtc: 9450,
        vatRate: 10,
        alcoholTtc: 2200,
        payMethod: "cb_societe",
        reimbursed: false,
        professional: true,
        invoiceToCompany: true,
        vehicle: null,
        fuel: null,
        stayFor: null,
        mealKind: "affaires",
        guests: "Camille Renard, courtier",
        purpose: "Déjeuner de présentation de la nouvelle cuvée.",
        beneficiary: "",
        comment: "",
      },
      lines: ["Déjeuner", "2 couverts", "dont alcool 22,00 EUR", "94,50 EUR TTC", "Facture société"],
    },
    {
      expense: {
        id: crypto.randomUUID(),
        createdAt: now,
        updatedAt: now,
        example: true,
        date: dayInCurrentWeek(1),
        merchant: "Station du Chemin Blanc",
        category: "carburant",
        amountTtc: 9120,
        vatRate: 20,
        alcoholTtc: null,
        payMethod: "cb_societe",
        reimbursed: false,
        professional: true,
        invoiceToCompany: true,
        vehicle: "vp",
        fuel: "gazole",
        stayFor: null,
        mealKind: null,
        guests: "",
        purpose: "Gazole du véhicule de tourisme, tournée clients.",
        beneficiary: "",
        comment: "",
      },
      lines: ["Gazole", "Véhicule de tourisme", "91,20 EUR TTC", "TVA 20 %"],
    },
    {
      expense: {
        id: crypto.randomUUID(),
        createdAt: now,
        updatedAt: now,
        example: true,
        date: dayInCurrentWeek(1),
        merchant: "Badge péage",
        category: "peage",
        amountTtc: 1640,
        vatRate: 20,
        alcoholTtc: null,
        payMethod: "cb_societe",
        reimbursed: false,
        professional: true,
        invoiceToCompany: true,
        vehicle: null,
        fuel: null,
        stayFor: null,
        mealKind: null,
        guests: "",
        purpose: "Trajet domaine - Épernay.",
        beneficiary: "",
        comment: "",
      },
      lines: ["Péage", "16,40 EUR TTC", "TVA 20 %", "Badge société"],
    },
    {
      expense: {
        id: crypto.randomUUID(),
        createdAt: now,
        updatedAt: now,
        example: true,
        date: dayInCurrentWeek(2),
        merchant: "Papeterie de la Place",
        category: "fournitures",
        amountTtc: 3790,
        vatRate: 20,
        alcoholTtc: null,
        payMethod: "cb_perso",
        reimbursed: false,
        professional: true,
        invoiceToCompany: true,
        vehicle: null,
        fuel: null,
        stayFor: null,
        mealKind: null,
        guests: "",
        purpose: "Carnets de dégustation pour les visites.",
        beneficiary: "",
        comment: "",
      },
      lines: ["Fournitures", "37,90 EUR TTC", "Payé CB personnelle", "À rembourser"],
    },
    {
      expense: {
        id: crypto.randomUUID(),
        createdAt: now,
        updatedAt: now,
        example: true,
        date: dayInCurrentWeek(2),
        merchant: "Coffret dégustation",
        category: "cadeaux",
        amountTtc: 6800,
        vatRate: 20,
        alcoholTtc: null,
        payMethod: "cb_societe",
        reimbursed: false,
        professional: true,
        invoiceToCompany: true,
        vehicle: null,
        fuel: null,
        stayFor: null,
        mealKind: null,
        guests: "",
        purpose: "Remerciement après une visite du domaine.",
        beneficiary: "Jean Morel",
        comment: "",
      },
      lines: ["Cadeau client", "Jean Morel", "68,00 EUR TTC", "Sous le seuil de 73 EUR"],
    },
  ];

  const files: { expenseId: string; file: NewFile }[] = [];
  for (const spec of specs) {
    const blob = await ticket(spec.expense.merchant, spec.lines);
    files.push({
      expenseId: spec.expense.id,
      file: { name: "exemple.jpg", mime: "image/jpeg", blob },
    });
  }
  return { expenses: specs.map((s) => s.expense), files };
}
