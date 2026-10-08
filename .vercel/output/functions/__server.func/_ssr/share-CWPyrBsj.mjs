import { A as vehicleLabel, D as categoryMeta, O as fuelLabel, d as formatDate, k as payLabel, u as eur } from "./router-Dw1w5zm1.mjs";
import { n as StandardFonts, r as rgb, t as PDFDocument } from "../_libs/pdf-lib.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/share-CWPyrBsj.js
var PAGE_W = 595.28;
var PAGE_H = 841.89;
var MARGIN = 40;
var INK = rgb(.12, .11, .09);
var MUTED = rgb(.38, .35, .31);
var HAIR = rgb(.78, .75, .7);
function pdfSafe(value) {
	return value.replace(/œ/g, "oe").replace(/Œ/g, "OE").replace(/€/g, "EUR").replace(/[’‘]/g, "'").replace(/[“”]/g, "\"").replace(/[—–]/g, "-").replace(/…/g, "...").replace(/[^\u0000-\u00FF]/g, "");
}
function wrap(text, font, size, maxWidth) {
	const words = pdfSafe(text).split(/\s+/).filter(Boolean);
	if (words.length === 0) return [];
	const lines = [];
	let current = "";
	for (const word of words) {
		const next = current ? `${current} ${word}` : word;
		if (font.widthOfTextAtSize(next, size) > maxWidth && current) {
			lines.push(current);
			current = word;
		} else current = next;
	}
	if (current) lines.push(current);
	return lines;
}
function blank(pdf, font, bold) {
	return {
		page: pdf.addPage([PAGE_W, PAGE_H]),
		y: 801.89,
		font,
		bold
	};
}
function ensure(pdf, cursor, need) {
	if (cursor.y >= need) return cursor;
	return blank(pdf, cursor.font, cursor.bold);
}
function drawLines(pdf, cursor, lines, size, color = INK, bold = false) {
	const font = bold ? cursor.bold : cursor.font;
	let c = cursor;
	for (const line of lines) {
		c = ensure(pdf, c, MARGIN + size);
		c.page.drawText(line, {
			x: MARGIN,
			y: c.y - size,
			size,
			font,
			color
		});
		c = {
			...c,
			y: c.y - size - 4
		};
	}
	return c;
}
function paragraph(pdf, cursor, text, size = 10, color = INK) {
	return drawLines(pdf, cursor, wrap(text, cursor.font, size, 515.28), size, color, false);
}
function heading(pdf, cursor, text) {
	return drawLines(pdf, cursor, wrap(text, cursor.bold, 16, 515.28), 16, INK, true);
}
function rule(cursor) {
	const y = cursor.y - 6;
	cursor.page.drawLine({
		start: {
			x: MARGIN,
			y
		},
		end: {
			x: 555.28,
			y
		},
		thickness: .6,
		color: HAIR
	});
	return {
		...cursor,
		y: y - 12
	};
}
function companyBlock(settings) {
	const lines = [settings.raisonSociale.trim() || "Société non renseignée"];
	if (settings.siret.trim()) lines.push(`SIRET ${settings.siret.trim()}`);
	if (settings.dirigeant.trim()) lines.push(settings.dirigeant.trim());
	if (settings.adresse.trim()) lines.push(settings.adresse.trim());
	return lines;
}
function contextLine(expense) {
	const bits = [categoryMeta(expense.category).label, payLabel(expense.payMethod)];
	if (expense.vehicle) bits.push(vehicleLabel(expense.vehicle));
	if (expense.fuel) bits.push(fuelLabel(expense.fuel));
	if (expense.guests.trim()) bits.push(expense.guests.trim());
	if (expense.beneficiary.trim()) bits.push(expense.beneficiary.trim());
	return bits.join(" · ");
}
async function drawImage(pdf, cursor, blob, mime) {
	const bytes = new Uint8Array(await blob.arrayBuffer());
	let image;
	try {
		image = mime === "image/png" ? await pdf.embedPng(bytes) : await pdf.embedJpg(bytes);
	} catch {
		return paragraph(pdf, cursor, "Justificatif illisible.");
	}
	let c = cursor;
	const maxW = 515.28;
	let maxH = c.y - MARGIN - 8;
	if (maxH < 220) {
		c = blank(pdf, c.font, c.bold);
		maxH = c.y - MARGIN;
	}
	const scale = Math.min(maxW / image.width, maxH / image.height);
	const w = image.width * scale;
	const h = image.height * scale;
	const x = (PAGE_W - w) / 2;
	const y = c.y - h;
	c.page.drawImage(image, {
		x,
		y,
		width: w,
		height: h
	});
	return {
		...c,
		y: y - 16
	};
}
async function appendFiles(pdf, cursor, files) {
	let c = cursor;
	for (const file of files) {
		if (file.mime === "application/pdf") {
			try {
				const src = await PDFDocument.load(await file.blob.arrayBuffer(), { ignoreEncryption: true });
				(await pdf.copyPages(src, src.getPageIndices())).forEach((page) => pdf.addPage(page));
				c = blank(pdf, c.font, c.bold);
			} catch {
				c = paragraph(pdf, c, `PDF illisible : ${file.name}`);
			}
			continue;
		}
		c = await drawImage(pdf, c, file.blob, file.mime);
	}
	return c;
}
function numberPages(pdf, font) {
	const pages = pdf.getPages();
	pages.forEach((page, index) => {
		const width = page.getSize().width;
		page.drawText(pdfSafe(`${index + 1} / ${pages.length}`), {
			x: width - MARGIN - 48,
			y: 22,
			size: 9,
			font,
			color: MUTED
		});
	});
}
async function expenseBlock(pdf, cursor, expense, fiscal, files, withFiles) {
	let c = heading(pdf, cursor, expense.merchant || "Justificatif");
	c = paragraph(pdf, c, `${formatDate(expense.date)} · ${contextLine(expense)}`, 10, MUTED);
	c = paragraph(pdf, c, `TTC ${eur(expense.amountTtc)} · HT ${eur(fiscal.ht)} · TVA ${eur(fiscal.vat)} · récupérable ${eur(fiscal.recoverable)} · charge ${eur(fiscal.charge)}`);
	c = paragraph(pdf, c, `Compte ${fiscal.account} ${fiscal.accountLabel}`, 10, MUTED);
	if (expense.purpose.trim()) c = paragraph(pdf, c, expense.purpose.trim());
	c = paragraph(pdf, c, fiscal.title, 10, MUTED);
	if (withFiles && files.length > 0) c = await appendFiles(pdf, c, files);
	return {
		...c,
		y: c.y - 8
	};
}
async function buildExpensePdf(expense, settings, fiscal, files) {
	const pdf = await PDFDocument.create();
	const font = await pdf.embedFont(StandardFonts.Helvetica);
	let c = blank(pdf, font, await pdf.embedFont(StandardFonts.HelveticaBold));
	c = drawLines(pdf, c, companyBlock(settings).map((line) => pdfSafe(line)), 10, MUTED);
	c = rule(c);
	c = await expenseBlock(pdf, c, expense, fiscal, files, true);
	c = paragraph(pdf, c, "Aide indicative. À faire valider par l'expert-comptable avant de passer l'écriture.", 9, MUTED);
	numberPages(pdf, font);
	return pdf.save();
}
async function buildPeriodPdf(options) {
	const pdf = await PDFDocument.create();
	const font = await pdf.embedFont(StandardFonts.Helvetica);
	let c = blank(pdf, font, await pdf.embedFont(StandardFonts.HelveticaBold));
	c = drawLines(pdf, c, companyBlock(options.settings).map((line) => pdfSafe(line)), 10, MUTED);
	c = heading(pdf, {
		...c,
		y: c.y - 8
	}, "Récapitulatif des notes de frais");
	c = paragraph(pdf, c, options.periodLabel, 12);
	c = paragraph(pdf, c, `${options.rows.length} pièce${options.rows.length > 1 ? "s" : ""} · TTC ${eur(options.totals.paidTtc)} · charge ${eur(options.totals.charge)} · TVA récupérable ${eur(options.totals.recoverable)}`);
	c = rule(c);
	if (options.rows.length === 0) c = paragraph(pdf, c, "Aucune pièce sur cette période.");
	for (const row of options.rows) {
		c = ensure(pdf, c, 120);
		c = await expenseBlock(pdf, c, row.expense, row.fiscal, row.files, options.includeFiles);
		c = rule(c);
	}
	c = paragraph(pdf, c, "Les comptes sont suggérés. La récupération de TVA dépend de la facture, du bénéficiaire et de l'intérêt de la société. Document interne, non certifié.", 9, MUTED);
	numberPages(pdf, font);
	return pdf.save();
}
function downloadBlob(blob, filename) {
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = filename;
	link.click();
	window.setTimeout(() => URL.revokeObjectURL(url), 4e3);
}
async function shareBlob(blob, filename, mime) {
	const file = new File([blob], filename, { type: mime });
	const nav = navigator;
	if (nav.share && nav.canShare?.({ files: [file] })) {
		await nav.share({
			files: [file],
			title: filename
		});
		return "shared";
	}
	downloadBlob(blob, filename);
	return "downloaded";
}
function printBlob(blob) {
	const url = URL.createObjectURL(blob);
	const iframe = document.createElement("iframe");
	iframe.title = "Impression";
	iframe.style.cssText = "position:fixed;right:0;bottom:0;width:0;height:0;border:0";
	iframe.src = url;
	iframe.onload = () => {
		try {
			iframe.contentWindow?.focus();
			iframe.contentWindow?.print();
		} catch {
			window.open(url, "_blank", "noopener");
		}
	};
	document.body.appendChild(iframe);
	window.setTimeout(() => {
		iframe.remove();
		URL.revokeObjectURL(url);
	}, 6e4);
}
function canPickDirectory() {
	return typeof window !== "undefined" && "showDirectoryPicker" in window;
}
async function saveToDirectory(blob, filename) {
	const picker = window.showDirectoryPicker;
	if (!picker) throw new Error("Ce navigateur ne permet pas de choisir un dossier. Téléchargez le ZIP ou utilisez Partager.");
	const writable = await (await (await picker()).getFileHandle(filename, { create: true })).createWritable();
	await writable.write(blob);
	await writable.close();
}
function isAbortError(error) {
	return error instanceof DOMException && error.name === "AbortError";
}
//#endregion
export { isAbortError as a, shareBlob as c, downloadBlob as i, buildPeriodPdf as n, printBlob as o, canPickDirectory as r, saveToDirectory as s, buildExpensePdf as t };
