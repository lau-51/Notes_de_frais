import { useState } from "react";
import { toast } from "sonner";
import { Button, Field, TextInput, Toggle } from "@/components/ui";
import { InstallSettings } from "@/components/install-card";
import { FUELS, VEHICLES } from "@/lib/expenses/categories";
import { useExpenses } from "@/lib/expenses/store";
import type { FuelKind, VehicleKind } from "@/lib/expenses/types";

export function SettingsDialog({ onClose }: { onClose: () => void }) {
  const { settings, saveSettings, expenses, clearExamples, loadExamples, eraseAllData } = useExpenses();
  const [draft, setDraft] = useState(settings);
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const hasExamples = expenses.some((expense) => expense.example);

  async function save() {
    setBusy(true);
    try {
      await saveSettings(draft);
      toast.success("Réglages enregistrés");
      onClose();
    } catch {
      toast.error("Enregistrement impossible");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-bg/80 sm:items-center" role="presentation">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
        className="max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-surface p-5 sm:rounded-2xl"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 id="settings-title" className="text-xl leading-tight">
              Société
            </h2>
            <p className="mt-1 text-sm text-muted">Ces informations figurent sur les PDF. Elles restent sur cet appareil.</p>
          </div>
          <button type="button" className="press h-11 px-2 text-sm text-muted" onClick={onClose}>
            Fermer
          </button>
        </div>
        <div className="flex flex-col gap-4">
          <Field label="Raison sociale">
            <TextInput
              value={draft.raisonSociale}
              onChange={(event) => setDraft({ ...draft, raisonSociale: event.target.value })}
            />
          </Field>
          <Field label="SIRET">
            <TextInput
              inputMode="numeric"
              value={draft.siret}
              onChange={(event) => setDraft({ ...draft, siret: event.target.value })}
            />
          </Field>
          <Field label="Dirigeant">
            <TextInput
              value={draft.dirigeant}
              onChange={(event) => setDraft({ ...draft, dirigeant: event.target.value })}
            />
          </Field>
          <Field label="Adresse">
            <TextInput value={draft.adresse} onChange={(event) => setDraft({ ...draft, adresse: event.target.value })} />
          </Field>
          <Toggle
            label="La société récupère la TVA"
            checked={draft.assujettiTva}
            onChange={(assujettiTva) => setDraft({ ...draft, assujettiTva })}
          />
          <p className="text-sm text-subtle">
            Décochez en cas de franchise en base : aucune TVA ne sera proposée en récupération.
          </p>
          <fieldset>
            <legend className="mb-2 text-sm font-medium text-muted">Véhicule habituel</legend>
            <div className="flex flex-wrap gap-2">
              {VEHICLES.map((vehicle) => (
                <Pick
                  key={vehicle.id}
                  active={draft.defaultVehicle === vehicle.id}
                  onClick={() => setDraft({ ...draft, defaultVehicle: vehicle.id as VehicleKind })}
                >
                  {vehicle.label}
                </Pick>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="mb-2 text-sm font-medium text-muted">Carburant habituel</legend>
            <div className="flex flex-wrap gap-2">
              {FUELS.map((fuel) => (
                <Pick
                  key={fuel.id}
                  active={draft.defaultFuel === fuel.id}
                  onClick={() => setDraft({ ...draft, defaultFuel: fuel.id as FuelKind })}
                >
                  {fuel.label}
                </Pick>
              ))}
            </div>
          </fieldset>
          <Button className="w-full" disabled={busy} onClick={() => void save()}>
            Enregistrer
          </Button>
          <InstallSettings />
          {hasExamples ? (
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => {
                void clearExamples().then(() => toast.success("Exemples effacés"));
              }}
            >
              Effacer les exemples
            </Button>
          ) : (
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => {
                void loadExamples().then(() => toast.success("Exemples ajoutés"));
              }}
            >
              Charger des exemples
            </Button>
          )}
          <div className="border-t border-border pt-4">
            <p className="text-sm text-muted">Pour vider le carnet de cet appareil, écrivez EFFACER.</p>
            <TextInput className="mt-2" value={confirm} onChange={(event) => setConfirm(event.target.value)} />
            <Button
              variant="danger"
              className="mt-2 w-full"
              disabled={confirm !== "EFFACER" || busy}
              onClick={() => {
                void eraseAllData().then(() => {
                  toast.success("Carnet vidé");
                  onClose();
                });
              }}
            >
              Effacer toutes les données
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Pick({ active, children, onClick }: { active: boolean; children: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? "press h-11 rounded-sm border border-accent bg-accent px-3 text-sm font-medium text-accent-fg"
          : "press h-11 rounded-sm border border-border px-3 text-sm font-medium"
      }
    >
      {children}
    </button>
  );
}
