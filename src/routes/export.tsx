import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Download, FolderOutput, Printer, Share2 } from "lucide-react";
import { toast } from "sonner";
import { PeriodBar } from "@/components/period-bar";
import { Button } from "@/components/ui";
import { importPayload } from "@/lib/expenses/db";
import { buildBackupZip, buildDossierZip, buildSummaryPdf, dossierName, readBackup } from "@/lib/expenses/export-pack";
import { summarize } from "@/lib/expenses/fiscal";
import { inPeriod } from "@/lib/expenses/periods";
import { canPickDirectory, downloadBlob, isAbortError, printBlob, saveToDirectory, shareBlob } from "@/lib/expenses/share";
import { loadAllBlobs, useExpenses } from "@/lib/expenses/store";

export const Route = createFileRoute("/export")({ component: ExportPage });

function ExportPage() {
  const store = useExpenses();
  const [busy, setBusy] = useState<string | null>(null);
  const rows = useMemo(() => {
    if (!store.period) return [];
    return store.expenses.filter((expense) => inPeriod(expense.date, store.period!));
  }, [store.expenses, store.period]);
  const summary = useMemo(
    () => summarize(rows, store.expenses, store.fileCount, store.settings.assujettiTva),
    [rows, store.expenses, store.fileCount, store.settings.assujettiTva],
  );

  async function run(key: string, action: () => Promise<void>) {
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

  return (
    <div className="flex flex-col gap-5">
      <header>
        <h1 className="text-2xl leading-tight tracking-tight">Export</h1>
        <p className="mt-1 text-sm text-muted">
          {rows.length} pièce{rows.length > 1 ? "s" : ""} sur la période. Le dossier contient le récapitulatif PDF, chaque justificatif et un CSV pour la comptabilité.
        </p>
      </header>
      <PeriodBar />
      <div className="grid gap-2">
        <Button
          className="w-full"
          disabled={busy != null || rows.length === 0}
          onClick={() =>
            void run("zip", async () => {
              const blob = await buildDossierZip({
                settings: store.settings,
                period,
                expenses: rows,
                all: store.expenses,
                summary,
                loadFiles: store.getBlobs,
              });
              downloadBlob(blob, name);
              toast.success("Dossier téléchargé");
            })
          }
        >
          <Download className="size-4" aria-hidden />
          {busy === "zip" ? "Préparation…" : "Télécharger le ZIP"}
        </Button>
        <Button
          variant="secondary"
          className="w-full"
          disabled={busy != null || rows.length === 0}
          onClick={() =>
            void run("share", async () => {
              const blob = await buildDossierZip({
                settings: store.settings,
                period,
                expenses: rows,
                all: store.expenses,
                summary,
                loadFiles: store.getBlobs,
              });
              const result = await shareBlob(blob, name, "application/zip");
              if (result === "shared") toast.success("Dossier partagé");
              else toast.success("Partage indisponible : dossier téléchargé");
            })
          }
        >
          <Share2 className="size-4" aria-hidden />
          Partager
        </Button>
        <Button
          variant="secondary"
          className="w-full"
          disabled={busy != null || rows.length === 0}
          onClick={() =>
            void run("print", async () => {
              const blob = await buildSummaryPdf({
                settings: store.settings,
                period,
                expenses: rows,
                all: store.expenses,
                summary,
                loadFiles: store.getBlobs,
                includeFiles: true,
              });
              printBlob(blob);
            })
          }
        >
          <Printer className="size-4" aria-hidden />
          Imprimer récapitulatif et pièces
        </Button>
        <Button
          variant="secondary"
          className="w-full"
          disabled={busy != null || rows.length === 0 || !canPickDirectory()}
          onClick={() =>
            void run("dir", async () => {
              const blob = await buildDossierZip({
                settings: store.settings,
                period,
                expenses: rows,
                all: store.expenses,
                summary,
                loadFiles: store.getBlobs,
              });
              await saveToDirectory(blob, name);
              toast.success("Dossier enregistré");
            })
          }
        >
          <FolderOutput className="size-4" aria-hidden />
          Enregistrer dans un dossier
        </Button>
      </div>
      <section className="flex flex-col gap-2 text-sm text-muted">
        <h2 className="text-lg leading-tight text-fg">Où envoyer les pièces</h2>
        <p>
          Google Drive, Gmail ou une autre application : touchez Partager. Sur téléphone, le menu du système propose ces destinations.
        </p>
        <p>
          Serveur TSE : téléchargez le ZIP, ouvrez votre session bureau à distance, puis déposez le fichier dans le lecteur réseau ou le dossier partagé. Le navigateur ne peut pas ouvrir une session TSE.
        </p>
        <p>
          Sur ordinateur, Enregistrer dans un dossier permet de viser un lecteur déjà monté, y compris un dossier synchronisé.
        </p>
      </section>
      <section className="flex flex-col gap-2 border-t border-border pt-4">
        <h2 className="text-lg leading-tight">Sauvegarde de l'appareil</h2>
        <p className="text-sm text-muted">
          Emportez tout le carnet (pièces et réglages) vers un autre téléphone, puis restaurez-le.
        </p>
        <Button
          variant="secondary"
          className="w-full"
          disabled={busy != null}
          onClick={() =>
            void run("backup", async () => {
              const files = await loadAllBlobs(store.files);
              const blob = await buildBackupZip(store.settings, store.expenses, files);
              downloadBlob(blob, "sauvegarde-frais-de-domaine.zip");
              toast.success("Sauvegarde téléchargée");
            })
          }
        >
          Télécharger la sauvegarde
        </Button>
        <label className="press inline-flex h-11 cursor-pointer items-center justify-center rounded-sm border border-border bg-surface-2 px-4 text-sm font-medium">
          Restaurer une sauvegarde
          <input
            type="file"
            accept="application/zip,.zip"
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              if (!file) return;
              void run("import", async () => {
                const backup = await readBackup(file);
                await importPayload(backup.payload, backup.blobs);
                await store.reload();
                toast.success("Sauvegarde restaurée");
              });
            }}
          />
        </label>
      </section>
    </div>
  );
}
