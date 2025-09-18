import fs from "fs/promises";
import path from "path";
import { generateSystemId, generatePublicId } from "./id";

const DB_FILE = path.join(process.cwd(), "data", "payments.json");

export type PaymentStatus = "pending" | "paid" | "canceled";

export type Payment = {
  id: string;
  publicId: string;
  amount: number;
  currency: "EGP";
  status: PaymentStatus;
  merchantOrderId: string;
  createdAt: string;
  updatedAt: string;
};

async function readDB(): Promise<Payment[]> {
  try {
    const raw = await fs.readFile(DB_FILE, "utf-8");

    // 🚑 Fix: if file is empty, return []
    if (!raw.trim()) {
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as Payment[];
  } catch (err: any) {
    if (err?.code === "ENOENT") {
      await writeDB([]);
      return [];
    }
    throw err;
  }
}

async function writeDB(arr: Payment[]) {
  await fs.mkdir(path.dirname(DB_FILE), { recursive: true });
  await fs.writeFile(DB_FILE, JSON.stringify(arr, null, 2), "utf-8");
}

export async function getPayments(): Promise<Payment[]> {
  const arr = await readDB();
  return arr.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
}

export async function searchPayments(
  merchantOrderId?: string,
  status?: PaymentStatus
) {
  let arr = await getPayments();
  if (merchantOrderId) {
    arr = arr.filter((p) =>
      p.merchantOrderId.toLowerCase().includes(merchantOrderId.toLowerCase())
    );
  }
  if (status) {
    arr = arr.filter((p) => p.status === status);
  }
  return arr;
}

export async function getPaymentById(id: string): Promise<Payment | null> {
  const arr = await readDB();
  return arr.find((p) => p.id === id) ?? null;
}

export async function getPaymentByPublicId(
  publicId: string
): Promise<Payment | null> {
  const arr = await readDB();
  return arr.find((p) => p.publicId === publicId) ?? null;
}

export async function createPayment(input: {
  amountCents: number;
  currency?: "EGP";
  merchantOrderId: string;
}): Promise<Payment> {
  const now = new Date().toISOString();
  const payment: Payment = {
    id: generateSystemId(),
    publicId: generatePublicId(),
    amount: input.amountCents,
    currency: input.currency ?? "EGP",
    status: "pending",
    merchantOrderId: input.merchantOrderId,
    createdAt: now,
    updatedAt: now,
  };
  const arr = await readDB();
  arr.push(payment);
  await writeDB(arr);
  return payment;
}

export async function updatePaymentStatus(
  id: string,
  status: PaymentStatus
): Promise<Payment | null> {
  const arr = await readDB();
  const index = arr.findIndex((p) => p.id === id);
  if (index === -1) return null;
  arr[index].status = status;
  arr[index].updatedAt = new Date().toISOString();
  await writeDB(arr);
  return arr[index];
}
