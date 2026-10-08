import { i as __toESM } from "../_runtime.mjs";
import { X as require_react, Y as require_jsx_runtime, x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { F as todayIso, I as useExpenses, S as emptyDraft } from "./store-BWE3fr9t.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as ExpenseForm } from "./expense-form-BUgOeKJL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/scan-TsX0uWgW.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ScanPage() {
	const navigate = useNavigate();
	const { expenses, settings, createExpense } = useExpenses();
	const [attachments, setAttachments] = (0, import_react.useState)([]);
	const urls = (0, import_react.useRef)([]);
	(0, import_react.useEffect)(() => {
		return () => urls.current.forEach((url) => URL.revokeObjectURL(url));
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-2xl leading-tight tracking-tight",
			children: "Nouvelle pièce"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm text-muted",
			children: "Photographiez le ticket ou importez un PDF. Le document est converti et conservé sur cet appareil."
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExpenseForm, {
			initial: emptyDraft(todayIso()),
			expenses,
			settings,
			attachments,
			submitLabel: "Enregistrer la pièce",
			autoFocusAmount: true,
			onAdd: (files) => {
				urls.current.push(...files.map((file) => file.url));
				setAttachments((current) => [...current, ...files]);
			},
			onRemove: (key) => {
				setAttachments((current) => {
					const found = current.find((file) => file.key === key);
					if (found) URL.revokeObjectURL(found.url);
					return current.filter((file) => file.key !== key);
				});
			},
			onSubmit: async (draft) => {
				const id = await createExpense(draft, attachments.map((file) => ({
					name: file.name,
					mime: file.mime,
					blob: file.blob
				})));
				toast.success("Pièce enregistrée");
				await navigate({
					to: "/notes/$id",
					params: { id }
				});
			}
		})]
	});
}
//#endregion
export { ScanPage as component };
