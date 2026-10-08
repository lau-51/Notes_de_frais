import { DEFAULT_SETTINGS, type Expense, type FileMeta, type LoadedFile, type NewFile, type Settings } from "./types";

const DB_NAME = "frais-domaine";
const DB_VERSION = 1;

let dbPromise: Promise<IDBDatabase> | null = null;

function request<T>(req: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error("IndexedDB"));
  });
}

function txDone(tx: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error("Transaction"));
    tx.onabort = () => reject(tx.error ?? new Error("Transaction annulée"));
  });
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains("expenses")) db.createObjectStore("expenses", { keyPath: "id" });
      if (!db.objectStoreNames.contains("files")) {
        const files = db.createObjectStore("files", { keyPath: "id" });
        files.createIndex("byExpense", "expenseId", { unique: false });
      }
      if (!db.objectStoreNames.contains("blobs")) db.createObjectStore("blobs");
      if (!db.objectStoreNames.contains("meta")) db.createObjectStore("meta");
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error("Ouverture impossible"));
  });
}

export function database(): Promise<IDBDatabase> {
  if (!dbPromise) dbPromise = openDb();
  return dbPromise;
}

function sortExpenses(expenses: Expense[]): Expense[] {
  return [...expenses].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt));
}

export async function loadState(): Promise<{ settings: Settings; expenses: Expense[]; files: FileMeta[] }> {
  const db = await database();
  const tx = db.transaction(["expenses", "files", "meta"], "readonly");
  const settingsRaw = await request(tx.objectStore("meta").get("settings"));
  const expenses = await request(tx.objectStore("expenses").getAll());
  const files = await request(tx.objectStore("files").getAll());
  await txDone(tx);
  const settings = { ...DEFAULT_SETTINGS, ...(settingsRaw as Settings | undefined) };
  return {
    settings,
    expenses: sortExpenses(expenses as Expense[]),
    files: files as FileMeta[],
  };
}

export async function saveSettings(settings: Settings): Promise<void> {
  const db = await database();
  const tx = db.transaction("meta", "readwrite");
  tx.objectStore("meta").put(settings, "settings");
  await txDone(tx);
}

export async function putExpense(expense: Expense): Promise<void> {
  const db = await database();
  const tx = db.transaction("expenses", "readwrite");
  tx.objectStore("expenses").put(expense);
  await txDone(tx);
}

export async function addFiles(expenseId: string, files: NewFile[]): Promise<FileMeta[]> {
  if (files.length === 0) return [];
  const db = await database();
  const tx = db.transaction(["files", "blobs"], "readwrite");
  const metas: FileMeta[] = [];
  for (const file of files) {
    const meta: FileMeta = {
      id: crypto.randomUUID(),
      expenseId,
      name: file.name,
      mime: file.mime,
      createdAt: new Date().toISOString(),
    };
    tx.objectStore("files").put(meta);
    tx.objectStore("blobs").put(file.blob, meta.id);
    metas.push(meta);
  }
  await txDone(tx);
  return metas;
}

export async function deleteFile(id: string): Promise<void> {
  const db = await database();
  const tx = db.transaction(["files", "blobs"], "readwrite");
  tx.objectStore("files").delete(id);
  tx.objectStore("blobs").delete(id);
  await txDone(tx);
}

export async function deleteExpenseCascade(expenseId: string, fileIds: string[]): Promise<void> {
  const db = await database();
  const tx = db.transaction(["expenses", "files", "blobs"], "readwrite");
  tx.objectStore("expenses").delete(expenseId);
  for (const id of fileIds) {
    tx.objectStore("files").delete(id);
    tx.objectStore("blobs").delete(id);
  }
  await txDone(tx);
}

export async function getBlobs(expenseId: string, metas: FileMeta[]): Promise<LoadedFile[]> {
  const wanted = metas.filter((m) => m.expenseId === expenseId);
  if (wanted.length === 0) return [];
  const db = await database();
  const tx = db.transaction("blobs", "readonly");
  const store = tx.objectStore("blobs");
  const loaded: LoadedFile[] = [];
  for (const meta of wanted) {
    const blob = (await request(store.get(meta.id))) as Blob | undefined;
    if (blob) loaded.push({ ...meta, blob });
  }
  await txDone(tx);
  return loaded;
}

export async function allBlobs(metas: FileMeta[]): Promise<LoadedFile[]> {
  if (metas.length === 0) return [];
  const db = await database();
  const tx = db.transaction("blobs", "readonly");
  const store = tx.objectStore("blobs");
  const loaded: LoadedFile[] = [];
  for (const meta of metas) {
    const blob = (await request(store.get(meta.id))) as Blob | undefined;
    if (blob) loaded.push({ ...meta, blob });
  }
  await txDone(tx);
  return loaded;
}

export async function eraseAll(): Promise<void> {
  const db = await database();
  const tx = db.transaction(["expenses", "files", "blobs", "meta"], "readwrite");
  tx.objectStore("expenses").clear();
  tx.objectStore("files").clear();
  tx.objectStore("blobs").clear();
  tx.objectStore("meta").clear();
  await txDone(tx);
}

export type BackupPayload = {
  version: 1;
  exportedAt: string;
  settings: Settings;
  expenses: Expense[];
  files: FileMeta[];
};

export async function importPayload(payload: BackupPayload, blobs: { id: string; blob: Blob }[]): Promise<void> {
  const db = await database();
  const tx = db.transaction(["expenses", "files", "blobs", "meta"], "readwrite");
  tx.objectStore("meta").put({ ...DEFAULT_SETTINGS, ...payload.settings, seeded: true }, "settings");
  for (const expense of payload.expenses) tx.objectStore("expenses").put(expense);
  for (const meta of payload.files) tx.objectStore("files").put(meta);
  for (const item of blobs) tx.objectStore("blobs").put(item.blob, item.id);
  await txDone(tx);
}
