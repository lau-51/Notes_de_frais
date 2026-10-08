import type { NewFile } from "./types";

const MAX_BYTES = 25 * 1024 * 1024;

export async function prepareFile(file: File): Promise<NewFile> {
  if (file.size > MAX_BYTES) throw new Error("Fichier trop lourd (25 Mo maximum).");
  const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  if (isPdf) {
    return { name: file.name || "document.pdf", mime: "application/pdf", blob: file };
  }
  if (!file.type.startsWith("image/")) {
    throw new Error("Format non reconnu. Utilisez une photo ou un PDF.");
  }
  try {
    const blob = await compressImage(file);
    const base = (file.name || "justificatif").replace(/\.[^.]+$/, "");
    return { name: `${base}.jpg`, mime: "image/jpeg", blob };
  } catch {
    throw new Error("Cette photo ne peut pas être lue. Réessayez en JPG.");
  }
}

async function compressImage(file: Blob): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const maxEdge = 1600;
  const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.82));
  if (!blob) throw new Error("jpeg");
  return blob;
}
