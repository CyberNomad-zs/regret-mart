export type MedicineStatus = "listed" | "sold";

export interface Medicine {
  id: string;
  sellerId: string;
  title: string;
  content: string;
  comfortText: string;
  emojiSkin: string;
  pillColor: string;
  price: number;
  tags: string[];
  status: MedicineStatus;
  buyerId?: string | null;
  createdAt: string;
  soldAt?: string | null;
}

export interface Transaction {
  id: string;
  medicineId: string;
  medicineTitle: string;
  buyerId: string;
  price: number;
  comfortTextSnapshot: string;
  createdAt: string;
}

export interface Wallet {
  anonId: string;
  balance: number;
  updatedAt: string;
}

export interface GenerateRequest {
  content: string;
}

export interface GenerateResponse {
  ok: boolean;
  rejected?: boolean;
  reason?: string;
  candidates?: GenerateCandidate[];
}

export interface GenerateCandidate {
  title: string;
  emojiSkin: string;
  pillColor: string;
  comfortText: string;
  tags: string[];
  suggestedPrice: number;
}
