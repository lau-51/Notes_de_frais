import { w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { E as ChevronLeft, T as ChevronRight } from "../_libs/lucide-react.mjs";
import { i as useExpenses, z as cn } from "./router-Dw1w5zm1.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/period-bar-DS4hzPAj.js
var import_jsx_runtime = require_jsx_runtime();
function PeriodBar() {
	const { mode, setMode, period, shiftPeriod, canGoNext } = useExpenses();
	if (!period) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-2 rounded-lg bg-surface p-1",
			role: "tablist",
			"aria-label": "Période",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PeriodTab, {
				active: mode === "week",
				onClick: () => setMode("week"),
				children: "Semaine"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PeriodTab, {
				active: mode === "month",
				onClick: () => setMode("month"),
				children: "Mois"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "press flex size-11 items-center justify-center rounded-sm border border-border",
					"aria-label": "Période précédente",
					onClick: () => shiftPeriod(-1),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, {
						className: "size-5",
						"aria-hidden": true
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "min-w-0 text-center text-sm font-medium",
					children: period.label
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "press flex size-11 items-center justify-center rounded-sm border border-border disabled:opacity-40",
					"aria-label": "Période suivante",
					disabled: !canGoNext,
					onClick: () => shiftPeriod(1),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {
						className: "size-5",
						"aria-hidden": true
					})
				})
			]
		})]
	});
}
function PeriodTab({ active, onClick, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		role: "tab",
		"aria-selected": active,
		onClick,
		className: cn("press h-11 rounded-md text-sm font-medium", active ? "bg-surface-2 text-fg" : "text-muted"),
		children
	});
}
//#endregion
export { PeriodBar as t };
