"use client";
import { useMemo, useSyncExternalStore } from "react";
type Entry = { note?: string; pinned?: boolean };
type Notebook = Record<string, Entry>;
const key = "practicas:notebook:v1", eventName = "practicas-notebook-change";
let fallback = "{}";
let storageFailed = false;
function snapshot() { if (storageFailed) return fallback; try { return localStorage.getItem(key) ?? "{}"; } catch { return fallback; } }
function subscribe(callback: () => void) { window.addEventListener("storage", callback); window.addEventListener(eventName, callback); return () => { window.removeEventListener("storage", callback); window.removeEventListener(eventName, callback); }; }
function parse(value: string): Notebook { try { const data = JSON.parse(value); return data && typeof data === "object" && !Array.isArray(data) ? data : {}; } catch { return {}; } }
export function useNotebook() {
  const raw = useSyncExternalStore(subscribe, snapshot, () => "{}");
  const entries = useMemo(() => parse(raw), [raw]);
  function update(slug: string, changes: Entry) {
    const current = parse(snapshot());
    const next = JSON.stringify({ ...current, [slug]: { ...current[slug], ...changes } });
    fallback = next;
    let persisted = true;
    try { localStorage.setItem(key, next); storageFailed = false; } catch { persisted = false; storageFailed = true; }
    window.dispatchEvent(new Event(eventName));
    return persisted;
  }
  return { entries, update };
}
