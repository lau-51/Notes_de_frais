import { i as __toESM } from "../_runtime.mjs";
import { X as require_react, Y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { C as Download, b as FolderOutput, c as Share2, p as Printer } from "../_libs/lucide-react.mjs";
import { A as loadAllBlobs, I as useExpenses, M as payLabel, O as importPayload, P as slug, T as frNum, _ as categoryMeta, b as csvCell, k as inPeriod, n as Button } from "./store-BWE3fr9t.mjs";
import { t as PeriodBar } from "./period-bar-DkOqrCca.mjs";
import { i as summarize, n as fiscalOf } from "./fiscal-C07AQt-r.mjs";
import { a as isAbortError, c as shareBlob, i as downloadBlob, n as buildPeriodPdf, o as printBlob, r as canPickDirectory, s as saveToDirectory, t as buildExpensePdf } from "./share-CO6S2Wg6.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as require_lib } from "../_libs/jszip+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/export-NL8P1FaD.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_lib = /* @__PURE__ */ __toESM(require_lib());
function dossierName(settings, period) {
	return `notes-frais_${period.fileKey}_${slug(settings.raisonSociale || "domaine")}.zip`;
}
function pieceName(expense) {
	return `${expense.date}_${expense.category}_${slug(expense.merchant)}_${expense.id.slice(0, 6)}.pdf`;
}
function csvFor(expenses, all, settings) {
	const lines = [[
		"Date",
		"Fournisseur",
		"Poste",
		"Compte",
		"Libellé compte",
		"TTC",
		"HT",
		"Taux TVA",
		"TVA",
		"TVA récupérable",
		"TVA non déductible",
		"Charge déductible",
		"Paiement",
		"Remboursé",
		"Facture au nom de la société",
		"Motif",
		"Convives",
		"Bénéficiaire",
		"Véhicule",
		"Carburant",
		"Verdict",
		"Id"
	].map(csvCell).join(";")];
	for (const expense of expenses) {
		const fiscal = fiscalOf(expense, all, settings.assujettiTva);
		const row = [
			expense.date,
			expense.merchant,
			categoryMeta(expense.category).label,
			fiscal.account,
			fiscal.accountLabel,
			frNum(expense.amountTtc),
			frNum(fiscal.ht),
			String(expense.vatRate).replace(".", ","),
			frNum(fiscal.vat),
			frNum(fiscal.recoverable),
			frNum(fiscal.vat - fiscal.recoverable),
			frNum(fiscal.charge),
			payLabel(expense.payMethod),
			expense.reimbursed ? "oui" : "non",
			expense.invoiceToCompany ? "oui" : "non",
			expense.purpose,
			expense.guests,
			expense.beneficiary,
			expense.vehicle ?? "",
			expense.fuel ?? "",
			fiscal.title,
			expense.id
		];
		lines.push(row.map(csvCell).join(";"));
	}
	return `\uFEFF${lines.join("\r\n")}`;
}
async function buildDossierZip(options) {
	const zip = new import_lib.default();
	const folder = zip.folder("pieces");
	const rows = [];
	for (const expense of options.expenses) {
		const files = await options.loadFiles(expense.id);
		const fiscal = fiscalOf(expense, options.all, options.settings.assujettiTva);
		rows.push({
			expense,
			fiscal,
			files
		});
		const bytes = await buildExpensePdf(expense, options.settings, fiscal, files);
		folder?.file(pieceName(expense), bytes);
	}
	const summaryPdf = await buildPeriodPdf({
		settings: options.settings,
		periodLabel: options.period.label,
		rows,
		totals: {
			paidTtc: options.summary.paidTtc,
			charge: options.summary.charge,
			recoverable: options.summary.recoverable
		},
		includeFiles: true
	});
	zip.file("recapitulatif.pdf", summaryPdf);
	zip.file("ecritures.csv", csvFor(options.expenses, options.all, options.settings));
	return zip.generateAsync({ type: "blob" });
}
async function buildSummaryPdf(options) {
	const rows = [];
	for (const expense of options.expenses) {
		const files = options.includeFiles ? await options.loadFiles(expense.id) : [];
		rows.push({
			expense,
			fiscal: fiscalOf(expense, options.all, options.settings.assujettiTva),
			files
		});
	}
	const bytes = await buildPeriodPdf({
		settings: options.settings,
		periodLabel: options.period.label,
		rows,
		totals: {
			paidTtc: options.summary.paidTtc,
			charge: options.summary.charge,
			recoverable: options.summary.recoverable
		},
		includeFiles: options.includeFiles
	});
	return new Blob([Uint8Array.from(bytes)], { type: "application/pdf" });
}
async function buildBackupZip(settings, expenses, files) {
	const zip = new import_lib.default();
	const payload = {
		version: 1,
		exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
		settings,
		expenses,
		files: files.map(({ blob: _blob, ...meta }) => meta)
	};
	zip.file("sauvegarde.json", JSON.stringify(payload));
	const folder = zip.folder("files");
	for (const file of files) folder?.file(file.id, file.blob);
	return zip.generateAsync({ type: "blob" });
}
async function readBackup(file) {
	const zip = await import_lib.default.loadAsync(await file.arrayBuffer());
	const jsonFile = zip.file("sauvegarde.json");
	if (!jsonFile) throw new Error("Ce fichier n'est pas une sauvegarde du carnet.");
	const payload = JSON.parse(await jsonFile.async("string"));
	if (payload.version !== 1 || !Array.isArray(payload.expenses) || !Array.isArray(payload.files)) throw new Error("Sauvegarde illisible.");
	const blobs = [];
	for (const meta of payload.files) {
		const entry = zip.file(`files/${meta.id}`);
		if (!entry) continue;
		const blob = await entry.async("blob");
		blobs.push({
			id: meta.id,
			blob: blob.type ? blob : new Blob([blob], { type: meta.mime })
		});
	}
	return {
		payload,
		blobs
	};
}
function ExportPage() {
	const store = useExpenses();
	const [busy, setBusy] = (0, import_react.useState)(null);
	const rows = (0, import_react.useMemo)(() => {
		if (!store.period) return [];
		return store.expenses.filter((expense) => inPeriod(expense.date, store.period));
	}, [store.expenses, store.period]);
	const summary = (0, import_react.useMemo)(() => summarize(rows, store.expenses, store.fileCount, store.settings.assujettiTva), [
		rows,
		store.expenses,
		store.fileCount,
		store.settings.assujettiTva
	]);
	async function run(key, action) {
		if (!store.period) return;
		setBusy(key);
		try {
			await action();
		} catch (error) {
			if (!isAbortError(error)) toast.error(error instanceof Error ? error.message : "Export impossible");
		} finally {
			setBusy(null);
		}
	}
	if (!store.period) return null;
	const period = store.period;
	const name = dossierName(store.settings, period);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl leading-tight tracking-tight",
				children: "Export"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-sm text-muted",
				children: [
					rows.length,
					" pièce",
					rows.length > 1 ? "s" : "",
					" sur la période. Le dossier contient le récapitulatif PDF, chaque justificatif et un CSV pour la comptabilité."
				]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PeriodBar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						className: "w-full",
						disabled: busy != null || rows.length === 0,
						onClick: () => void run("zip", async () => {
							const blob = await buildDossierZip({
								settings: store.settings,
								period,
								expenses: rows,
								all: store.expenses,
								summary,
								loadFiles: store.getBlobs
							});
							downloadBlob(blob, name);
							toast.success("Dossier téléchargé");
						}),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {
							className: "size-4",
							"aria-hidden": true
						}), busy === "zip" ? "Préparation…" : "Télécharger le ZIP"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "secondary",
						className: "w-full",
						disabled: busy != null || rows.length === 0,
						onClick: () => void run("share", async () => {
							const blob = await buildDossierZip({
								settings: store.settings,
								period,
								expenses: rows,
								all: store.expenses,
								summary,
								loadFiles: store.getBlobs
							});
							if (await shareBlob(blob, name, "application/zip") === "shared") toast.success("Dossier partagé");
							else toast.success("Partage indisponible : dossier téléchargé");
						}),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, {
							className: "size-4",
							"aria-hidden": true
						}), "Partager"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "secondary",
						className: "w-full",
						disabled: busy != null || rows.length === 0,
						onClick: () => void run("print", async () => {
							const blob = await buildSummaryPdf({
								settings: store.settings,
								period,
								expenses: rows,
								all: store.expenses,
								summary,
								loadFiles: store.getBlobs,
								includeFiles: true
							});
							printBlob(blob);
						}),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, {
							className: "size-4",
							"aria-hidden": true
						}), "Imprimer récapitulatif et pièces"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "secondary",
						className: "w-full",
						disabled: busy != null || rows.length === 0 || !canPickDirectory(),
						onClick: () => void run("dir", async () => {
							const blob = await buildDossierZip({
								settings: store.settings,
								period,
								expenses: rows,
								all: store.expenses,
								summary,
								loadFiles: store.getBlobs
							});
							await saveToDirectory(blob, name);
							toast.success("Dossier enregistré");
						}),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderOutput, {
							className: "size-4",
							"aria-hidden": true
						}), "Enregistrer dans un dossier"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "flex flex-col gap-2 text-sm text-muted",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-lg leading-tight text-fg",
						children: "Où envoyer les pièces"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Google Drive, Gmail ou une autre application : touchez Partager. Sur téléphone, le menu du système propose ces destinations." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Serveur TSE : téléchargez le ZIP, ouvrez votre session bureau à distance, puis déposez le fichier dans le lecteur réseau ou le dossier partagé. Le navigateur ne peut pas ouvrir une session TSE." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Sur ordinateur, Enregistrer dans un dossier permet de viser un lecteur déjà monté, y compris un dossier synchronisé." })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "flex flex-col gap-2 border-t border-border pt-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-lg leading-tight",
						children: "Sauvegarde de l'appareil"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Emportez tout le carnet (pièces et réglages) vers un autre téléphone, puis restaurez-le."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						className: "w-full",
						disabled: busy != null,
						onClick: () => void run("backup", async () => {
							const files = await loadAllBlobs(store.files);
							const blob = await buildBackupZip(store.settings, store.expenses, files);
							downloadBlob(blob, "sauvegarde-frais-de-domaine.zip");
							toast.success("Sauvegarde téléchargée");
						}),
						children: "Télécharger la sauvegarde"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "press inline-flex h-11 cursor-pointer items-center justify-center rounded-sm border border-border bg-surface-2 px-4 text-sm font-medium",
						children: ["Restaurer une sauvegarde", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "file",
							accept: "application/zip,.zip",
							className: "sr-only",
							onChange: (event) => {
								const file = event.target.files?.[0];
								event.target.value = "";
								if (!file) return;
								run("import", async () => {
									const backup = await readBackup(file);
									await importPayload(backup.payload, backup.blobs);
									await store.reload();
									toast.success("Sauvegarde restaurée");
								});
							}
						})]
					})
				]
			})
		]
	});
}
//#endregion
export { ExportPage as component };
