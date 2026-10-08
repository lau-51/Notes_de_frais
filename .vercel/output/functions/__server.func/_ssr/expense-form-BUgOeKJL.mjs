import { i as __toESM } from "../_runtime.mjs";
import { X as require_react, Y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { D as Camera, c as Share2, g as ImagePlus, i as Trash2, p as Printer, x as FileText } from "../_libs/lucide-react.mjs";
import { C as eur, P as slug, _ as categoryMeta, a as Chip, c as Field, d as STAYS, f as TextArea, g as VEHICLES, h as VAT_RATES, i as CategoryIcon, j as parseEuro, l as MEALS, m as Toggle, n as Button, p as TextInput, r as CATEGORIES, s as FUELS, t as Badge, u as PAY_METHODS, v as centsToInput } from "./store-BWE3fr9t.mjs";
import { n as fiscalOf, r as peerGifts, t as analyzeExpense } from "./fiscal-C07AQt-r.mjs";
import { a as isAbortError, c as shareBlob, o as printBlob, t as buildExpensePdf } from "./share-CO6S2Wg6.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/expense-form-BUgOeKJL.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TONE = {
	ok: "ok",
	partial: "info",
	no_vat: "warn",
	check: "warn",
	personal: "danger"
};
function FiscalCard({ fiscal }) {
	if (!fiscal) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-xl border border-border bg-surface p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-lg leading-tight",
			children: "Lecture fiscale"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-muted",
			children: "Choisissez un poste et un montant pour voir la charge et la TVA."
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-xl border border-border bg-surface p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-lg leading-tight",
					children: "Lecture fiscale"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					tone: TONE[fiscal.verdict],
					children: fiscal.title
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "mt-4 grid grid-cols-2 gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "HT",
						value: eur(fiscal.ht)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "TVA",
						value: eur(fiscal.vat)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "TVA récupérable",
						value: eur(fiscal.recoverable)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Charge",
						value: eur(fiscal.charge)
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-sm text-muted",
				children: [
					"Compte suggéré ",
					fiscal.account,
					" · ",
					fiscal.accountLabel
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex flex-col gap-2",
				children: [fiscal.details.map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: line
				}, line)), fiscal.warnings.map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-warn",
					children: line
				}, line))]
			}),
			fiscal.lines.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-4 flex flex-col gap-2 border-t border-border pt-3",
				children: fiscal.lines.map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-baseline justify-between gap-3 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-muted",
							children: [line.side === "debit" ? "Débit" : "Crédit", " "]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tabular-nums",
							children: line.account
						}),
						" ",
						line.label
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "shrink-0 tabular-nums",
						children: eur(line.amount)
					})]
				}, `${line.side}-${line.account}`))
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-subtle",
				children: "Aide indicative, pas l'avis de votre expert-comptable. Les comptes se calent sur votre plan comptable."
			})
		]
	});
}
function Stat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-sm bg-bg px-3 py-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "text-sm text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: "tabular-nums text-base font-medium",
			children: value
		})]
	});
}
var MAX_BYTES = 26214400;
async function prepareFile(file) {
	if (file.size > MAX_BYTES) throw new Error("Fichier trop lourd (25 Mo maximum).");
	if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) return {
		name: file.name || "document.pdf",
		mime: "application/pdf",
		blob: file
	};
	if (!file.type.startsWith("image/")) throw new Error("Format non reconnu. Utilisez une photo ou un PDF.");
	try {
		const blob = await compressImage(file);
		return {
			name: `${(file.name || "justificatif").replace(/\.[^.]+$/, "")}.jpg`,
			mime: "image/jpeg",
			blob
		};
	} catch {
		throw new Error("Cette photo ne peut pas être lue. Réessayez en JPG.");
	}
}
async function compressImage(file) {
	const bitmap = await createImageBitmap(file);
	const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
	const width = Math.max(1, Math.round(bitmap.width * scale));
	const height = Math.max(1, Math.round(bitmap.height * scale));
	const canvas = document.createElement("canvas");
	canvas.width = width;
	canvas.height = height;
	const ctx = canvas.getContext("2d");
	if (!ctx) throw new Error("canvas");
	ctx.fillStyle = "#ffffff";
	ctx.fillRect(0, 0, width, height);
	ctx.drawImage(bitmap, 0, 0, width, height);
	bitmap.close();
	const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", .82));
	if (!blob) throw new Error("jpeg");
	return blob;
}
function validateDraft(draft, amountText, alcoholText) {
	const errors = [];
	const amount = parseEuro(amountText);
	if (amount == null || amount <= 0) errors.push("Indiquez un montant TTC supérieur à zéro.");
	if (draft.merchant.trim().length < 2) errors.push("Indiquez le fournisseur.");
	if (!/^\d{4}-\d{2}-\d{2}$/.test(draft.date)) errors.push("Indiquez la date du justificatif.");
	if (!draft.category) errors.push("Choisissez un poste de dépense.");
	const alcohol = alcoholText.trim() ? parseEuro(alcoholText) : 0;
	if (alcoholText.trim() && alcohol == null) errors.push("Le montant d'alcool n'est pas lisible.");
	if (alcohol != null && amount != null && alcohol > amount) errors.push("Le montant d'alcool ne peut pas dépasser le total.");
	return errors;
}
function ExpenseForm({ initial, expenses, settings, attachments, expenseId, createdAt, submitLabel, autoFocusAmount, onAdd, onRemove, onSubmit, onDelete }) {
	const [draft, setDraft] = (0, import_react.useState)(initial);
	const [amountText, setAmountText] = (0, import_react.useState)(initial.amountTtc ? centsToInput(initial.amountTtc) : "");
	const [alcoholText, setAlcoholText] = (0, import_react.useState)(initial.alcoholTtc ? centsToInput(initial.alcoholTtc) : "");
	const [errors, setErrors] = (0, import_react.useState)([]);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [confirmDelete, setConfirmDelete] = (0, import_react.useState)(false);
	const [zoom, setZoom] = (0, import_react.useState)(null);
	const cameraRef = (0, import_react.useRef)(null);
	const fileRef = (0, import_react.useRef)(null);
	const categoryRow = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const root = categoryRow.current;
		if (!root || !draft.category) return;
		root.querySelector(`[data-category="${draft.category}"]`)?.scrollIntoView({
			inline: "center",
			block: "nearest"
		});
	}, [draft.category]);
	const merchants = (0, import_react.useMemo)(() => {
		const names = /* @__PURE__ */ new Set();
		for (const expense of expenses) if (expense.merchant.trim()) names.add(expense.merchant.trim());
		return [...names].slice(0, 24);
	}, [expenses]);
	function patch(partial) {
		setDraft((current) => ({
			...current,
			...partial
		}));
	}
	function chooseCategory(id) {
		const meta = categoryMeta(id);
		setDraft((current) => ({
			...current,
			category: id,
			vatRate: meta.defaultVat,
			vehicle: id === "carburant" || id === "entretien" ? current.vehicle ?? settings.defaultVehicle : null,
			fuel: id === "carburant" ? current.fuel ?? settings.defaultFuel : null,
			stayFor: id === "hotel" ? current.stayFor ?? "dirigeant" : null,
			mealKind: id === "restaurant" ? current.mealKind ?? "affaires" : null
		}));
		if (id !== "restaurant") setAlcoholText("");
	}
	function collect() {
		const amount = parseEuro(amountText);
		const alcohol = alcoholText.trim() ? parseEuro(alcoholText) : null;
		const next = {
			...draft,
			merchant: draft.merchant.trim(),
			purpose: draft.purpose.trim(),
			guests: draft.guests.trim(),
			beneficiary: draft.beneficiary.trim(),
			comment: draft.comment.trim(),
			amountTtc: amount ?? 0,
			alcoholTtc: draft.category === "restaurant" && alcohol ? alcohol : null
		};
		const found = validateDraft(next, amountText, alcoholText);
		setErrors(found);
		if (found.length || amount == null || !next.category) return null;
		return next;
	}
	const live = (0, import_react.useMemo)(() => {
		if (!draft.category) return null;
		const amount = parseEuro(amountText);
		if (amount == null) return null;
		const alcohol = alcoholText.trim() ? parseEuro(alcoholText) : null;
		const core = {
			...draft,
			category: draft.category,
			amountTtc: amount,
			alcoholTtc: draft.category === "restaurant" && alcohol ? alcohol : null
		};
		return analyzeExpense(core, {
			assujettiTva: settings.assujettiTva,
			peerGiftsTtc: peerGifts({
				id: expenseId ?? "apercu",
				date: core.date,
				beneficiary: core.beneficiary,
				category: core.category,
				professional: core.professional
			}, expenses)
		});
	}, [
		alcoholText,
		amountText,
		draft,
		expenseId,
		expenses,
		settings.assujettiTva
	]);
	const duplicate = (0, import_react.useMemo)(() => {
		const amount = parseEuro(amountText);
		const merchant = draft.merchant.trim().toLowerCase();
		if (amount == null || merchant.length < 2) return false;
		return expenses.some((expense) => expense.id !== expenseId && expense.date === draft.date && expense.amountTtc === amount && expense.merchant.trim().toLowerCase() === merchant);
	}, [
		amountText,
		draft.date,
		draft.merchant,
		expenseId,
		expenses
	]);
	async function addPicked(list) {
		if (!list?.length) return;
		const next = [];
		for (const file of Array.from(list)) try {
			const prepared = await prepareFile(file);
			next.push({
				key: crypto.randomUUID(),
				name: prepared.name,
				mime: prepared.mime,
				blob: prepared.blob,
				url: URL.createObjectURL(prepared.blob)
			});
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Fichier refusé");
		}
		if (next.length) onAdd(next);
	}
	async function submit() {
		const next = collect();
		if (!next) return;
		setBusy(true);
		try {
			await onSubmit(next);
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Enregistrement impossible");
		} finally {
			setBusy(false);
		}
	}
	async function output(kind) {
		const next = collect();
		if (!next?.category) return;
		const expense = {
			...next,
			category: next.category,
			id: expenseId ?? "apercu",
			createdAt: createdAt ?? (/* @__PURE__ */ new Date()).toISOString(),
			updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
			example: false
		};
		setBusy(true);
		try {
			const fiscal = fiscalOf(expense, expenses, settings.assujettiTva);
			const bytes = await buildExpensePdf(expense, settings, fiscal, attachments.map((file) => ({
				name: file.name,
				mime: file.mime,
				blob: file.blob
			})));
			const blob = new Blob([Uint8Array.from(bytes)], { type: "application/pdf" });
			const filename = `${expense.date}_${slug(expense.merchant)}.pdf`;
			if (kind === "print") printBlob(blob);
			else if (await shareBlob(blob, filename, "application/pdf") === "downloaded") toast.success("PDF téléchargé");
		} catch (error) {
			if (!isAbortError(error)) toast.error("PDF impossible pour le moment");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "flex flex-col gap-5",
		onSubmit: (event) => {
			event.preventDefault();
			submit();
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "flex flex-col gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-2 overflow-x-auto scroll-x",
						children: attachments.map((file) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative shrink-0",
							children: [file.mime.startsWith("image/") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setZoom(file.url),
								className: "block",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: file.url,
									alt: file.name,
									className: "h-28 w-24 rounded-sm object-cover"
								})
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: file.url,
								target: "_blank",
								rel: "noreferrer",
								className: "flex h-28 w-24 flex-col items-center justify-center gap-2 rounded-sm border border-border bg-surface text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, {
									className: "size-5",
									"aria-hidden": true
								}), "PDF"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-label": `Retirer ${file.name}`,
								onClick: () => onRemove(file.key),
								className: "press absolute right-1 top-1 flex size-8 items-center justify-center rounded-full bg-bg text-fg",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {
									className: "size-3.5",
									"aria-hidden": true
								})
							})]
						}, file.key))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "secondary",
							onClick: () => cameraRef.current?.click(),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, {
								className: "size-4",
								"aria-hidden": true
							}), "Photo"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "secondary",
							onClick: () => fileRef.current?.click(),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePlus, {
								className: "size-4",
								"aria-hidden": true
							}), "Importer"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						ref: cameraRef,
						type: "file",
						accept: "image/*",
						capture: "environment",
						className: "sr-only",
						onChange: (event) => {
							addPicked(event.target.files);
							event.target.value = "";
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						ref: fileRef,
						type: "file",
						accept: "image/*,application/pdf",
						multiple: true,
						className: "sr-only",
						onChange: (event) => {
							addPicked(event.target.files);
							event.target.value = "";
						}
					}),
					attachments.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-subtle",
						children: "Sans photo, la pièce reste enregistrée mais marquée incomplète."
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Montant TTC",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
						inputMode: "decimal",
						autoFocus: autoFocusAmount,
						autoComplete: "off",
						placeholder: "0,00",
						value: amountText,
						onChange: (event) => setAmountText(event.target.value)
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Date",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
						type: "date",
						value: draft.date,
						onChange: (event) => patch({ date: event.target.value })
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Field, {
				label: "Fournisseur",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
					list: "merchants",
					autoComplete: "off",
					placeholder: "Hôtel, station, restaurant…",
					value: draft.merchant,
					onChange: (event) => patch({ merchant: event.target.value })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("datalist", {
					id: "merchants",
					children: merchants.map((name) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: name }, name))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
				className: "mb-2 text-sm font-medium text-muted",
				children: "Poste"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref: categoryRow,
				className: "-mx-4 flex gap-2 overflow-x-auto scroll-x px-4 pb-1",
				children: CATEGORIES.map((category) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Chip, {
					"data-category": category.id,
					active: draft.category === category.id,
					onClick: () => chooseCategory(category.id),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoryIcon, { id: category.id }), category.short]
				}, category.id))
			})] }),
			draft.category === "hotel" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Choice, {
				label: "Qui est hébergé ?",
				value: draft.stayFor,
				options: STAYS,
				onChange: (stayFor) => patch({ stayFor })
			}) : null,
			draft.category === "restaurant" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Choice, {
				label: "Quel repas ?",
				value: draft.mealKind,
				options: MEALS,
				onChange: (mealKind) => patch({ mealKind })
			}) : null,
			draft.category === "carburant" || draft.category === "entretien" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Choice, {
				label: "Véhicule",
				value: draft.vehicle,
				options: VEHICLES,
				onChange: (vehicle) => patch({ vehicle })
			}) : null,
			draft.category === "carburant" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Choice, {
				label: "Carburant",
				value: draft.fuel,
				options: FUELS,
				onChange: (fuel) => patch({ fuel })
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
				className: "mb-2 text-sm font-medium text-muted",
				children: "Taux de TVA du justificatif"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-2",
				children: VAT_RATES.map((rate) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
					active: draft.vatRate === rate,
					onClick: () => patch({ vatRate: rate }),
					children: rate === 0 ? "Sans TVA" : `${String(rate).replace(".", ",")} %`
				}, rate))
			})] }),
			draft.category === "restaurant" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Dont alcool, TTC",
				hint: "Laissé vide si la note ne sépare pas l'alcool. Le reste suit le taux choisi.",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
					inputMode: "decimal",
					placeholder: "0,00",
					value: alcoholText,
					onChange: (event) => setAlcoholText(event.target.value)
				})
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
				label: "Dépense professionnelle",
				checked: draft.professional,
				onChange: (professional) => patch({ professional })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
				label: "Facture ou ticket au nom de la société",
				checked: draft.invoiceToCompany,
				onChange: (invoiceToCompany) => patch({ invoiceToCompany })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Choice, {
				label: "Paiement",
				value: draft.payMethod,
				options: PAY_METHODS,
				onChange: (payMethod) => patch({ payMethod })
			}),
			draft.payMethod === "cb_perso" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
				label: "Déjà remboursé au dirigeant",
				checked: draft.reimbursed,
				onChange: (reimbursed) => patch({ reimbursed })
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Motif",
				hint: "Lieu, personne rencontrée, lien avec le domaine.",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextArea, {
					value: draft.purpose,
					onChange: (event) => patch({ purpose: event.target.value })
				})
			}),
			draft.category === "restaurant" || draft.category === "hotel" && draft.stayFor === "tiers" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Convives ou tiers",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
					value: draft.guests,
					placeholder: "Nom et qualité",
					onChange: (event) => patch({ guests: event.target.value })
				})
			}) : null,
			draft.category === "cadeaux" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Bénéficiaire",
				hint: "Sert à suivre le plafond de 73 € TTC par an.",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
					value: draft.beneficiary,
					onChange: (event) => patch({ beneficiary: event.target.value })
				})
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Commentaire",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
					value: draft.comment,
					onChange: (event) => patch({ comment: event.target.value })
				})
			}),
			duplicate ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-warn",
				children: "Une pièce avec le même jour, le même fournisseur et le même montant existe déjà."
			}) : null,
			errors.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "flex flex-col gap-1",
				children: errors.map((error) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "text-sm text-danger",
					children: error
				}, error))
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiscalCard, { fiscal: live }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-2 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						disabled: busy,
						className: "w-full sm:col-span-3",
						children: busy ? "Patientez…" : submitLabel
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "secondary",
						className: "w-full",
						disabled: busy,
						onClick: () => void output("print"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, {
							className: "size-4",
							"aria-hidden": true
						}), "Imprimer"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "secondary",
						className: "w-full",
						disabled: busy,
						onClick: () => void output("share"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, {
							className: "size-4",
							"aria-hidden": true
						}), "Partager le PDF"]
					}),
					onDelete ? confirmDelete ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "danger",
						className: "w-full",
						onClick: () => {
							onDelete().catch(() => toast.error("Suppression impossible"));
						},
						children: "Confirmer"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "danger",
						className: "w-full",
						onClick: () => setConfirmDelete(true),
						children: "Supprimer"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "hidden sm:block" })
				]
			}),
			zoom ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "fixed inset-0 z-40 bg-bg p-4",
				onClick: () => setZoom(null),
				"aria-label": "Fermer l'aperçu",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: zoom,
					alt: "",
					className: "mx-auto h-full w-full object-contain"
				})
			}) : null
		]
	});
}
function Choice({ label, value, options, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
		className: "mb-2 text-sm font-medium text-muted",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex flex-wrap gap-2",
		children: options.map((option) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
			active: value === option.id,
			onClick: () => onChange(option.id),
			children: option.label
		}, option.id))
	})] });
}
function statusBadges(expense, files) {
	const badges = [];
	if (files === 0) badges.push({
		label: "Sans pièce",
		tone: "warn"
	});
	if (expense.payMethod === "cb_perso" && !expense.reimbursed) badges.push({
		label: "À rembourser",
		tone: "warn"
	});
	if (!expense.professional) badges.push({
		label: "Personnelle",
		tone: "neutral"
	});
	return badges;
}
//#endregion
export { statusBadges as n, ExpenseForm as t };
