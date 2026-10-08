import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  addFiles,
  allBlobs,
  database,
  deleteExpenseCascade,
  deleteFile,
  eraseAll,
  getBlobs,
  importPayload,
  loadState,
  putExpense,
  saveSettings as persistSettings,
} from "./db";
import { buildExamples } from "./seed";
import { dateKey } from "./format";
import { getPeriod, shiftAnchor, type Period, type PeriodMode } from "./periods";
import {
  DEFAULT_SETTINGS,
  draftFromExpense,
  type Expense,
  type ExpenseDraft,
  type FileMeta,
  type LoadedFile,
  type NewFile,
  type Settings,
} from "./types";

type StoreValue = {
  ready: boolean;
  error: string | null;
  expenses: Expense[];
  files: FileMeta[];
  settings: Settings;
  mode: PeriodMode;
  setMode: (mode: PeriodMode) => void;
  anchor: Date | null;
  period: Period | null;
  shiftPeriod: (dir: -1 | 1) => void;
  canGoNext: boolean;
  fileCount: (id: string) => number;
  saveSettings: (settings: Settings) => Promise<void>;
  createExpense: (draft: ExpenseDraft, files: NewFile[]) => Promise<string>;
  updateExpense: (id: string, draft: ExpenseDraft, files: NewFile[], removedIds: string[]) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  clearExamples: () => Promise<void>;
  loadExamples: () => Promise<void>;
  eraseAllData: () => Promise<void>;
  getBlobs: (expenseId: string) => Promise<LoadedFile[]>;
  reload: () => Promise<void>;
};

const Ctx = createContext<StoreValue | null>(null);

function assertDraft(draft: ExpenseDraft): asserts draft is ExpenseDraft & { category: Expense["category"] } {
  if (!draft.category) throw new Error("Choisissez un poste de dépense.");
}

async function bootstrap(): Promise<{ settings: Settings; expenses: Expense[]; files: FileMeta[] }> {
  const state = await loadState();
  if (!state.settings.seeded && state.expenses.length === 0) {
    const seeded = await buildExamples();
    for (const expense of seeded.expenses) await putExpense(expense);
    const metas: FileMeta[] = [];
    for (const item of seeded.files) metas.push(...(await addFiles(item.expenseId, [item.file])));
    const nextSettings = { ...state.settings, seeded: true };
    await persistSettings(nextSettings);
    return {
      settings: nextSettings,
      expenses: seeded.expenses.sort((a, b) => b.date.localeCompare(a.date)),
      files: metas,
    };
  }
  if (!state.settings.seeded) {
    const nextSettings = { ...state.settings, seeded: true };
    await persistSettings(nextSettings);
    return { ...state, settings: nextSettings };
  }
  return state;
}

let bootstrapPromise: ReturnType<typeof bootstrap> | null = null;

function boot(): ReturnType<typeof bootstrap> {
  if (!bootstrapPromise) bootstrapPromise = bootstrap();
  return bootstrapPromise;
}

export function ExpensesProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [files, setFiles] = useState<FileMeta[]>([]);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [mode, setMode] = useState<PeriodMode>("month");
  const [anchor, setAnchor] = useState<Date | null>(null);

  useEffect(() => {
    let cancelled = false;
    boot()
      .then((state) => {
        if (cancelled) return;
        setSettings(state.settings);
        setExpenses(state.expenses);
        setFiles(state.files);
        setAnchor(new Date());
        setReady(true);
      })
      .catch(() => {
        if (cancelled) return;
        setError("Le carnet ne peut pas s'ouvrir sur cet appareil. Réessayez hors navigation privée.");
        setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const period = anchor ? getPeriod(anchor, mode) : null;
  const canGoNext = useMemo(() => {
    if (!anchor) return false;
    const next = getPeriod(shiftAnchor(anchor, mode, 1), mode);
    return next.startKey <= dateKey(new Date());
  }, [anchor, mode]);

  const fileCount = (id: string) => files.filter((file) => file.expenseId === id).length;

  async function saveSettings(next: Settings) {
    const value = { ...next, seeded: true };
    await persistSettings(value);
    setSettings(value);
  }

  async function createExpense(draft: ExpenseDraft, incoming: NewFile[]) {
    assertDraft(draft);
    const now = new Date().toISOString();
    const expense: Expense = {
      ...draft,
      category: draft.category,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
      example: false,
    };
    await putExpense(expense);
    const metas = await addFiles(expense.id, incoming);
    setExpenses((prev) =>
      [expense, ...prev].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt)),
    );
    setFiles((prev) => [...prev, ...metas]);
    return expense.id;
  }

  async function updateExpense(id: string, draft: ExpenseDraft, incoming: NewFile[], removedIds: string[]) {
    assertDraft(draft);
    const prev = expenses.find((expense) => expense.id === id);
    if (!prev) throw new Error("Pièce introuvable.");
    const expense: Expense = {
      ...draft,
      category: draft.category,
      id,
      createdAt: prev.createdAt,
      updatedAt: new Date().toISOString(),
      example: false,
    };
    await putExpense(expense);
    for (const removed of removedIds) await deleteFile(removed);
    const metas = await addFiles(id, incoming);
    setExpenses((list) =>
      list
        .map((item) => (item.id === id ? expense : item))
        .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt)),
    );
    setFiles((list) => [...list.filter((file) => !removedIds.includes(file.id)), ...metas]);
  }

  async function deleteExpense(id: string) {
    const ids = files.filter((file) => file.expenseId === id).map((file) => file.id);
    await deleteExpenseCascade(id, ids);
    setExpenses((list) => list.filter((expense) => expense.id !== id));
    setFiles((list) => list.filter((file) => file.expenseId !== id));
  }

  async function clearExamples() {
    const ids = expenses.filter((expense) => expense.example).map((expense) => expense.id);
    for (const id of ids) {
      const fileIds = files.filter((file) => file.expenseId === id).map((file) => file.id);
      await deleteExpenseCascade(id, fileIds);
    }
    setExpenses((list) => list.filter((expense) => !expense.example));
    setFiles((list) => list.filter((file) => !ids.includes(file.expenseId)));
  }

  async function loadExamples() {
    const seeded = await buildExamples();
    for (const expense of seeded.expenses) await putExpense(expense);
    const metas: FileMeta[] = [];
    for (const item of seeded.files) metas.push(...(await addFiles(item.expenseId, [item.file])));
    setExpenses((prev) =>
      [...seeded.expenses, ...prev].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt)),
    );
    setFiles((prev) => [...prev, ...metas]);
  }

  async function eraseAllData() {
    await eraseAll();
    const fresh = { ...DEFAULT_SETTINGS, seeded: true };
    await persistSettings(fresh);
    setExpenses([]);
    setFiles([]);
    setSettings(fresh);
    bootstrapPromise = null;
  }

  async function reload() {
    await database();
    const state = await loadState();
    setSettings(state.settings);
    setExpenses(state.expenses);
    setFiles(state.files);
  }

  const value: StoreValue = {
    ready,
    error,
    expenses,
    files,
    settings,
    mode,
    setMode,
    anchor,
    period,
    shiftPeriod: (dir) => setAnchor((current) => (current ? shiftAnchor(current, mode, dir) : current)),
    canGoNext,
    fileCount,
    saveSettings,
    createExpense,
    updateExpense,
    deleteExpense,
    clearExamples,
    loadExamples,
    eraseAllData,
    getBlobs: (expenseId) => getBlobs(expenseId, files),
    reload,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useExpenses() {
  const value = useContext(Ctx);
  if (!value) throw new Error("Carnet indisponible");
  return value;
}

export async function loadAllBlobs(metas: FileMeta[]): Promise<LoadedFile[]> {
  return allBlobs(metas);
}

export { draftFromExpense, importPayload };
