"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { getAnonId } from "@/lib/anon";
import type { Transaction, Wallet } from "@/lib/types";

interface WalletState {
  anonId: string;
  wallet: Wallet | null;
  transactions: Transaction[];
  refresh(): Promise<void>;
  applyWallet(wallet: Wallet): void;
  applyTransaction(tx: Transaction): void;
  hydrated: boolean;
}

const WalletContext = createContext<WalletState | null>(null);

export function useWallet(): WalletState {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within WalletProvider");
  return ctx;
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [anonId, setAnonId] = useState<string>("");
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [hydrated, setHydrated] = useState(false);

  const refresh = useCallback(async () => {
    if (!anonId) return;
    try {
      const res = await fetch(`/api/wallet?anonId=${encodeURIComponent(anonId)}`, { cache: "no-store" });
      const data = (await res.json()) as { ok: boolean; wallet?: Wallet; transactions?: Transaction[] };
      if (data.ok && data.wallet) {
        setWallet(data.wallet);
        setTransactions(data.transactions || []);
      }
    } catch {
      // silent
    }
  }, [anonId]);

  useEffect(() => {
    const id = getAnonId();
    setAnonId(id);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (anonId) refresh();
  }, [anonId, refresh]);

  const applyWallet = useCallback((w: Wallet) => setWallet(w), []);
  const applyTransaction = useCallback((tx: Transaction) => {
    setTransactions((arr) => [tx, ...arr]);
  }, []);

  return (
    <WalletContext.Provider value={{ anonId, wallet, transactions, refresh, applyWallet, applyTransaction, hydrated }}>
      {children}
    </WalletContext.Provider>
  );
}
