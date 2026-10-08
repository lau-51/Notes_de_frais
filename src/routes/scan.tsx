import { useEffect, useRef, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import type { Attachment } from "@/components/attachments";
import { ExpenseForm } from "@/components/expense-form";
import { todayIso } from "@/lib/expenses/format";
import { useExpenses } from "@/lib/expenses/store";
import { emptyDraft } from "@/lib/expenses/types";

export const Route = createFileRoute("/scan")({ component: ScanPage });

function ScanPage() {
  const navigate = useNavigate();
  const { expenses, settings, createExpense } = useExpenses();
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const urls = useRef<string[]>([]);

  useEffect(() => {
    return () => urls.current.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <header>
        <h1 className="text-2xl leading-tight tracking-tight">Nouvelle pièce</h1>
        <p className="mt-1 text-sm text-muted">
          Photographiez le ticket ou importez un PDF. Le document est converti et conservé sur cet appareil.
        </p>
      </header>
      <ExpenseForm
        initial={emptyDraft(todayIso())}
        expenses={expenses}
        settings={settings}
        attachments={attachments}
        submitLabel="Enregistrer la pièce"
        autoFocusAmount
        onAdd={(files) => {
          urls.current.push(...files.map((file) => file.url));
          setAttachments((current) => [...current, ...files]);
        }}
        onRemove={(key) => {
          setAttachments((current) => {
            const found = current.find((file) => file.key === key);
            if (found) URL.revokeObjectURL(found.url);
            return current.filter((file) => file.key !== key);
          });
        }}
        onSubmit={async (draft) => {
          const id = await createExpense(
            draft,
            attachments.map((file) => ({ name: file.name, mime: file.mime, blob: file.blob })),
          );
          toast.success("Pièce enregistrée");
          await navigate({ to: "/notes/$id", params: { id } });
        }}
      />
    </div>
  );
}
