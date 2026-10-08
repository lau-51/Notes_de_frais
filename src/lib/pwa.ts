import { useEffect, useSyncExternalStore } from "react";

const CACHE = "frais-domaine-v1";
const DISMISS_KEY = "frais-android-install-dismissed";

type PromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

let promptEvent: PromptEvent | null = null;
let installed = false;
const promptListeners = new Set<() => void>();
const dismissListeners = new Set<() => void>();

function emitPrompt() {
  promptListeners.forEach((listener) => listener());
}

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    promptEvent = event as PromptEvent;
    emitPrompt();
  });
  window.addEventListener("appinstalled", () => {
    installed = true;
    promptEvent = null;
    emitPrompt();
  });
}

function subscribePrompt(listener: () => void) {
  promptListeners.add(listener);
  return () => promptListeners.delete(listener);
}

function subscribeDismiss(listener: () => void) {
  dismissListeners.add(listener);
  return () => dismissListeners.delete(listener);
}

function subscribeStandalone(listener: () => void) {
  const media = window.matchMedia("(display-mode: standalone), (display-mode: minimal-ui)");
  media.addEventListener("change", listener);
  return () => media.removeEventListener("change", listener);
}

function readStandalone() {
  const nav = navigator as Navigator & { standalone?: boolean };
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: minimal-ui)").matches ||
    nav.standalone === true
  );
}

function readDismissed() {
  try {
    return localStorage.getItem(DISMISS_KEY) === "1";
  } catch {
    return false;
  }
}

export function useInstallState() {
  const promptReady = useSyncExternalStore(subscribePrompt, () => promptEvent !== null, () => false);
  const installedNow = useSyncExternalStore(subscribePrompt, () => installed, () => false);
  const standalone = useSyncExternalStore(subscribeStandalone, readStandalone, () => false);
  const dismissed = useSyncExternalStore(subscribeDismiss, readDismissed, () => false);
  return { promptReady, installed: installedNow, standalone, dismissed };
}

export async function promptInstall() {
  const event = promptEvent;
  if (!event) return "unavailable" as const;
  await event.prompt();
  const choice = await event.userChoice;
  promptEvent = null;
  if (choice.outcome === "accepted") installed = true;
  emitPrompt();
  return choice.outcome;
}

export function dismissInstall() {
  try {
    localStorage.setItem(DISMISS_KEY, "1");
  } catch {
    /* navigation privée */
  }
  dismissListeners.forEach((listener) => listener());
}

export function useRegisterPwa() {
  useEffect(() => {
    if (!import.meta.env.PROD) return;
    if (!("serviceWorker" in navigator) || !("caches" in window)) return;

    let cancelled = false;
    void (async () => {
      try {
        await navigator.serviceWorker.register("/sw.js", { scope: "/" });
        if (cancelled) return;
        const urls = new Set<string>([new URL("/", location.origin).href]);
        document.querySelectorAll<HTMLScriptElement>("script[src]").forEach((node) => {
          if (node.src) urls.add(node.src);
        });
        document
          .querySelectorAll<HTMLLinkElement>("link[rel='stylesheet'], link[rel='modulepreload']")
          .forEach((node) => {
            if (node.href) urls.add(node.href);
          });
        const cache = await caches.open(CACHE);
        await Promise.all(
          [...urls].map(async (url) => {
            try {
              const parsed = new URL(url, location.origin);
              if (parsed.origin !== location.origin) return;
              const response = await fetch(parsed.href);
              if (response.ok) await cache.put(parsed.href, response);
            } catch {
              /* la visite en ligne suivante remplira le cache */
            }
          }),
        );
      } catch {
        /* Chrome peut quand même proposer l'installation via le manifeste */
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);
}
