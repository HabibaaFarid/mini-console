import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createPayment,
  getPaymentByPublicId,
  updatePaymentStatus,
} from "../lib/db";
import type { PaymentStatus } from "../lib/db";

export async function createPaymentAction(formData: FormData) {
  "use server";
  const amountRaw = formData.get("amount")?.toString() ?? "";
  const merchantOrderId = formData.get("merchantOrderId")?.toString() ?? "";

  // amount expected as decimal string e.g. "10.50"
  const parsed = parseFloat(amountRaw.replace(",", "."));
  if (isNaN(parsed) || parsed <= 0) {
    throw new Error("Invalid amount provided.");
  }
  const amountCents = Math.round(parsed * 100);

  const payment = await createPayment({ amountCents, merchantOrderId });

  // update caches for home and details
  revalidatePath("/");
  revalidatePath(`/payments/${payment.id}`);

  // send user to details
  redirect(`/payments/${payment.id}`);
}

/** mark paid by publicId (from /pay/[publicId]) */
export async function markPaidAction(formData: FormData) {
  "use server";
  const publicId = formData.get("publicId")?.toString();
  if (!publicId) throw new Error("missing publicId");

  const payment = await getPaymentByPublicId(publicId);
  if (!payment) throw new Error("payment not found");

  await updatePaymentStatus(payment.id, "paid");

  revalidatePath("/");
  revalidatePath(`/payments/${payment.id}`);
  revalidatePath(`/pay/${publicId}`);

  redirect(`/pay/${publicId}`);
}

export async function markCanceledAction(formData: FormData) {
  "use server";
  const publicId = formData.get("publicId")?.toString();
  if (!publicId) throw new Error("missing publicId");

  const payment = await getPaymentByPublicId(publicId);
  if (!payment) throw new Error("payment not found");

  await updatePaymentStatus(payment.id, "canceled");

  revalidatePath("/");
  revalidatePath(`/payments/${payment.id}`);
  revalidatePath(`/pay/${publicId}`);

  redirect(`/pay/${publicId}`);
}
