import { i as __toESM } from "../_runtime.mjs";
import { X as require_react, Y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { O as BedDouble, S as Ellipsis, _ as GraduationCap, a as TrainFront, f as Route, m as Package, n as UtensilsCrossed, o as Ticket, s as Smartphone, t as Wrench, v as Gift, w as CircleParking, y as Fuel } from "../_libs/lucide-react.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { a as startOfMonth, c as startOfISOWeek, i as endOfISOWeek, l as addMonths, n as format, o as endOfMonth, r as getISOWeek, s as addWeeks, t as fr, u as addDays } from "../_libs/date-fns.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/store-BWE3fr9t.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var ICONS = {
	hotel: BedDouble,
	restaurant: UtensilsCrossed,
	carburant: Fuel,
	peage: Route,
	parking: CircleParking,
	transport: TrainFront,
	fournitures: Package,
	salon: Ticket,
	cadeaux: Gift,
	telecom: Smartphone,
	entretien: Wrench,
	formation: GraduationCap,
	divers: Ellipsis
};
function CategoryIcon({ id, className }) {
	const Icon = ICONS[id];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
		className: className ?? "size-4",
		strokeWidth: 1.75,
		"aria-hidden": true
	});
}
var control = "h-11 w-full rounded-sm border border-border bg-bg px-3 text-base text-fg placeholder:text-subtle";
function Button({ variant = "primary", className, type = "button", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type,
		className: cn("press inline-flex h-11 items-center justify-center gap-2 rounded-sm px-4 text-sm font-medium disabled:opacity-40", variant === "primary" && "bg-accent text-accent-fg", variant === "secondary" && "border border-border bg-surface-2 text-fg", variant === "ghost" && "bg-transparent text-fg", variant === "danger" && "border border-border text-danger", className),
		...props
	});
}
function Chip({ active, className, type = "button", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type,
		className: cn("press inline-flex h-11 shrink-0 items-center gap-2 rounded-sm border px-3 text-sm font-medium", active ? "border-accent bg-accent text-accent-fg" : "border-border bg-surface text-fg", className),
		...props
	});
}
function Field({ label, hint, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "flex flex-col gap-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm font-medium text-muted",
				children: label
			}),
			children,
			hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm text-subtle",
				children: hint
			}) : null
		]
	});
}
function TextInput(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		...props,
		className: cn(control, props.className)
	});
}
function TextArea(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		...props,
		className: cn(control, "min-h-24 py-2", props.className)
	});
}
function Badge({ tone = "neutral", children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium", tone === "neutral" && "border-border text-muted", tone === "ok" && "border-ok/40 text-ok", tone === "warn" && "border-warn/40 text-warn", tone === "danger" && "border-danger/40 text-danger", tone === "info" && "border-info/40 text-info"),
		children
	});
}
function Toggle({ label, checked, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		role: "switch",
		"aria-checked": checked,
		onClick: () => onChange(!checked),
		className: "press flex min-h-11 w-full items-center justify-between gap-3 rounded-sm border border-border bg-bg px-3 py-2 text-left text-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: cn("relative h-6 w-11 shrink-0 rounded-full p-0.5", checked ? "bg-accent" : "bg-surface-2"),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("block size-5 rounded-full bg-bg", checked && "translate-x-5") })
		})]
	});
}
var CATEGORIES = [
	{
		id: "hotel",
		label: "Hôtel",
		short: "Hôtel",
		account: "625100",
		accountLabel: "Voyages et déplacements",
		defaultVat: 10
	},
	{
		id: "restaurant",
		label: "Restaurant",
		short: "Restaurant",
		account: "625700",
		accountLabel: "Réceptions",
		defaultVat: 10
	},
	{
		id: "carburant",
		label: "Carburant",
		short: "Carburant",
		account: "606100",
		accountLabel: "Carburants",
		defaultVat: 20
	},
	{
		id: "peage",
		label: "Péage",
		short: "Péage",
		account: "625100",
		accountLabel: "Voyages et déplacements",
		defaultVat: 20
	},
	{
		id: "parking",
		label: "Parking",
		short: "Parking",
		account: "625100",
		accountLabel: "Voyages et déplacements",
		defaultVat: 20
	},
	{
		id: "transport",
		label: "Train, avion, taxi",
		short: "Transport",
		account: "625100",
		accountLabel: "Voyages et déplacements",
		defaultVat: 10
	},
	{
		id: "fournitures",
		label: "Fournitures",
		short: "Fournitures",
		account: "606400",
		accountLabel: "Fournitures administratives",
		defaultVat: 20
	},
	{
		id: "salon",
		label: "Salon et dégustation",
		short: "Salon",
		account: "623300",
		accountLabel: "Foires et expositions",
		defaultVat: 20
	},
	{
		id: "cadeaux",
		label: "Cadeaux clients",
		short: "Cadeaux",
		account: "623400",
		accountLabel: "Cadeaux à la clientèle",
		defaultVat: 20
	},
	{
		id: "telecom",
		label: "Téléphone et internet",
		short: "Télécom",
		account: "626000",
		accountLabel: "Frais postaux et de télécommunications",
		defaultVat: 20
	},
	{
		id: "entretien",
		label: "Entretien véhicule",
		short: "Entretien",
		account: "615500",
		accountLabel: "Entretien véhicule",
		defaultVat: 20
	},
	{
		id: "formation",
		label: "Formation",
		short: "Formation",
		account: "622800",
		accountLabel: "Formation professionnelle",
		defaultVat: 20
	},
	{
		id: "divers",
		label: "Frais divers",
		short: "Divers",
		account: "628000",
		accountLabel: "Divers",
		defaultVat: 20
	}
];
var BY_ID = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));
function categoryMeta(id) {
	return BY_ID[id];
}
var PAY_METHODS = [
	{
		id: "cb_societe",
		label: "CB société"
	},
	{
		id: "cb_perso",
		label: "CB personnelle"
	},
	{
		id: "virement",
		label: "Virement"
	},
	{
		id: "especes",
		label: "Espèces"
	}
];
var FUELS = [
	{
		id: "gazole",
		label: "Gazole"
	},
	{
		id: "essence",
		label: "Essence"
	},
	{
		id: "e85",
		label: "Superéthanol E85"
	},
	{
		id: "gpl",
		label: "GPL"
	},
	{
		id: "gnv",
		label: "GNV"
	},
	{
		id: "electricite",
		label: "Électricité"
	}
];
var VEHICLES = [{
	id: "vp",
	label: "Véhicule de tourisme"
}, {
	id: "vu",
	label: "Utilitaire"
}];
var STAYS = [{
	id: "dirigeant",
	label: "Dirigeant ou salarié"
}, {
	id: "tiers",
	label: "Client, fournisseur, tiers"
}];
var MEALS = [
	{
		id: "affaires",
		label: "Repas avec un tiers"
	},
	{
		id: "deplacement",
		label: "Repas seul en déplacement"
	},
	{
		id: "petit_dejeuner",
		label: "Petit-déjeuner"
	}
];
function payLabel(id) {
	return PAY_METHODS.find((p) => p.id === id)?.label ?? id;
}
function fuelLabel(id) {
	return FUELS.find((f) => f.id === id)?.label ?? id;
}
function vehicleLabel(id) {
	return id === "vp" ? "VP" : "VU";
}
var DEFAULT_SETTINGS = {
	raisonSociale: "",
	siret: "",
	dirigeant: "",
	adresse: "",
	assujettiTva: true,
	defaultVehicle: "vp",
	defaultFuel: "gazole",
	seeded: false
};
var VAT_RATES = [
	20,
	10,
	5.5,
	2.1,
	0
];
function emptyDraft(date) {
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
		comment: ""
	};
}
function draftFromExpense(expense) {
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
		comment: expense.comment
	};
}
var DB_NAME = "frais-domaine";
var DB_VERSION = 1;
var dbPromise = null;
function request(req) {
	return new Promise((resolve, reject) => {
		req.onsuccess = () => resolve(req.result);
		req.onerror = () => reject(req.error ?? /* @__PURE__ */ new Error("IndexedDB"));
	});
}
function txDone(tx) {
	return new Promise((resolve, reject) => {
		tx.oncomplete = () => resolve();
		tx.onerror = () => reject(tx.error ?? /* @__PURE__ */ new Error("Transaction"));
		tx.onabort = () => reject(tx.error ?? /* @__PURE__ */ new Error("Transaction annulée"));
	});
}
function openDb() {
	return new Promise((resolve, reject) => {
		const req = indexedDB.open(DB_NAME, DB_VERSION);
		req.onupgradeneeded = () => {
			const db = req.result;
			if (!db.objectStoreNames.contains("expenses")) db.createObjectStore("expenses", { keyPath: "id" });
			if (!db.objectStoreNames.contains("files")) db.createObjectStore("files", { keyPath: "id" }).createIndex("byExpense", "expenseId", { unique: false });
			if (!db.objectStoreNames.contains("blobs")) db.createObjectStore("blobs");
			if (!db.objectStoreNames.contains("meta")) db.createObjectStore("meta");
		};
		req.onsuccess = () => resolve(req.result);
		req.onerror = () => reject(req.error ?? /* @__PURE__ */ new Error("Ouverture impossible"));
	});
}
function database() {
	if (!dbPromise) dbPromise = openDb();
	return dbPromise;
}
function sortExpenses(expenses) {
	return [...expenses].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt));
}
async function loadState() {
	const tx = (await database()).transaction([
		"expenses",
		"files",
		"meta"
	], "readonly");
	const settingsRaw = await request(tx.objectStore("meta").get("settings"));
	const expenses = await request(tx.objectStore("expenses").getAll());
	const files = await request(tx.objectStore("files").getAll());
	await txDone(tx);
	return {
		settings: {
			...DEFAULT_SETTINGS,
			...settingsRaw
		},
		expenses: sortExpenses(expenses),
		files
	};
}
async function saveSettings(settings) {
	const tx = (await database()).transaction("meta", "readwrite");
	tx.objectStore("meta").put(settings, "settings");
	await txDone(tx);
}
async function putExpense(expense) {
	const tx = (await database()).transaction("expenses", "readwrite");
	tx.objectStore("expenses").put(expense);
	await txDone(tx);
}
async function addFiles(expenseId, files) {
	if (files.length === 0) return [];
	const tx = (await database()).transaction(["files", "blobs"], "readwrite");
	const metas = [];
	for (const file of files) {
		const meta = {
			id: crypto.randomUUID(),
			expenseId,
			name: file.name,
			mime: file.mime,
			createdAt: (/* @__PURE__ */ new Date()).toISOString()
		};
		tx.objectStore("files").put(meta);
		tx.objectStore("blobs").put(file.blob, meta.id);
		metas.push(meta);
	}
	await txDone(tx);
	return metas;
}
async function deleteFile(id) {
	const tx = (await database()).transaction(["files", "blobs"], "readwrite");
	tx.objectStore("files").delete(id);
	tx.objectStore("blobs").delete(id);
	await txDone(tx);
}
async function deleteExpenseCascade(expenseId, fileIds) {
	const tx = (await database()).transaction([
		"expenses",
		"files",
		"blobs"
	], "readwrite");
	tx.objectStore("expenses").delete(expenseId);
	for (const id of fileIds) {
		tx.objectStore("files").delete(id);
		tx.objectStore("blobs").delete(id);
	}
	await txDone(tx);
}
async function getBlobs(expenseId, metas) {
	const wanted = metas.filter((m) => m.expenseId === expenseId);
	if (wanted.length === 0) return [];
	const tx = (await database()).transaction("blobs", "readonly");
	const store = tx.objectStore("blobs");
	const loaded = [];
	for (const meta of wanted) {
		const blob = await request(store.get(meta.id));
		if (blob) loaded.push({
			...meta,
			blob
		});
	}
	await txDone(tx);
	return loaded;
}
async function allBlobs(metas) {
	if (metas.length === 0) return [];
	const tx = (await database()).transaction("blobs", "readonly");
	const store = tx.objectStore("blobs");
	const loaded = [];
	for (const meta of metas) {
		const blob = await request(store.get(meta.id));
		if (blob) loaded.push({
			...meta,
			blob
		});
	}
	await txDone(tx);
	return loaded;
}
async function eraseAll() {
	const tx = (await database()).transaction([
		"expenses",
		"files",
		"blobs",
		"meta"
	], "readwrite");
	tx.objectStore("expenses").clear();
	tx.objectStore("files").clear();
	tx.objectStore("blobs").clear();
	tx.objectStore("meta").clear();
	await txDone(tx);
}
async function importPayload(payload, blobs) {
	const tx = (await database()).transaction([
		"expenses",
		"files",
		"blobs",
		"meta"
	], "readwrite");
	tx.objectStore("meta").put({
		...DEFAULT_SETTINGS,
		...payload.settings,
		seeded: true
	}, "settings");
	for (const expense of payload.expenses) tx.objectStore("expenses").put(expense);
	for (const meta of payload.files) tx.objectStore("files").put(meta);
	for (const item of blobs) tx.objectStore("blobs").put(item.blob, item.id);
	await txDone(tx);
}
function dateKey(d) {
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function todayIso() {
	return dateKey(/* @__PURE__ */ new Date());
}
function parseEuro(input) {
	const cleaned = input.trim().replace(/\s/g, "").replace("€", "").replace(",", ".");
	if (!cleaned) return null;
	if (!/^\d+(\.\d{0,2})?$/.test(cleaned)) return null;
	const value = Number(cleaned);
	if (!Number.isFinite(value)) return null;
	return Math.round(value * 100);
}
function centsToInput(cents) {
	const abs = Math.abs(cents);
	const euros = Math.floor(abs / 100);
	const frac = String(abs % 100).padStart(2, "0");
	return `${cents < 0 ? "-" : ""}${euros},${frac}`;
}
function eur(cents) {
	return new Intl.NumberFormat("fr-FR", {
		style: "currency",
		currency: "EUR"
	}).format(cents / 100);
}
function frNum(cents) {
	return (cents / 100).toFixed(2).replace(".", ",");
}
function formatDate(iso) {
	const [y, m, d] = iso.split("-").map(Number);
	if (!y || !m || !d) return iso;
	return new Intl.DateTimeFormat("fr-FR", {
		day: "numeric",
		month: "short",
		year: "numeric"
	}).format(new Date(y, m - 1, d));
}
function slug(value) {
	return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 42) || "piece";
}
function csvCell(value) {
	return `"${String(value).replace(/"/g, "\"\"")}"`;
}
function dayInCurrentWeek(offset) {
	const today = /* @__PURE__ */ new Date();
	const start = startOfISOWeek(today);
	const date = addDays(start, offset);
	return dateKey(date.getTime() > today.getTime() ? today : date);
}
function ticket(title, lines) {
	const canvas = document.createElement("canvas");
	canvas.width = 900;
	canvas.height = 1200;
	const ctx = canvas.getContext("2d");
	if (!ctx) return Promise.reject(/* @__PURE__ */ new Error("canvas"));
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
		canvas.toBlob((blob) => blob ? resolve(blob) : reject(/* @__PURE__ */ new Error("jpeg")), "image/jpeg", .86);
	});
}
async function buildExamples() {
	const now = (/* @__PURE__ */ new Date()).toISOString();
	const specs = [
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
				comment: ""
			},
			lines: [
				"Épernay",
				"Nuitée · 1 personne",
				"186,00 EUR TTC",
				"TVA 10 %",
				"CB société"
			]
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
				comment: ""
			},
			lines: [
				"Déjeuner",
				"2 couverts",
				"dont alcool 22,00 EUR",
				"94,50 EUR TTC",
				"Facture société"
			]
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
				comment: ""
			},
			lines: [
				"Gazole",
				"Véhicule de tourisme",
				"91,20 EUR TTC",
				"TVA 20 %"
			]
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
				comment: ""
			},
			lines: [
				"Péage",
				"16,40 EUR TTC",
				"TVA 20 %",
				"Badge société"
			]
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
				comment: ""
			},
			lines: [
				"Fournitures",
				"37,90 EUR TTC",
				"Payé CB personnelle",
				"À rembourser"
			]
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
				comment: ""
			},
			lines: [
				"Cadeau client",
				"Jean Morel",
				"68,00 EUR TTC",
				"Sous le seuil de 73 EUR"
			]
		}
	];
	const files = [];
	for (const spec of specs) {
		const blob = await ticket(spec.expense.merchant, spec.lines);
		files.push({
			expenseId: spec.expense.id,
			file: {
				name: "exemple.jpg",
				mime: "image/jpeg",
				blob
			}
		});
	}
	return {
		expenses: specs.map((s) => s.expense),
		files
	};
}
function cap(s) {
	return s ? s.charAt(0).toLocaleUpperCase("fr-FR") + s.slice(1) : s;
}
function getPeriod(anchor, mode) {
	if (mode === "week") {
		const start = startOfISOWeek(anchor);
		const end = endOfISOWeek(anchor);
		const label = start.getMonth() === end.getMonth() ? `Semaine ${getISOWeek(start)} · ${format(start, "d", { locale: fr })} – ${format(end, "d MMM yyyy", { locale: fr })}` : `Semaine ${getISOWeek(start)} · ${format(start, "d MMM", { locale: fr })} – ${format(end, "d MMM yyyy", { locale: fr })}`;
		return {
			mode,
			startKey: dateKey(start),
			endKey: dateKey(end),
			label,
			fileKey: format(start, "RRRR-'W'II")
		};
	}
	const start = startOfMonth(anchor);
	const end = endOfMonth(anchor);
	return {
		mode,
		startKey: dateKey(start),
		endKey: dateKey(end),
		label: cap(format(start, "MMMM yyyy", { locale: fr })),
		fileKey: format(start, "yyyy-MM")
	};
}
function shiftAnchor(anchor, mode, dir) {
	return mode === "week" ? addWeeks(anchor, dir) : addMonths(anchor, dir);
}
function inPeriod(date, period) {
	return date >= period.startKey && date <= period.endKey;
}
var Ctx = (0, import_react.createContext)(null);
function assertDraft(draft) {
	if (!draft.category) throw new Error("Choisissez un poste de dépense.");
}
async function bootstrap() {
	const state = await loadState();
	if (!state.settings.seeded && state.expenses.length === 0) {
		const seeded = await buildExamples();
		for (const expense of seeded.expenses) await putExpense(expense);
		const metas = [];
		for (const item of seeded.files) metas.push(...await addFiles(item.expenseId, [item.file]));
		const nextSettings = {
			...state.settings,
			seeded: true
		};
		await saveSettings(nextSettings);
		return {
			settings: nextSettings,
			expenses: seeded.expenses.sort((a, b) => b.date.localeCompare(a.date)),
			files: metas
		};
	}
	if (!state.settings.seeded) {
		const nextSettings = {
			...state.settings,
			seeded: true
		};
		await saveSettings(nextSettings);
		return {
			...state,
			settings: nextSettings
		};
	}
	return state;
}
var bootstrapPromise = null;
function boot() {
	if (!bootstrapPromise) bootstrapPromise = bootstrap();
	return bootstrapPromise;
}
function ExpensesProvider({ children }) {
	const [ready, setReady] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [expenses, setExpenses] = (0, import_react.useState)([]);
	const [files, setFiles] = (0, import_react.useState)([]);
	const [settings, setSettings] = (0, import_react.useState)(DEFAULT_SETTINGS);
	const [mode, setMode] = (0, import_react.useState)("month");
	const [anchor, setAnchor] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		boot().then((state) => {
			if (cancelled) return;
			setSettings(state.settings);
			setExpenses(state.expenses);
			setFiles(state.files);
			setAnchor(/* @__PURE__ */ new Date());
			setReady(true);
		}).catch(() => {
			if (cancelled) return;
			setError("Le carnet ne peut pas s'ouvrir sur cet appareil. Réessayez hors navigation privée.");
			setReady(true);
		});
		return () => {
			cancelled = true;
		};
	}, []);
	const period = anchor ? getPeriod(anchor, mode) : null;
	const canGoNext = (0, import_react.useMemo)(() => {
		if (!anchor) return false;
		return getPeriod(shiftAnchor(anchor, mode, 1), mode).startKey <= dateKey(/* @__PURE__ */ new Date());
	}, [anchor, mode]);
	const fileCount = (id) => files.filter((file) => file.expenseId === id).length;
	async function saveSettings$1(next) {
		const value = {
			...next,
			seeded: true
		};
		await saveSettings(value);
		setSettings(value);
	}
	async function createExpense(draft, incoming) {
		assertDraft(draft);
		const now = (/* @__PURE__ */ new Date()).toISOString();
		const expense = {
			...draft,
			category: draft.category,
			id: crypto.randomUUID(),
			createdAt: now,
			updatedAt: now,
			example: false
		};
		await putExpense(expense);
		const metas = await addFiles(expense.id, incoming);
		setExpenses((prev) => [expense, ...prev].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt)));
		setFiles((prev) => [...prev, ...metas]);
		return expense.id;
	}
	async function updateExpense(id, draft, incoming, removedIds) {
		assertDraft(draft);
		const prev = expenses.find((expense) => expense.id === id);
		if (!prev) throw new Error("Pièce introuvable.");
		const expense = {
			...draft,
			category: draft.category,
			id,
			createdAt: prev.createdAt,
			updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
			example: false
		};
		await putExpense(expense);
		for (const removed of removedIds) await deleteFile(removed);
		const metas = await addFiles(id, incoming);
		setExpenses((list) => list.map((item) => item.id === id ? expense : item).sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt)));
		setFiles((list) => [...list.filter((file) => !removedIds.includes(file.id)), ...metas]);
	}
	async function deleteExpense(id) {
		await deleteExpenseCascade(id, files.filter((file) => file.expenseId === id).map((file) => file.id));
		setExpenses((list) => list.filter((expense) => expense.id !== id));
		setFiles((list) => list.filter((file) => file.expenseId !== id));
	}
	async function clearExamples() {
		const ids = expenses.filter((expense) => expense.example).map((expense) => expense.id);
		for (const id of ids) await deleteExpenseCascade(id, files.filter((file) => file.expenseId === id).map((file) => file.id));
		setExpenses((list) => list.filter((expense) => !expense.example));
		setFiles((list) => list.filter((file) => !ids.includes(file.expenseId)));
	}
	async function loadExamples() {
		const seeded = await buildExamples();
		for (const expense of seeded.expenses) await putExpense(expense);
		const metas = [];
		for (const item of seeded.files) metas.push(...await addFiles(item.expenseId, [item.file]));
		setExpenses((prev) => [...seeded.expenses, ...prev].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt)));
		setFiles((prev) => [...prev, ...metas]);
	}
	async function eraseAllData() {
		await eraseAll();
		const fresh = {
			...DEFAULT_SETTINGS,
			seeded: true
		};
		await saveSettings(fresh);
		setExpenses([]);
		setFiles([]);
		setSettings(fresh);
		bootstrapPromise = null;
	}
	async function reload() {
		await database();
		const state = await loadState();
		setSettings(state.settings);
		setExpenses(state.expenses);
		setFiles(state.files);
	}
	const value = {
		ready,
		error,
		expenses,
		files,
		settings,
		mode,
		setMode,
		anchor,
		period,
		shiftPeriod: (dir) => setAnchor((current) => current ? shiftAnchor(current, mode, dir) : current),
		canGoNext,
		fileCount,
		saveSettings: saveSettings$1,
		createExpense,
		updateExpense,
		deleteExpense,
		clearExamples,
		loadExamples,
		eraseAllData,
		getBlobs: (expenseId) => getBlobs(expenseId, files),
		reload
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ctx.Provider, {
		value,
		children
	});
}
function useExpenses() {
	const value = (0, import_react.useContext)(Ctx);
	if (!value) throw new Error("Carnet indisponible");
	return value;
}
async function loadAllBlobs(metas) {
	return allBlobs(metas);
}
//#endregion
export { loadAllBlobs as A, eur as C, getPeriod as D, fuelLabel as E, todayIso as F, useExpenses as I, vehicleLabel as L, payLabel as M, shiftAnchor as N, importPayload as O, slug as P, emptyDraft as S, frNum as T, categoryMeta as _, Chip as a, csvCell as b, Field as c, STAYS as d, TextArea as f, VEHICLES as g, VAT_RATES as h, CategoryIcon as i, parseEuro as j, inPeriod as k, MEALS as l, Toggle as m, Button as n, ExpensesProvider as o, TextInput as p, CATEGORIES as r, FUELS as s, Badge as t, PAY_METHODS as u, centsToInput as v, formatDate as w, draftFromExpense as x, cn as y };
