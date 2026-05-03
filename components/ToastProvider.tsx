"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastKind = "success" | "error" | "info";
interface ToastItem {
  id: string;
  kind: ToastKind;
  text: string;
}

interface ToastApi {
  show(text: string, kind?: ToastKind): void;
  success(text: string): void;
  error(text: string): void;
  info(text: string): void;
}

const ToastContext = createContext<ToastApi | null>(null);

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const remove = useCallback((id: string) => {
    setItems((s) => s.filter((t) => t.id !== id));
  }, []);

  const show = useCallback(
    (text: string, kind: ToastKind = "info") => {
      const id = Math.random().toString(36).slice(2);
      setItems((s) => [...s, { id, kind, text }]);
      setTimeout(() => remove(id), 3500);
    },
    [remove]
  );

  const api: ToastApi = {
    show,
    success: (t) => show(t, "success"),
    error: (t) => show(t, "error"),
    info: (t) => show(t, "info")
  };

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-3 z-[80] flex flex-col items-center gap-2 px-4">
        <AnimatePresence>
          {items.map((t) => (
            <motion.div
              key={t.id}
              initial={{ y: -16, opacity: 0, scale: 0.96 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -8, opacity: 0, scale: 0.98 }}
              className={cn(
                "pointer-events-auto flex max-w-md items-start gap-2 rounded-2xl border px-4 py-2.5 text-sm shadow-lg backdrop-blur",
                t.kind === "success" && "border-emerald-200 bg-white/95 text-emerald-700",
                t.kind === "error" && "border-pill-200 bg-white/95 text-pill-600",
                t.kind === "info" && "border-rx-200 bg-white/95 text-rx-700"
              )}
            >
              {t.kind === "success" && <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />}
              {t.kind === "error" && <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />}
              {t.kind === "info" && <Info className="mt-0.5 h-4 w-4 shrink-0" />}
              <span className="leading-snug">{t.text}</span>
              <button onClick={() => remove(t.id)} className="ml-2 text-ink-300 hover:text-ink-700">
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function NoSSR({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? <>{children}</> : null;
}
