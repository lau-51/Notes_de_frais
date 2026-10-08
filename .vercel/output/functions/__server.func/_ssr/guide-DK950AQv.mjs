import { Y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/guide-DK950AQv.js
var import_jsx_runtime = require_jsx_runtime();
var SECTIONS = [
	{
		title: "Trois conditions pour une charge",
		body: [
			"La dépense est engagée dans l'intérêt de la société, elle correspond à une charge réelle, et elle est appuyée d'un justificatif. Elle se rattache à l'exercice.",
			"Un ticket de carte bancaire prouve le paiement. Il ne remplace pas toujours une facture, surtout pour récupérer la TVA.",
			"Les pièces comptables se conservent dix ans."
		]
	},
	{
		title: "Hôtel",
		body: [
			"Nuitée d'un dirigeant ou d'un salarié : la TVA n'est pas récupérable, même en déplacement entièrement professionnel. Le montant TTC peut rester une charge (compte suggéré 625100).",
			"Nuitée d'un client ou d'un fournisseur : TVA récupérable si la facture est au nom de la société et nomme le bénéficiaire.",
			"Petit-déjeuner : récupérable seulement s'il est facturé à part de la nuitée. Taux usuel 10 %.",
			"L'hébergement de vendangeurs ne se traite pas comme une simple note d'hôtel : voyez votre expert-comptable pour le volet social."
		]
	},
	{
		title: "Restaurant",
		body: [
			"La TVA est en principe récupérable : 10 % sur la nourriture, 20 % sur l'alcool. Ventilez la note si les deux figurent ensemble.",
			"Repas avec un tiers : notez les noms et qualités. Compte suggéré 625700 Réceptions.",
			"Repas seul en déplacement : la charge n'est solide que si la mission empêchait de rentrer. Une part peut être regardée comme personnelle. Compte suggéré 625600 Missions.",
			"Au-delà de 150 € HT, il faut une facture nominative au nom de la société pour la TVA."
		]
	},
	{
		title: "Carburant, péage, entretien",
		body: [
			"Essence, gazole et superéthanol E85 : 80 % de la TVA sur un véhicule de tourisme, 100 % sur un utilitaire. La part non récupérée reste dans la charge.",
			"Électricité, GPL et GNV : 100 % en pratique. Un GPL strictement gazeux sur un tourisme peut être limité à 50 %.",
			"La catégorie figure sur la carte grise (VP ou VU), pas sur l'usage que vous en faites.",
			"Péage : TVA en principe récupérable à 20 %. Le relevé mensuel du badge est souvent plus propre que le ticket isolé.",
			"Parking : seulement si le justificatif mentionne de la TVA. Sinon, taux 0 %.",
			"Entretien, réparation et location d'un véhicule de tourisme : TVA non récupérable. Ce plafond n'est pas celui de l'amortissement du véhicule, qui se traite à part."
		]
	},
	{
		title: "Train, avion, taxi",
		body: ["La TVA n'est récupérable qu'avec une facture au nom de la société. Un billet au seul nom du dirigeant ne suffit souvent pas.", "Compte suggéré 625100."]
	},
	{
		title: "Cadeaux, salons, bouteilles",
		body: [
			"Cadeau client : charge déductible s'il sert l'exploitation et n'est pas excessif. TVA récupérable seulement si le cumul par bénéficiaire ne dépasse pas 73 € TTC sur l'année civile, port compris.",
			"Salon, badge, dégustation professionnelle : compte suggéré 623300.",
			"Une bouteille de la maison offerte à un client n'est pas un ticket de caisse : c'est une sortie de stock, avec la règle des cadeaux. À voir avec votre comptable."
		]
	},
	{
		title: "Qui a payé",
		body: [
			"CB ou virement de la société : crédit 512 Banque.",
			"CB personnelle du dirigeant : la charge est bien celle de la société, mais le crédit est le compte courant d'associé 455, jusqu'au remboursement.",
			"Espèces sorties de la caisse société : crédit 530.",
			"Une dépense personnelle payée par la société ne doit pas rester en charge : elle se porte au 455."
		]
	},
	{
		title: "Ce que ce carnet ne remplace pas",
		body: [
			"Il ne lit pas le montant tout seul : vous le saisissez, la photo sert de preuve.",
			"Il ne dépose pas le fichier directement dans Google Drive ni sur le serveur TSE. Le partage du téléphone ou le ZIP téléchargé font le lien.",
			"Il ne constitue pas une liasse fiscale. Faites valider les écritures avant de les passer."
		]
	}
];
function GuidePage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl leading-tight tracking-tight",
				children: "Repères fiscaux"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: "Règles usuelles 2026 pour une SARL assujettie qui exploite des vignes et vend du champagne. Ce n'est pas une consultation."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-xl border border-border bg-surface p-4 text-sm text-muted",
				children: "Chaque pièce du carnet applique ces repères selon le poste, le véhicule, le bénéficiaire et le nom porté sur la facture. En cas de doute, la pièce est marquée à vérifier."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: SECTIONS.map((section) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
				className: "border-b border-border py-1",
				open: section.title.startsWith("Trois"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
					className: "flex min-h-11 cursor-pointer list-none items-center text-base font-medium",
					children: section.title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-col gap-2 pb-3",
					children: section.body.map((paragraph) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: paragraph
					}, paragraph))
				})]
			}, section.title)) })
		]
	});
}
//#endregion
export { GuidePage as component };
