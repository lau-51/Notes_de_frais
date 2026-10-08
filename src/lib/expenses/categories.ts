import type { CategoryId, FuelKind, MealKind, PayMethod, StayFor, VatRate, VehicleKind } from "./types";

export type CategoryMeta = {
  id: CategoryId;
  label: string;
  short: string;
  account: string;
  accountLabel: string;
  defaultVat: VatRate;
};

export const CATEGORIES: CategoryMeta[] = [
  { id: "hotel", label: "Hôtel", short: "Hôtel", account: "625100", accountLabel: "Voyages et déplacements", defaultVat: 10 },
  { id: "restaurant", label: "Restaurant", short: "Restaurant", account: "625700", accountLabel: "Réceptions", defaultVat: 10 },
  { id: "carburant", label: "Carburant", short: "Carburant", account: "606100", accountLabel: "Carburants", defaultVat: 20 },
  { id: "peage", label: "Péage", short: "Péage", account: "625100", accountLabel: "Voyages et déplacements", defaultVat: 20 },
  { id: "parking", label: "Parking", short: "Parking", account: "625100", accountLabel: "Voyages et déplacements", defaultVat: 20 },
  { id: "transport", label: "Train, avion, taxi", short: "Transport", account: "625100", accountLabel: "Voyages et déplacements", defaultVat: 10 },
  { id: "fournitures", label: "Fournitures", short: "Fournitures", account: "606400", accountLabel: "Fournitures administratives", defaultVat: 20 },
  { id: "salon", label: "Salon et dégustation", short: "Salon", account: "623300", accountLabel: "Foires et expositions", defaultVat: 20 },
  { id: "cadeaux", label: "Cadeaux clients", short: "Cadeaux", account: "623400", accountLabel: "Cadeaux à la clientèle", defaultVat: 20 },
  { id: "telecom", label: "Téléphone et internet", short: "Télécom", account: "626000", accountLabel: "Frais postaux et de télécommunications", defaultVat: 20 },
  { id: "entretien", label: "Entretien véhicule", short: "Entretien", account: "615500", accountLabel: "Entretien véhicule", defaultVat: 20 },
  { id: "formation", label: "Formation", short: "Formation", account: "622800", accountLabel: "Formation professionnelle", defaultVat: 20 },
  { id: "divers", label: "Frais divers", short: "Divers", account: "628000", accountLabel: "Divers", defaultVat: 20 },
];

const BY_ID = Object.fromEntries(CATEGORIES.map((c) => [c.id, c])) as Record<CategoryId, CategoryMeta>;

export function categoryMeta(id: CategoryId): CategoryMeta {
  return BY_ID[id];
}

export const PAY_METHODS: { id: PayMethod; label: string }[] = [
  { id: "cb_societe", label: "CB société" },
  { id: "cb_perso", label: "CB personnelle" },
  { id: "virement", label: "Virement" },
  { id: "especes", label: "Espèces" },
];

export const FUELS: { id: FuelKind; label: string }[] = [
  { id: "gazole", label: "Gazole" },
  { id: "essence", label: "Essence" },
  { id: "e85", label: "Superéthanol E85" },
  { id: "gpl", label: "GPL" },
  { id: "gnv", label: "GNV" },
  { id: "electricite", label: "Électricité" },
];

export const VEHICLES: { id: VehicleKind; label: string }[] = [
  { id: "vp", label: "Véhicule de tourisme" },
  { id: "vu", label: "Utilitaire" },
];

export const STAYS: { id: StayFor; label: string }[] = [
  { id: "dirigeant", label: "Dirigeant ou salarié" },
  { id: "tiers", label: "Client, fournisseur, tiers" },
];

export const MEALS: { id: MealKind; label: string }[] = [
  { id: "affaires", label: "Repas avec un tiers" },
  { id: "deplacement", label: "Repas seul en déplacement" },
  { id: "petit_dejeuner", label: "Petit-déjeuner" },
];

export function payLabel(id: PayMethod): string {
  return PAY_METHODS.find((p) => p.id === id)?.label ?? id;
}

export function fuelLabel(id: FuelKind): string {
  return FUELS.find((f) => f.id === id)?.label ?? id;
}

export function vehicleLabel(id: VehicleKind): string {
  return id === "vp" ? "VP" : "VU";
}
