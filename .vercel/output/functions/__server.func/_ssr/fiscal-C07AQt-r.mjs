import { E as fuelLabel, L as vehicleLabel, _ as categoryMeta } from "./store-BWE3fr9t.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/fiscal-C07AQt-r.js
function splitTtc(ttcCents, ratePercent) {
	if (ratePercent <= 0 || ttcCents <= 0) return {
		ht: Math.max(0, ttcCents),
		vat: 0
	};
	const rate10 = Math.round(ratePercent * 10);
	const base10 = 1e3 + rate10;
	const vat = Math.round(ttcCents * rate10 / base10);
	return {
		ht: ttcCents - vat,
		vat
	};
}
function moneyParts(expense) {
	const alcohol = Math.min(Math.max(0, expense.alcoholTtc ?? 0), Math.max(0, expense.amountTtc));
	if (alcohol > 0 && alcohol < expense.amountTtc) {
		const food = splitTtc(expense.amountTtc - alcohol, expense.vatRate);
		const alc = splitTtc(alcohol, 20);
		return {
			ht: food.ht + alc.ht,
			vat: food.vat + alc.vat
		};
	}
	if (alcohol > 0 && alcohol === expense.amountTtc) return splitTtc(expense.amountTtc, 20);
	return splitTtc(expense.amountTtc, expense.vatRate);
}
function fuelRecoveryBp(fuel, vehicle) {
	if (fuel === "electricite" || fuel === "gpl" || fuel === "gnv") return 1e4;
	return vehicle === "vu" ? 1e4 : 8e3;
}
function peerGifts(expense, all) {
	const name = expense.beneficiary.trim().toLowerCase();
	if (!name || expense.category !== "cadeaux") return 0;
	const year = expense.date.slice(0, 4);
	return all.reduce((sum, other) => {
		if (other.id === expense.id) return sum;
		if (!other.professional || other.category !== "cadeaux") return sum;
		if (other.date.slice(0, 4) !== year) return sum;
		if (other.beneficiary.trim().toLowerCase() !== name) return sum;
		return sum + other.amountTtc;
	}, 0);
}
function accounts(expense) {
	if (expense.category === "restaurant" && expense.mealKind !== "affaires") return {
		account: "625600",
		accountLabel: "Missions"
	};
	const meta = categoryMeta(expense.category);
	return {
		account: meta.account,
		accountLabel: meta.accountLabel
	};
}
function creditAccount(expense) {
	if (expense.payMethod === "cb_perso") return {
		account: "455000",
		label: "Compte courant d'associé"
	};
	if (expense.payMethod === "especes") return {
		account: "530000",
		label: "Caisse"
	};
	return {
		account: "512000",
		label: "Banque"
	};
}
function verdictOf(professional, recoverable, vat, warnings) {
	if (!professional) return "personal";
	if (warnings.length > 0) return "check";
	if (recoverable <= 0) return "no_vat";
	if (recoverable < vat) return "partial";
	return "ok";
}
function titleOf(verdict) {
	switch (verdict) {
		case "ok": return "Charge déductible, TVA récupérable";
		case "partial": return "Charge déductible, TVA en partie récupérable";
		case "no_vat": return "Charge déductible, TVA non récupérable";
		case "personal": return "Dépense personnelle, hors charges";
		default: return "À vérifier avant l'écriture";
	}
}
function analyzeExpense(expense, ctx) {
	const parts = moneyParts(expense);
	const details = [];
	const warnings = [];
	const book = accounts(expense);
	let ratioBp = 1e4;
	if (!expense.professional) {
		const lines = [];
		if (expense.payMethod === "cb_societe" || expense.payMethod === "virement" || expense.payMethod === "especes") {
			lines.push({
				side: "debit",
				account: "455000",
				label: "Compte courant d'associé",
				amount: expense.amountTtc
			});
			lines.push({
				side: "credit",
				account: expense.payMethod === "especes" ? "530000" : "512000",
				label: expense.payMethod === "especes" ? "Caisse" : "Banque",
				amount: expense.amountTtc
			});
		}
		return {
			ht: parts.ht,
			vat: parts.vat,
			recoverable: 0,
			charge: 0,
			ratioBp: 0,
			account: "455000",
			accountLabel: "Compte courant d'associé",
			verdict: "personal",
			title: titleOf("personal"),
			details: [expense.payMethod === "cb_perso" ? "Payée personnellement et sans caractère professionnel : elle ne passe pas dans la société." : "Si la société a payé une dépense personnelle, elle se loge au compte courant d'associé, pas en charge."],
			warnings: [],
			lines
		};
	}
	switch (expense.category) {
		case "hotel":
			if (expense.stayFor === "tiers") {
				ratioBp = 1e4;
				details.push("Nuitée d'un tiers (client, fournisseur) : la TVA est récupérable si la facture est au nom de la société et identifie le bénéficiaire.");
				if (!expense.guests.trim()) warnings.push("Indiquez le nom et la qualité du tiers hébergé.");
			} else {
				ratioBp = 0;
				details.push("Nuitée d'un dirigeant ou d'un salarié : la TVA n'est pas récupérable, même si le déplacement est entièrement professionnel. La dépense TTC reste une charge si elle est dans l'intérêt de la société.");
			}
			details.push("Un petit-déjeuner sur la même ligne que la nuitée ne se récupère pas. Demandez deux lignes : seule la restauration ouvre droit à déduction.");
			break;
		case "restaurant":
			ratioBp = 1e4;
			if (expense.mealKind === "deplacement") {
				details.push("Repas pris en déplacement : TVA en principe récupérable (10 % sur la nourriture, 20 % sur l'alcool) si la facture est conforme.");
				warnings.push("Repas seul : la charge n'est solide que si la mission empêchait de rentrer. Notez le lieu et le motif. Une part peut être vue comme personnelle.");
			} else if (expense.mealKind === "petit_dejeuner") details.push("Petit-déjeuner distinct de la nuitée : TVA récupérable, en principe au taux de 10 %.");
			else {
				details.push("Repas d'affaires : TVA récupérable si le repas sert l'intérêt de la société et si les convives sont identifiés.");
				if (!expense.guests.trim()) warnings.push("Notez les noms et la qualité des convives, sinon le caractère professionnel est fragile.");
			}
			if ((expense.alcoholTtc ?? 0) <= 0) details.push("Si la note mélange nourriture (10 %) et alcool (20 %), ventilez le montant d'alcool.");
			break;
		case "carburant":
			if (!expense.vehicle || !expense.fuel) {
				ratioBp = 0;
				warnings.push("Précisez le carburant et si le véhicule est un tourisme (VP) ou un utilitaire (VU).");
				details.push("Sans cette précision, aucune TVA n'est proposée en récupération.");
			} else {
				ratioBp = fuelRecoveryBp(expense.fuel, expense.vehicle);
				const pct = ratioBp / 100;
				details.push(`${fuelLabel(expense.fuel)} · ${vehicleLabel(expense.vehicle)} : ${pct} % de la TVA est récupérable. Essence, gazole et E85 : 80 % sur un VP, 100 % sur un VU. Électricité, GPL et GNV : 100 %. Un GPL strictement gazeux sur VP peut être limité à 50 %.`);
			}
			break;
		case "peage":
			details.push("Péage professionnel : TVA en principe récupérable au taux de 20 % sur le relevé du badge ou le justificatif.");
			break;
		case "parking":
			details.push("Parking : TVA récupérable seulement si le ticket mentionne de la TVA. Un horodateur sans TVA se saisit à 0 %.");
			if (expense.vatRate === 0) details.push("Taux 0 % : rien à récupérer, la charge est égale au montant payé.");
			break;
		case "transport":
			details.push("Train, avion, taxi ou VTC : TVA récupérable seulement avec une facture au nom de la société. Un billet au seul nom du dirigeant ne suffit souvent pas.");
			break;
		case "fournitures":
			details.push("Fournitures utilisées pour l'exploitation : charge déductible, TVA récupérable sur facture.");
			break;
		case "salon":
			details.push("Salon, badge, dégustation professionnelle : compte 623300. Les bouteilles offertes se traitent en cadeau ou en sortie de stock, pas ici.");
			break;
		case "cadeaux": {
			const cumulative = ctx.peerGiftsTtc + expense.amountTtc;
			if (!expense.beneficiary.trim()) warnings.push("Indiquez le bénéficiaire pour suivre le plafond de 73 € TTC par personne et par an.");
			if (cumulative > 7300) {
				ratioBp = 0;
				details.push("Le cumul dépasse 73 € TTC pour ce bénéficiaire sur l'année civile : la TVA des cadeaux qui lui sont faits n'est pas récupérable. La charge peut rester déductible si le cadeau sert l'exploitation.");
			} else details.push("Sous 73 € TTC par bénéficiaire et par an (frais d'envoi compris) : TVA récupérable. Au-delà, la charge reste possible mais sans TVA.");
			break;
		}
		case "telecom":
			details.push("Téléphone et internet professionnels : TVA récupérable. Sur une ligne mixte, seule la quote-part professionnelle est une charge.");
			break;
		case "entretien":
			if (!expense.vehicle) {
				ratioBp = 0;
				warnings.push("Précisez s'il s'agit d'un véhicule de tourisme ou d'un utilitaire.");
			} else if (expense.vehicle === "vp") {
				ratioBp = 0;
				details.push("Entretien, réparation ou location d'un véhicule de tourisme : TVA non récupérable. La charge TTC est déductible. Le plafond d'amortissement du véhicule se traite à part, hors note de frais.");
			} else details.push("Entretien d'un utilitaire : TVA récupérable, charge déductible.");
			break;
		case "formation":
			details.push("Formation liée à l'activité du domaine : charge déductible, TVA en principe récupérable sur facture.");
			break;
		case "divers":
			warnings.push("Poste fourre-tout : reclassez la pièce dès qu'un poste plus précis convient.");
			details.push("Conservez le motif. Ce compte suggéré est le 628000.");
			break;
		default: expense.category;
	}
	if (expense.vatRate === 0 && expense.category !== "cadeaux") details.push("Taux de TVA à 0 % : rien n'est récupérable. À utiliser quand le justificatif ne mentionne pas de TVA.");
	if (!ctx.assujettiTva) {
		if (ratioBp > 0) details.unshift("Société en franchise en base ou non assujettie : aucune TVA n'est récupérable. La charge professionnelle est égale au TTC.");
		ratioBp = 0;
	} else if (!expense.invoiceToCompany && ratioBp > 0) {
		warnings.push("Justificatif non établi au nom de la société : la TVA n'est pas récupérable. Demandez une facture, sinon la charge reste au TTC.");
		ratioBp = 0;
	} else if (parts.ht > 15e3 && ratioBp > 0) warnings.push("Au-delà de 150 € HT, il faut une facture nominative au nom de la société pour récupérer la TVA.");
	if (expense.payMethod === "cb_perso" && !expense.reimbursed) warnings.push("Payé personnellement : à rembourser via le compte courant 455. Cochez « Remboursé » une fois le virement fait.");
	if (!expense.purpose.trim()) warnings.push("Précisez le motif professionnel : il conditionne la déductibilité de la charge.");
	const recoverable = Math.round(parts.vat * ratioBp / 1e4);
	const charge = Math.max(0, expense.amountTtc - recoverable);
	const verdict = verdictOf(true, recoverable, parts.vat, warnings);
	const credit = creditAccount(expense);
	const lines = [];
	if (charge > 0) lines.push({
		side: "debit",
		account: book.account,
		label: book.accountLabel,
		amount: charge
	});
	if (recoverable > 0) lines.push({
		side: "debit",
		account: "445660",
		label: "TVA déductible sur autres biens et services",
		amount: recoverable
	});
	if (expense.amountTtc > 0) lines.push({
		side: "credit",
		account: credit.account,
		label: credit.label,
		amount: expense.amountTtc
	});
	return {
		ht: parts.ht,
		vat: parts.vat,
		recoverable,
		charge,
		ratioBp,
		account: book.account,
		accountLabel: book.accountLabel,
		verdict,
		title: titleOf(verdict),
		details,
		warnings,
		lines
	};
}
function fiscalOf(expense, all, assujettiTva) {
	return analyzeExpense(expense, {
		assujettiTva,
		peerGiftsTtc: peerGifts(expense, all)
	});
}
function summarize(periodExpenses, all, fileCounts, assujettiTva) {
	let paidTtc = 0;
	let charge = 0;
	let recoverable = 0;
	let personalTtc = 0;
	const buckets = /* @__PURE__ */ new Map();
	const flags = [];
	for (const expense of periodExpenses) {
		const fiscal = fiscalOf(expense, all, assujettiTva);
		if (!expense.professional) personalTtc += expense.amountTtc;
		else {
			paidTtc += expense.amountTtc;
			charge += fiscal.charge;
			recoverable += fiscal.recoverable;
			const prev = buckets.get(expense.category) ?? {
				ttc: 0,
				charge: 0,
				recoverable: 0
			};
			prev.ttc += expense.amountTtc;
			prev.charge += fiscal.charge;
			prev.recoverable += fiscal.recoverable;
			buckets.set(expense.category, prev);
		}
		if (fileCounts(expense.id) === 0) flags.push({
			id: expense.id,
			merchant: expense.merchant || "Sans nom",
			text: "Justificatif manquant."
		});
		else if (fiscal.warnings[0]) flags.push({
			id: expense.id,
			merchant: expense.merchant || "Sans nom",
			text: fiscal.warnings[0]
		});
	}
	const byCategory = [...buckets.entries()].map(([id, amounts]) => ({
		id,
		label: categoryMeta(id).short,
		...amounts
	})).sort((a, b) => b.ttc - a.ttc);
	return {
		paidTtc,
		charge,
		recoverable,
		personalTtc,
		count: periodExpenses.length,
		byCategory,
		flags: flags.slice(0, 8)
	};
}
//#endregion
export { summarize as i, fiscalOf as n, peerGifts as r, analyzeExpense as t };
