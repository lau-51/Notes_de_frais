import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import type { Attachment } from "@/components/attachments";
import { ExpenseForm } from "@/components/expense-form";
import { draftFromExpense } from "@/lib/expenses/types";
import { useExpenses } from "@/lib/expenses/store";

export const Route = createFileRoute("/notes_/$id")({ component: NotePage });

function NotePage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const store = useExpenses();
  const expense = store.expenses.find((item) => item.id === id);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [removed, setRemoved] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [tick, setTick] = useState(0);
  const urls = useRef<string[]>([]);

  const getBlobsRef = useRef(store.getBlobs);
  getBlobsRef.current = store.getBlobs;

  useEffect(() => {
    let cancel = false;
    setLoaded(false);
    void getBlobsRef.current(id).then((files) => {
      if (cancel) return;
      const next = files.map((file) => {
        const url = URL.createObjectURL(file.blob);
        urls.current.push(url);
        return {
          key: file.id,
          name: file.name,
          mime: file.mime,
          url,
          blob: file.blob,
          existingId: file.id,
        };
      });
      setAttachments(next);
      setRemoved([]);
      setLoaded(true);
    });
    return () => {
      cancel = true;
      urls.current.forEach((url) => URL.revokeObjectURL(url));
      urls.current = [];
    };
  }, [id, tick]);

  if (!expense) {
    return (
      <div className="flex flex-col gap-3">
        <h1 className="text-2xl leading-tight">Pièce introuvable</h1>
        <Link to="/notes" className="text-sm text-info">
          Retour aux pièces
        </Link>
      </div>
    );
  }

  if (!loaded) return <p className="text-muted">Chargement de la pièce…</p>;

  return (
    <div className="flex flex-col gap-4">
      <header>
        <Link to="/notes" className="text-sm text-muted">
          Pièces
        </Link>
        <h1 className="mt-1 text-2xl leading-tight tracking-tight">{expense.merchant}</h1>
      </header>
      <ExpenseForm
        key={`${expense.id}-${tick}`}
        expenseId={expense.id}
        createdAt={expense.createdAt}
        initial={draftFromExpense(expense)}
        expenses={store.expenses}
        settings={store.settings}
        attachments={attachments}
        submitLabel="Mettre à jour"
        onAdd={(files) => {
          urls.current.push(...files.map((file) => file.url));
          setAttachments((current) => [...current, ...files]);
        }}
        onRemove={(key) => {
          setAttachments((current) => {
            const found = current.find((file) => file.key === key);
            if (found?.existingId) setRemoved((ids) => [...ids, found.existingId!]);
            if (found) URL.revokeObjectURL(found.url);
            return current.filter((file) => file.key !== key);
          });
        }}
        onSubmit={async (draft) => {
          const fresh = attachments
            .filter((file) => !file.existingId)
            .map((file) => ({ name: file.name, mime: file.mime, blob: file.blob }));
          await store.updateExpense(expense.id, draft, fresh, removed);
          toast.success("Pièce mise à jour");
          setTick((value) => value + 1);
        }}
        onDelete={async () => {
          await store.deleteExpense(expense.id);
          toast.success("Pièce supprimée");
          await navigate({ to: "/notes" });
        }}
      />
    </div>
  );
}
