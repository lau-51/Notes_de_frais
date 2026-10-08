import { Smartphone } from "lucide-react";
import { Button } from "@/components/ui";
import { dismissInstall, promptInstall, useInstallState } from "@/lib/pwa";

export function InstallCard() {
  const { promptReady, installed, standalone, dismissed } = useInstallState();
  if (installed || standalone || dismissed) return null;

  return (
    <section className="no-print rounded-xl border border-border bg-surface p-4">
      <div className="flex items-start gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-sm border border-border">
          <Smartphone className="size-5" aria-hidden />
        </span>
        <div className="min-w-0">
          <h2 className="text-lg leading-tight">Installer sur Android</h2>
          <p className="mt-1 text-sm text-muted">
            Sans Play Store. L'icône ouvre le carnet en plein écran, et les pièces restent sur le téléphone, même hors ligne.
          </p>
        </div>
      </div>
      {promptReady ? (
        <Button className="mt-3 w-full" onClick={() => void promptInstall()}>
          Installer
        </Button>
      ) : (
        <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-muted">
          <li>Publiez l'application, puis ouvrez son lien dans Chrome.</li>
          <li>Touchez le menu en haut à droite, puis « Installer l'application ».</li>
          <li>Validez. L'icône rejoint vos autres applications.</li>
        </ol>
      )}
      <p className="mt-3 text-sm text-subtle">
        L'aperçu et l'application installée sont deux carnets distincts. Saisissez vos pièces depuis l'icône du téléphone.
      </p>
      <button type="button" className="press mt-2 h-11 text-sm text-muted" onClick={dismissInstall}>
        Plus tard
      </button>
    </section>
  );
}

export function InstallSettings() {
  const { promptReady, installed, standalone } = useInstallState();
  if (installed || standalone) {
    return <p className="text-sm text-muted">Application installée sur ce téléphone. Le carnet reste sur l'appareil.</p>;
  }

  return (
    <div className="border-t border-border pt-4">
      <h3 className="text-lg leading-tight">Installer sur Android</h3>
      <p className="mt-1 text-sm text-muted">
        Ouvrez le lien publié dans Chrome, menu, « Installer l'application ». Aucun fichier à télécharger.
      </p>
      {promptReady ? (
        <Button variant="secondary" className="mt-3 w-full" onClick={() => void promptInstall()}>
          Installer
        </Button>
      ) : null}
    </div>
  );
}
