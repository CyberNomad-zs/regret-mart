"use client";

const KEY_ANON_ID = "regret-mart:anonId";
const KEY_FAVORITES = "regret-mart:favorites";

function randomId(): string {
  const c = typeof globalThis !== "undefined" ? globalThis.crypto : undefined;
  if (c?.randomUUID) {
    return c.randomUUID().replace(/-/g, "");
  }
  const arr = new Uint8Array(16);
  if (c?.getRandomValues) {
    c.getRandomValues(arr);
  } else {
    for (let i = 0; i < arr.length; i++) arr[i] = Math.floor(Math.random() * 256);
  }
  return Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("");
}

function fingerprintHints(): string {
  if (typeof window === "undefined") return "ssr";
  const n = window.navigator;
  const s = window.screen;
  const parts = [
    n.userAgent,
    n.language,
    String(n.hardwareConcurrency || ""),
    String(s?.width || ""),
    String(s?.height || ""),
    Intl.DateTimeFormat().resolvedOptions().timeZone || ""
  ];
  return parts.join("|");
}

export function getAnonId(): string {
  if (typeof window === "undefined") return "ssr";
  let id = window.localStorage.getItem(KEY_ANON_ID);
  if (!id) {
    const fp = fingerprintHints();
    let h = 5381;
    for (let i = 0; i < fp.length; i++) h = ((h << 5) + h + fp.charCodeAt(i)) >>> 0;
    id = `anon_${h.toString(36)}_${randomId().slice(0, 10)}`;
    window.localStorage.setItem(KEY_ANON_ID, id);
  }
  return id;
}

export function resetAnonId(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY_ANON_ID);
  window.localStorage.removeItem(KEY_FAVORITES);
}

export function getFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(KEY_FAVORITES) || "[]");
  } catch {
    return [];
  }
}

export function addFavorite(transactionId: string): void {
  if (typeof window === "undefined") return;
  const list = getFavorites();
  if (!list.includes(transactionId)) {
    list.unshift(transactionId);
    window.localStorage.setItem(KEY_FAVORITES, JSON.stringify(list.slice(0, 100)));
  }
}
