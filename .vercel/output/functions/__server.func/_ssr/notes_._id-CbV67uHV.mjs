import { i as __toESM } from "../_runtime.mjs";
import { X as require_react, Y as require_jsx_runtime, b as Link, x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { I as useExpenses, x as draftFromExpense } from "./store-BWE3fr9t.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as ExpenseForm } from "./expense-form-BUgOeKJL.mjs";
import { n as Route$1 } from "./router-C-jncObW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/notes_._id-CbV67uHV.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function NotePage() {
	const { id } = Route$1.useParams();
	const navigate = useNavigate();
	const store = useExpenses();
	const expense = store.expenses.find((item) => item.id === id);
	const [attachments, setAttachments] = (0, import_react.useState)([]);
	const [removed, setRemoved] = (0, import_react.useState)([]);
	const [loaded, setLoaded] = (0, import_react.useState)(false);
	const [tick, setTick] = (0, import_react.useState)(0);
	const urls = (0, import_react.useRef)([]);
	const getBlobsRef = (0, import_react.useRef)(store.getBlobs);
	getBlobsRef.current = store.getBlobs;
	(0, import_react.useEffect)(() => {
		let cancel = false;
		setLoaded(false);
		getBlobsRef.current(id).then((files) => {
			if (cancel) return;
			const next = files.map((file) => {
				const url = URL.createObjectURL(file.blob);
				urls.current.push(url);
				return {
					key: file.id,
					name: file.name,
					mime: file.mime,
					url,
					blob: file.blob,
					existingId: file.id
				};
			});
			setAttachments(next);
			setRemoved([]);
			setLoaded(true);
		});
		return () => {
			cancel = true;
			urls.current.forEach((url) => URL.revokeObjectURL(url));
			urls.current = [];
		};
	}, [id, tick]);
	if (!expense) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-2xl leading-tight",
			children: "Pièce introuvable"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/notes",
			className: "text-sm text-info",
			children: "Retour aux pièces"
		})]
	});
	if (!loaded) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-muted",
		children: "Chargement de la pièce…"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/notes",
			className: "text-sm text-muted",
			children: "Pièces"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "mt-1 text-2xl leading-tight tracking-tight",
			children: expense.merchant
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExpenseForm, {
			expenseId: expense.id,
			createdAt: expense.createdAt,
			initial: draftFromExpense(expense),
			expenses: store.expenses,
			settings: store.settings,
			attachments,
			submitLabel: "Mettre à jour",
			onAdd: (files) => {
				urls.current.push(...files.map((file) => file.url));
				setAttachments((current) => [...current, ...files]);
			},
			onRemove: (key) => {
				setAttachments((current) => {
					const found = current.find((file) => file.key === key);
					if (found?.existingId) setRemoved((ids) => [...ids, found.existingId]);
					if (found) URL.revokeObjectURL(found.url);
					return current.filter((file) => file.key !== key);
				});
			},
			onSubmit: async (draft) => {
				const fresh = attachments.filter((file) => !file.existingId).map((file) => ({
					name: file.name,
					mime: file.mime,
					blob: file.blob
				}));
				await store.updateExpense(expense.id, draft, fresh, removed);
				toast.success("Pièce mise à jour");
				setTick((value) => value + 1);
			},
			onDelete: async () => {
				await store.deleteExpense(expense.id);
				toast.success("Pièce supprimée");
				await navigate({ to: "/notes" });
			}
		}, `${expense.id}-${tick}`)]
	});
}
//#endregion
export { NotePage as component };
