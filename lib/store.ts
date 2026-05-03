import type { Medicine, Transaction, Wallet } from "./types";
import { genId, nowIso } from "./utils";
import { SEED_MEDICINES } from "./seed-data";

interface MemoryStore {
  medicines: Map<string, Medicine>;
  transactions: Transaction[];
  wallets: Map<string, Wallet>;
  seeded: boolean;
}

declare global {
  // eslint-disable-next-line no-var
  var __regretMartStore: MemoryStore | undefined;
}

function getStore(): MemoryStore {
  if (!globalThis.__regretMartStore) {
    globalThis.__regretMartStore = {
      medicines: new Map(),
      transactions: [],
      wallets: new Map(),
      seeded: false
    };
  }
  const s = globalThis.__regretMartStore;
  if (!s.seeded) {
    for (const m of SEED_MEDICINES) s.medicines.set(m.id, m);
    s.seeded = true;
  }
  return s;
}

const STARTER_BALANCE = 100;

export async function getOrCreateWallet(anonId: string): Promise<Wallet> {
  const store = getStore();
  const existing = store.wallets.get(anonId);
  if (existing) return existing;
  const wallet: Wallet = {
    anonId,
    balance: STARTER_BALANCE,
    updatedAt: nowIso()
  };
  store.wallets.set(anonId, wallet);
  return wallet;
}

export async function adjustWallet(anonId: string, delta: number): Promise<Wallet> {
  const store = getStore();
  const wallet = await getOrCreateWallet(anonId);
  const next: Wallet = {
    ...wallet,
    balance: wallet.balance + delta,
    updatedAt: nowIso()
  };
  store.wallets.set(anonId, next);
  return next;
}

export interface ListMedicineOptions {
  status?: "listed" | "sold" | "all";
  limit?: number;
  offset?: number;
  tag?: string;
  sellerId?: string;
  buyerId?: string;
  sort?: "newest" | "cheapest" | "priciest";
}

export async function listMedicines(opts: ListMedicineOptions = {}): Promise<Medicine[]> {
  const store = getStore();
  const { status = "listed", limit = 60, offset = 0, tag, sellerId, buyerId, sort = "newest" } = opts;
  let arr = Array.from(store.medicines.values());
  if (status !== "all") arr = arr.filter((m) => m.status === status);
  if (tag) arr = arr.filter((m) => m.tags.includes(tag));
  if (sellerId) arr = arr.filter((m) => m.sellerId === sellerId);
  if (buyerId) arr = arr.filter((m) => m.buyerId === buyerId);
  arr.sort((a, b) => {
    if (sort === "cheapest") return a.price - b.price;
    if (sort === "priciest") return b.price - a.price;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
  return arr.slice(offset, offset + limit);
}

export async function getMedicine(id: string): Promise<Medicine | null> {
  const store = getStore();
  return store.medicines.get(id) ?? null;
}

export interface CreateMedicineInput {
  sellerId: string;
  title: string;
  content: string;
  comfortText: string;
  emojiSkin: string;
  pillColor: string;
  price: number;
  tags: string[];
}

export async function createMedicine(input: CreateMedicineInput): Promise<Medicine> {
  const store = getStore();
  const med: Medicine = {
    id: genId("med"),
    status: "listed",
    buyerId: null,
    soldAt: null,
    createdAt: nowIso(),
    ...input
  };
  store.medicines.set(med.id, med);
  return med;
}

export interface BuyResult {
  ok: boolean;
  reason?: string;
  medicine?: Medicine;
  wallet?: Wallet;
  transaction?: Transaction;
}

export async function buyMedicine(medicineId: string, buyerId: string): Promise<BuyResult> {
  const store = getStore();
  const med = store.medicines.get(medicineId);
  if (!med) return { ok: false, reason: "药丸已不存在" };
  if (med.status !== "listed") return { ok: false, reason: "已被别人买走了" };
  if (med.sellerId === buyerId) return { ok: false, reason: "不能买自己挂的药丸" };

  const buyerWallet = await getOrCreateWallet(buyerId);
  if (buyerWallet.balance < med.price) {
    return { ok: false, reason: `释怀币不够，需要 ${med.price}，你只有 ${buyerWallet.balance}` };
  }

  const updatedBuyer = await adjustWallet(buyerId, -med.price);
  await adjustWallet(med.sellerId, med.price);

  const updatedMed: Medicine = {
    ...med,
    status: "sold",
    buyerId,
    soldAt: nowIso()
  };
  store.medicines.set(medicineId, updatedMed);

  const tx: Transaction = {
    id: genId("tx"),
    medicineId,
    medicineTitle: updatedMed.title,
    buyerId,
    price: med.price,
    comfortTextSnapshot: updatedMed.comfortText,
    createdAt: nowIso()
  };
  store.transactions.push(tx);

  return { ok: true, medicine: updatedMed, wallet: updatedBuyer, transaction: tx };
}

export async function listTransactionsByBuyer(buyerId: string): Promise<Transaction[]> {
  const store = getStore();
  return store.transactions
    .filter((t) => t.buyerId === buyerId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function adminDelist(medicineId: string): Promise<boolean> {
  const store = getStore();
  return store.medicines.delete(medicineId);
}

export async function getStoreStats(): Promise<{ total: number; listed: number; sold: number }> {
  const store = getStore();
  const all = Array.from(store.medicines.values());
  return {
    total: all.length,
    listed: all.filter((m) => m.status === "listed").length,
    sold: all.filter((m) => m.status === "sold").length
  };
}
