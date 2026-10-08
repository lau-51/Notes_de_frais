import { i as __toESM } from "../_runtime.mjs";
import { X as require_react, w as require_jsx_runtime, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { D as categoryMeta, L as TextInput, N as CategoryIcon, P as Chip, d as formatDate, i as useExpenses, j as Badge, u as eur, x as CATEGORIES } from "./router-Dw1w5zm1.mjs";
import { n as statusBadges } from "./expense-form-CxJE1a7Q.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/notes-Dx8kzuBu.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function NotesPage() {
	const { expenses, fileCount } = useExpenses();
	const [query, setQuery] = (0, import_react.useState)("");
	const [category, setCategory] = (0, import_react.useState)("all");
	const [onlyRefund, setOnlyRefund] = (0, import_react.useState)(false);
	const filtered = (0, import_react.useMemo)(() => {
		const needle = query.trim().toLowerCase();
		return expenses.filter((expense) => {
			if (category !== "all" && expense.category !== category) return false;
			if (onlyRefund && !(expense.payMethod === "cb_perso" && !expense.reimbursed)) return false;
			if (!needle) return true;
			return `${expense.merchant} ${expense.purpose} ${expense.guests} ${expense.beneficiary} ${categoryMeta(expense.category).label}`.toLowerCase().includes(needle);
		});
	}, [
		category,
		expenses,
		onlyRefund,
		query
	]);
	const total = filtered.reduce((sum, expense) => sum + expense.amountTtc, 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl leading-tight tracking-tight",
				children: "Pièces"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-sm text-muted tabular-nums",
				children: [
					filtered.length,
					" pièce",
					filtered.length > 1 ? "s" : "",
					" · ",
					eur(total)
				]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
				value: query,
				onChange: (event) => setQuery(event.target.value),
				placeholder: "Fournisseur, motif, convive"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "-mx-4 flex gap-2 overflow-x-auto scroll-x px-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
						active: category === "all" && !onlyRefund,
						onClick: () => {
							setCategory("all");
							setOnlyRefund(false);
						},
						children: "Toutes"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
						active: onlyRefund,
						onClick: () => setOnlyRefund((value) => !value),
						children: "À rembourser"
					}),
					CATEGORIES.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Chip, {
						active: category === item.id,
						onClick: () => setCategory(item.id),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoryIcon, { id: item.id }), item.short]
					}, item.id))
				]
			}),
			filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-border bg-surface p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "Aucune pièce ne correspond."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/scan",
					className: "mt-3 inline-flex h-11 items-center text-sm font-medium text-info",
					children: "Scanner un justificatif"
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "divide-y divide-border border-y border-border",
				children: filtered.map((expense) => {
					const badges = statusBadges(expense, fileCount(expense.id));
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/notes/$id",
						params: { id: expense.id },
						className: "flex items-center gap-3 py-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "flex size-11 shrink-0 items-center justify-center rounded-sm bg-surface text-muted",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoryIcon, { id: expense.category })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "min-w-0 flex-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block truncate",
										children: expense.merchant
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "block text-sm text-muted",
										children: [
											categoryMeta(expense.category).short,
											" · ",
											formatDate(expense.date)
										]
									}),
									badges.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mt-1 flex flex-wrap gap-1",
										children: badges.map((badge) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											tone: badge.tone,
											children: badge.label
										}, badge.label))
									}) : null
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "shrink-0 tabular-nums font-medium",
								children: eur(expense.amountTtc)
							})
						]
					}) }, expense.id);
				})
			})
		]
	});
}
//#endregion
export { NotesPage as component };
