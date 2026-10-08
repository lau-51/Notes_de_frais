import { i as __toESM } from "../_runtime.mjs";
import { X as require_react, Y as require_jsx_runtime, b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { C as eur, D as getPeriod, I as useExpenses, N as shiftAnchor, k as inPeriod, n as Button } from "./store-BWE3fr9t.mjs";
import { t as PeriodBar } from "./period-bar-DkOqrCca.mjs";
import { i as summarize } from "./fiscal-C07AQt-r.mjs";
import { r as InstallCard } from "./router-C-jncObW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CSpTB5RA.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Home() {
	const { expenses, settings, period, mode, anchor, fileCount, clearExamples } = useExpenses();
	const hasExamples = expenses.some((expense) => expense.example);
	const current = (0, import_react.useMemo)(() => {
		if (!period) return [];
		return expenses.filter((expense) => inPeriod(expense.date, period));
	}, [expenses, period]);
	const summary = (0, import_react.useMemo)(() => summarize(current, expenses, fileCount, settings.assujettiTva), [
		current,
		expenses,
		fileCount,
		settings.assujettiTva
	]);
	const previousPaid = (0, import_react.useMemo)(() => {
		if (!anchor || !period) return 0;
		const prev = getPeriod(shiftAnchor(anchor, mode, -1), mode);
		return expenses.filter((expense) => expense.professional && inPeriod(expense.date, prev)).reduce((sum, expense) => sum + expense.amountTtc, 0);
	}, [
		anchor,
		expenses,
		mode,
		period
	]);
	if (!period) return null;
	const delta = previousPaid > 0 ? Math.round((summary.paidTtc - previousPaid) / previousPaid * 100) : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl leading-tight tracking-tight",
				children: "Tableau"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: "Dépenses professionnelles de la période, par poste et au total."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InstallCard, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PeriodBar, {}),
			hasExamples ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-border bg-surface p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm",
					children: "Des exemples illustrent le carnet. Effacez-les avant vos vrais justificatifs."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "secondary",
					className: "mt-3",
					onClick: () => {
						clearExamples();
					},
					children: "Effacer les exemples"
				})]
			}) : null,
			!settings.raisonSociale.trim() ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Renseignez la raison sociale dans les réglages : elle sera imprimée sur les PDF."
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid grid-cols-2 gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tile, {
						label: "Payé TTC",
						value: eur(summary.paidTtc)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tile, {
						label: "Charges",
						value: eur(summary.charge)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tile, {
						label: "TVA à récupérer",
						value: eur(summary.recoverable)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tile, {
						label: "Pièces",
						value: String(summary.count)
					})
				]
			}),
			delta != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted tabular-nums",
				children: [
					delta > 0 ? "+" : "",
					delta,
					" % par rapport à la période précédente (",
					eur(previousPaid),
					")."
				]
			}) : null,
			summary.personalTtc > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted",
				children: [
					"Dont ",
					eur(summary.personalTtc),
					" de dépenses personnelles, hors charges."
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "flex flex-col gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-lg leading-tight",
					children: "Par poste"
				}), summary.byCategory.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "Aucune dépense professionnelle sur cette période."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoryChart, { rows: summary.byCategory.map((row) => ({
					label: row.label,
					euros: row.ttc / 100
				})) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "divide-y divide-border border-y border-border",
					children: summary.byCategory.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-baseline justify-between gap-3 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block",
								children: row.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-sm text-muted",
								children: [
									"Charge ",
									eur(row.charge),
									" · TVA ",
									eur(row.recoverable)
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "shrink-0 tabular-nums font-medium",
							children: eur(row.ttc)
						})]
					}, row.id))
				})] })]
			}),
			summary.flags.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-lg leading-tight",
				children: "À vérifier"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-2 divide-y divide-border border-y border-border",
				children: summary.flags.map((flag) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/notes/$id",
					params: { id: flag.id },
					className: "block py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block",
						children: flag.merchant
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm text-warn",
						children: flag.text
					})]
				}) }, `${flag.id}-${flag.text}`))
			})] }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-2 flex items-baseline justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-lg leading-tight",
					children: "Pièces de la période"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/notes",
					className: "text-sm text-muted",
					children: "Tout voir"
				})]
			}), current.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/scan",
				className: "text-sm text-info",
				children: "Scanner un justificatif"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "divide-y divide-border border-y border-border",
				children: current.slice(0, 6).map((expense) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/notes/$id",
					params: { id: expense.id },
					className: "flex items-baseline justify-between gap-3 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block truncate",
							children: expense.merchant
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm text-muted",
							children: expense.date
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "shrink-0 tabular-nums",
						children: eur(expense.amountTtc)
					})]
				}) }, expense.id))
			})] })
		]
	});
}
function Tile({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-border bg-surface p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 font-display text-xl leading-tight tabular-nums",
			children: value
		})]
	});
}
function CategoryChart({ rows }) {
	const [mod, setMod] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		let live = true;
		import("../_libs/recharts+[...].mjs").then((n) => n.t).then((loaded) => {
			if (live) setMod(loaded);
		});
		return () => {
			live = false;
		};
	}, []);
	if (!mod) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-64 rounded-xl bg-surface" });
	const { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } = mod;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "h-64 w-full min-w-0",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
			width: "100%",
			height: "100%",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
				data: rows,
				layout: "vertical",
				margin: {
					left: 0,
					right: 8,
					top: 4,
					bottom: 4
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
						type: "number",
						hide: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
						type: "category",
						dataKey: "label",
						width: 92,
						tick: {
							fill: "var(--color-muted)",
							fontSize: 12
						},
						axisLine: false,
						tickLine: false
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
						cursor: { fill: "var(--color-surface-2)" },
						formatter: (value) => eur(Math.round(Number(value) * 100))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
						dataKey: "euros",
						fill: "var(--color-info)",
						radius: [
							0,
							4,
							4,
							0
						],
						barSize: 12
					})
				]
			})
		})
	});
}
//#endregion
export { Home as component };
