export type CategoryId =
  | "hotel"
  | "restaurant"
  | "carburant"
  | "peage"
  | "parking"
  | "transport"
  | "fournitures"
  | "salon"
  | "cadeaux"
  | "telecom"
  | "entretien"
  | "formation"
  | "divers";

export type VatRate = 0 | 2.1 | 5.5 | 10 | 20;

export type PayMethod = "cb_societe" | "cb_perso" | "especes" | "virement";

export type FuelKind = "gazole" | "essence" | "e85" | "gpl" | "gnv" | "electricite";

export type VehicleKind = "vp" | "vu";

export type StayFor = "dirigeant" | "tiers";

export type MealKind = "deplacement" | "affaires" | "petit_dejeuner";

export type ExpenseCore = {
  date: string;
  merchant: string;
  category: CategoryId;
  amountTtc: number;
  vatRate: VatRate;
  alcoholTtc: number | null;
  payMethod: PayMethod;
  reimbursed: boolean;
  professional: boolean;
  invoiceToCompany: boolean;
  vehicle: VehicleKind | null;
  fuel: FuelKind | null;
  stayFor: StayFor | null;
  mealKind: MealKind | null;
  guests: string;
  purpose: string;
  beneficiary: string;
  comment: string;
};

export type Expense = ExpenseCore & {
  id: string;
  createdAt: string;
  updatedAt: string;
  example: boolean;
};

export type ExpenseDraft = Omit<ExpenseCore, "category"> & {
  category: CategoryId | null;
};

export type Settings = {
  raisonSociale: string;
  siret: string;
  dirigeant: string;
  adresse: string;
  assujettiTva: boolean;
  defaultVehicle: VehicleKind;
  defaultFuel: FuelKind;
  seeded: boolean;
};

export type FileMeta = {
  id: string;
  expenseId: string;
  name: string;
  mime: string;
  createdAt: string;
};

export type NewFile = {
  name: string;
  mime: string;
  blob: Blob;
};

export type LoadedFile = FileMeta & { blob: Blob };

export const DEFAULT_SETTINGS: Settings = {
  raisonSociale: "",
  siret: "",
  dirigeant: "",
  adresse: "",
  assujettiTva: true,
  defaultVehicle: "vp",
  defaultFuel: "gazole",
  seeded: false,
};

export const VAT_RATES: VatRate[] = [20, 10, 5.5, 2.1, 0];

export const GIFT_CEILING_CENTS = 7300;

export function emptyDraft(date: string): ExpenseDraft {
  return {
    date,
    merchant: "",
    category: null,
    amountTtc: 0,
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
    purpose: "",
    beneficiary: "",
    comment: "",
  };
}

export function draftFromExpense(expense: Expense): ExpenseDraft {
  return {
    date: expense.date,
    merchant: expense.merchant,
    category: expense.category,
    amountTtc: expense.amountTtc,
    vatRate: expense.vatRate,
    alcoholTtc: expense.alcoholTtc,
    payMethod: expense.payMethod,
    reimbursed: expense.reimbursed,
    professional: expense.professional,
    invoiceToCompany: expense.invoiceToCompany,
    vehicle: expense.vehicle,
    fuel: expense.fuel,
    stayFor: expense.stayFor,
    mealKind: expense.mealKind,
    guests: expense.guests,
    purpose: expense.purpose,
    beneficiary: expense.beneficiary,
    comment: expense.comment,
  };
}
