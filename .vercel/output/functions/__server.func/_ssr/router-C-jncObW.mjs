import { i as __toESM } from "../_runtime.mjs";
import { S as useRouter, X as require_react, Y as require_jsx_runtime, _ as lazyRouteComponent, b as Link, d as Scripts, f as HeadContent, g as Outlet, h as createRouter, p as useRouterState, v as createFileRoute, y as createRootRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { D as Camera, b as FolderOutput, d as Scale, h as LayoutDashboard, l as Settings, r as TriangleAlert, s as Smartphone, u as ScrollText } from "../_libs/lucide-react.mjs";
import { I as useExpenses, c as Field, g as VEHICLES, m as Toggle, n as Button, o as ExpensesProvider, p as TextInput, s as FUELS, y as cn } from "./store-BWE3fr9t.mjs";
import { n as toast, t as Toaster } from "../_libs/sonner.mjs";
import { a as union, i as string, n as number, r as object, t as literal } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-C-jncObW.js
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
var CACHE = "frais-domaine-v1";
var DISMISS_KEY = "frais-android-install-dismissed";
var promptEvent = null;
var installed = false;
var promptListeners = /* @__PURE__ */ new Set();
var dismissListeners = /* @__PURE__ */ new Set();
function emitPrompt() {
	promptListeners.forEach((listener) => listener());
}
if (typeof window !== "undefined") {
	window.addEventListener("beforeinstallprompt", (event) => {
		event.preventDefault();
		promptEvent = event;
		emitPrompt();
	});
	window.addEventListener("appinstalled", () => {
		installed = true;
		promptEvent = null;
		emitPrompt();
	});
}
function subscribePrompt(listener) {
	promptListeners.add(listener);
	return () => promptListeners.delete(listener);
}
function subscribeDismiss(listener) {
	dismissListeners.add(listener);
	return () => dismissListeners.delete(listener);
}
function subscribeStandalone(listener) {
	const media = window.matchMedia("(display-mode: standalone), (display-mode: minimal-ui)");
	media.addEventListener("change", listener);
	return () => media.removeEventListener("change", listener);
}
function readStandalone() {
	const nav = navigator;
	return window.matchMedia("(display-mode: standalone)").matches || window.matchMedia("(display-mode: minimal-ui)").matches || nav.standalone === true;
}
function readDismissed() {
	try {
		return localStorage.getItem(DISMISS_KEY) === "1";
	} catch {
		return false;
	}
}
function useInstallState() {
	return {
		promptReady: (0, import_react.useSyncExternalStore)(subscribePrompt, () => promptEvent !== null, () => false),
		installed: (0, import_react.useSyncExternalStore)(subscribePrompt, () => installed, () => false),
		standalone: (0, import_react.useSyncExternalStore)(subscribeStandalone, readStandalone, () => false),
		dismissed: (0, import_react.useSyncExternalStore)(subscribeDismiss, readDismissed, () => false)
	};
}
async function promptInstall() {
	const event = promptEvent;
	if (!event) return "unavailable";
	await event.prompt();
	const choice = await event.userChoice;
	promptEvent = null;
	if (choice.outcome === "accepted") installed = true;
	emitPrompt();
	return choice.outcome;
}
function dismissInstall() {
	try {
		localStorage.setItem(DISMISS_KEY, "1");
	} catch {}
	dismissListeners.forEach((listener) => listener());
}
function useRegisterPwa() {
	(0, import_react.useEffect)(() => {
		if (!("serviceWorker" in navigator) || !("caches" in window)) return;
		let cancelled = false;
		(async () => {
			try {
				await navigator.serviceWorker.register("/sw.js", { scope: "/" });
				if (cancelled) return;
				const urls = /* @__PURE__ */ new Set([new URL("/", location.origin).href]);
				document.querySelectorAll("script[src]").forEach((node) => {
					if (node.src) urls.add(node.src);
				});
				document.querySelectorAll("link[rel='stylesheet'], link[rel='modulepreload']").forEach((node) => {
					if (node.href) urls.add(node.href);
				});
				const cache = await caches.open(CACHE);
				await Promise.all([...urls].map(async (url) => {
					try {
						const parsed = new URL(url, location.origin);
						if (parsed.origin !== location.origin) return;
						const response = await fetch(parsed.href);
						if (response.ok) await cache.put(parsed.href, response);
					} catch {}
				}));
			} catch {}
		})();
		return () => {
			cancelled = true;
		};
	}, []);
}
function InstallCard() {
	const { promptReady, installed, standalone, dismissed } = useInstallState();
	if (installed || standalone || dismissed) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "no-print rounded-xl border border-border bg-surface p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "flex size-11 shrink-0 items-center justify-center rounded-sm border border-border",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, {
						className: "size-5",
						"aria-hidden": true
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-lg leading-tight",
						children: "Installer sur Android"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: "Sans Play Store. L'icône ouvre le carnet en plein écran, et les pièces restent sur le téléphone, même hors ligne."
					})]
				})]
			}),
			promptReady ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "mt-3 w-full",
				onClick: () => void promptInstall(),
				children: "Installer"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
				className: "mt-3 list-decimal space-y-1 pl-5 text-sm text-muted",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Publiez l'application, puis ouvrez son lien dans Chrome." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Touchez le menu en haut à droite, puis « Installer l'application »." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Validez. L'icône rejoint vos autres applications." })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-subtle",
				children: "L'aperçu et l'application installée sont deux carnets distincts. Saisissez vos pièces depuis l'icône du téléphone."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "press mt-2 h-11 text-sm text-muted",
				onClick: dismissInstall,
				children: "Plus tard"
			})
		]
	});
}
function InstallSettings() {
	const { promptReady, installed, standalone } = useInstallState();
	if (installed || standalone) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted",
		children: "Application installée sur ce téléphone. Le carnet reste sur l'appareil."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "border-t border-border pt-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-lg leading-tight",
				children: "Installer sur Android"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: "Ouvrez le lien publié dans Chrome, menu, « Installer l'application ». Aucun fichier à télécharger."
			}),
			promptReady ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "secondary",
				className: "mt-3 w-full",
				onClick: () => void promptInstall(),
				children: "Installer"
			}) : null
		]
	});
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
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InstallSettings, {}),
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
	useRegisterPwa();
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
var styles_default = "/assets/styles-DI5CF_XH.css";
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
			},
			{
				name: "mobile-web-app-capable",
				content: "yes"
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
				href: "/manifest.webmanifest"
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
var $$splitComponentImporter$5 = () => import("./routes-CSpTB5RA.mjs");
var Route$6 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./export-NL8P1FaD.mjs");
var Route$5 = createFileRoute("/export")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./guide-DK950AQv.mjs");
var Route$4 = createFileRoute("/guide")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./notes-Ci2GQokY.mjs");
var Route$3 = createFileRoute("/notes")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./scan-TsX0uWgW.mjs");
var Route$2 = createFileRoute("/scan")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./notes_._id-CbV67uHV.mjs");
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
export { Route$1 as n, InstallCard as r, router_exports as t };
