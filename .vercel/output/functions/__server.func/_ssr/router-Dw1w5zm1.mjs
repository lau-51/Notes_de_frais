import { i as __toESM } from "../_runtime.mjs";
import { C as useRouter, X as require_react, _ as Outlet, b as createRootRoute, f as Scripts, g as createRouter, m as useRouterState, p as HeadContent, v as lazyRouteComponent, w as require_jsx_runtime, x as Link, y as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { D as Camera, O as BedDouble, S as Ellipsis, _ as GraduationCap, a as TrainFront, b as FolderOutput, d as Scale, f as Route, h as LayoutDashboard, l as Settings, m as Package, n as UtensilsCrossed, o as Ticket, r as TriangleAlert, s as Smartphone, t as Wrench, u as ScrollText, v as Gift, w as CircleParking, y as Fuel } from "../_libs/lucide-react.mjs";
import { a as union, i as string, n as number, r as object, t as literal } from "../_libs/zod.mjs";
import { n as toast, t as Toaster } from "../_libs/sonner.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { a as startOfMonth, c as startOfISOWeek, i as endOfISOWeek, l as addMonths, n as format, o as endOfMonth, r as getISOWeek, s as addWeeks, t as fr, u as addDays } from "../_libs/date-fns.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-Dw1w5zm1.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: errorMessage(error)
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
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
function SettingsDialog({ onClose }) {
	const { settings, saveSettings, expenses, clearExamples, loadExamples, eraseAllData } = useExpenses();
	const [draft, setDraft] = (0, import_react.useState)(settings);
	const [confirm, setConfirm] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const hasExamples = expenses.some((expense) => expense.example);
	async function save() {
		setBusy(true);
		try {
			await saveSettings(draft);
			toast.success("Réglages enregistrés");
			onClose();
		} catch {
			toast.error("Enregistrement impossible");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-40 flex items-end justify-center bg-bg/80 sm:items-center",
		role: "presentation",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			role: "dialog",
			"aria-modal": "true",
			"aria-labelledby": "settings-title",
			className: "max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-surface p-5 sm:rounded-2xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					id: "settings-title",
					className: "text-xl leading-tight",
					children: "Société"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: "Ces informations figurent sur les PDF. Elles restent sur cet appareil."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "press h-11 px-2 text-sm text-muted",
					onClick: onClose,
					children: "Fermer"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Raison sociale",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
							value: draft.raisonSociale,
							onChange: (event) => setDraft({
								...draft,
								raisonSociale: event.target.value
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "SIRET",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
							inputMode: "numeric",
							value: draft.siret,
							onChange: (event) => setDraft({
								...draft,
								siret: event.target.value
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Dirigeant",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
							value: draft.dirigeant,
							onChange: (event) => setDraft({
								...draft,
								dirigeant: event.target.value
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Adresse",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
							value: draft.adresse,
							onChange: (event) => setDraft({
								...draft,
								adresse: event.target.value
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
						label: "La société récupère la TVA",
						checked: draft.assujettiTva,
						onChange: (assujettiTva) => setDraft({
							...draft,
							assujettiTva
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-subtle",
						children: "Décochez en cas de franchise en base : aucune TVA ne sera proposée en récupération."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
						className: "mb-2 text-sm font-medium text-muted",
						children: "Véhicule habituel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-2",
						children: VEHICLES.map((vehicle) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pick, {
							active: draft.defaultVehicle === vehicle.id,
							onClick: () => setDraft({
								...draft,
								defaultVehicle: vehicle.id
							}),
							children: vehicle.label
						}, vehicle.id))
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
						className: "mb-2 text-sm font-medium text-muted",
						children: "Carburant habituel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-2",
						children: FUELS.map((fuel) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pick, {
							active: draft.defaultFuel === fuel.id,
							onClick: () => setDraft({
								...draft,
								defaultFuel: fuel.id
							}),
							children: fuel.label
						}, fuel.id))
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "w-full",
						disabled: busy,
						onClick: () => void save(),
						children: "Enregistrer"
					}),
					hasExamples ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						className: "w-full",
						onClick: () => {
							clearExamples().then(() => toast.success("Exemples effacés"));
						},
						children: "Effacer les exemples"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						className: "w-full",
						onClick: () => {
							loadExamples().then(() => toast.success("Exemples ajoutés"));
						},
						children: "Charger des exemples"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-t border-border pt-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted",
								children: "Pour vider le carnet de cet appareil, écrivez EFFACER."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
								className: "mt-2",
								value: confirm,
								onChange: (event) => setConfirm(event.target.value)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "danger",
								className: "mt-2 w-full",
								disabled: confirm !== "EFFACER" || busy,
								onClick: () => {
									eraseAllData().then(() => {
										toast.success("Carnet vidé");
										onClose();
									});
								},
								children: "Effacer toutes les données"
							})
						]
					})
				]
			})]
		})
	});
}
function Pick({ active, children, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		className: active ? "press h-11 rounded-sm border border-accent bg-accent px-3 text-sm font-medium text-accent-fg" : "press h-11 rounded-sm border border-border px-3 text-sm font-medium",
		children
	});
}
var LINKS = [
	{
		to: "/",
		label: "Tableau",
		icon: LayoutDashboard
	},
	{
		to: "/notes",
		label: "Pièces",
		icon: ScrollText
	},
	{
		to: "/export",
		label: "Export",
		icon: FolderOutput
	},
	{
		to: "/guide",
		label: "Fiscal",
		icon: Scale
	}
];
function Shell({ children }) {
	const { ready, error, settings } = useExpenses();
	const [open, setOpen] = (0, import_react.useState)(false);
	const path = useRouterState({ select: (state) => state.location.pathname });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "no-print sticky top-0 z-20 border-b border-border bg-bg/95",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex h-16 w-full max-w-3xl items-center justify-between gap-3 px-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-display text-lg leading-tight tracking-tight",
							children: "Frais de domaine"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block truncate text-sm text-muted",
							children: settings.raisonSociale.trim() || "Notes de frais · SARL viticole"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "press flex size-11 items-center justify-center rounded-sm border border-border",
						"aria-label": "Réglages de la société",
						onClick: () => setOpen(true),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, {
							className: "size-5",
							"aria-hidden": true
						})
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "app-main mx-auto w-full max-w-3xl px-4 pt-5",
				children: error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-danger",
					children: error
				}) : ready ? children : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted",
					children: "Ouverture du carnet…"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "no-print app-nav fixed inset-x-0 bottom-0 z-20 border-t border-border bg-surface",
				"aria-label": "Navigation",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto grid w-full max-w-3xl grid-cols-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavItem, {
							to: "/",
							label: "Tableau",
							icon: LayoutDashboard,
							active: path === "/"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavItem, {
							to: "/notes",
							label: "Pièces",
							icon: ScrollText,
							active: path.startsWith("/notes")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/scan",
							className: cn("flex flex-col items-center justify-center gap-1 text-xs", path === "/scan" ? "text-fg" : "text-muted"),
							"aria-current": path === "/scan" ? "page" : void 0,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "flex size-10 items-center justify-center rounded-full bg-accent text-accent-fg",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, {
									className: "size-5",
									"aria-hidden": true
								})
							}), "Scanner"]
						}),
						LINKS.slice(2).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavItem, {
							to: item.to,
							label: item.label,
							icon: item.icon,
							active: path.startsWith(item.to)
						}, item.to))
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
				theme: "dark",
				position: "top-center"
			}),
			open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsDialog, { onClose: () => setOpen(false) }) : null
		]
	});
}
function NavItem({ to, label, icon: Icon, active }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to,
		"aria-current": active ? "page" : void 0,
		className: cn("flex min-h-16 flex-col items-center justify-center gap-1 text-xs", active ? "text-fg" : "text-muted"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
			className: "size-5",
			"aria-hidden": true
		}), label]
	});
}
var styles_default = "/assets/styles-DhfvDLsB.css";
var Route$7 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Frais de domaine" },
			{
				name: "description",
				content: "Notes de frais pour une SARL viticole : justificatifs, TVA et export comptable."
			},
			{
				name: "theme-color",
				content: "#12110e"
			}
		],
		links: [
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Outfit:wght@400;500;600&display=swap"
			},
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			}
		]
	}),
	component: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "fr",
		className: "antialiased",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExpensesProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }) }) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	})
});
var $$splitComponentImporter$5 = () => import("./routes-7RR0vEXy.mjs");
var Route$6 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./export-BFq9xGbu.mjs");
var Route$5 = createFileRoute("/export")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./guide-DK950AQv.mjs");
var Route$4 = createFileRoute("/guide")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./notes-Dx8kzuBu.mjs");
var Route$3 = createFileRoute("/notes")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./scan-SzkhtUCy.mjs");
var Route$2 = createFileRoute("/scan")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./notes_._id-B_LxO6pj.mjs");
var Route$1 = createFileRoute("/notes_/$id")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var rootRouteChildren = {
	IndexRoute: Route$6.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$7
	}),
	ExportRoute: Route$5.update({
		id: "/export",
		path: "/export",
		getParentRoute: () => Route$7
	}),
	GuideRoute: Route$4.update({
		id: "/guide",
		path: "/guide",
		getParentRoute: () => Route$7
	}),
	NotesRoute: Route$3.update({
		id: "/notes",
		path: "/notes",
		getParentRoute: () => Route$7
	}),
	ScanRoute: Route$2.update({
		id: "/scan",
		path: "/scan",
		getParentRoute: () => Route$7
	}),
	NotesIdRoute: Route$1.update({
		id: "/notes_/$id",
		path: "/notes/$id",
		getParentRoute: () => Route$7
	})
};
var routeTree = Route$7._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { vehicleLabel as A, MEALS as C, categoryMeta as D, VEHICLES as E, Field as F, TextArea as I, TextInput as L, Button as M, CategoryIcon as N, fuelLabel as O, Chip as P, Toggle as R, FUELS as S, STAYS as T, getPeriod as a, emptyDraft as b, centsToInput as c, formatDate as d, frNum as f, importPayload as g, todayIso as h, useExpenses as i, Badge as j, payLabel as k, csvCell as l, slug as m, Route$1 as n, inPeriod as o, parseEuro as p, loadAllBlobs as r, shiftAnchor as s, router_exports as t, eur as u, VAT_RATES as v, PAY_METHODS as w, CATEGORIES as x, draftFromExpense as y, cn as z };
