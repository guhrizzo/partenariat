import "server-only";
import { adminDb } from "@/firebase/admin";
import { COLLECTIONS } from "@/constants/firestore";
import { firestoreConverter } from "@/firebase/converters/firestore-converter";
import type { Payment, PaymentProvider, PaymentStatus } from "@/types";

const converter = firestoreConverter<Payment>();

function paymentsCollection() {
  return adminDb.collection(COLLECTIONS.payments).withConverter(converter);
}

export async function createPayment(
  organizationId: string,
  contractId: string,
  provider: PaymentProvider,
  amount: number
): Promise<Payment> {
  const ref = paymentsCollection().doc();
  const payment: Payment = {
    id: ref.id,
    organizationId,
    contractId,
    provider,
    status: "pending",
    amount,
    providerRef: null,
    createdAt: new Date(),
  };
  await ref.set(payment);
  return payment;
}

export async function setPaymentProviderRef(paymentId: string, providerRef: string): Promise<void> {
  await paymentsCollection().doc(paymentId).update({ providerRef });
}

export async function updatePaymentStatus(paymentId: string, status: PaymentStatus): Promise<void> {
  await paymentsCollection().doc(paymentId).update({ status });
}

export async function getPayment(paymentId: string): Promise<Payment | null> {
  const snapshot = await paymentsCollection().doc(paymentId).get();
  return snapshot.data() ?? null;
}

export async function getPaymentByProviderRef(providerRef: string): Promise<Payment | null> {
  const snapshot = await paymentsCollection().where("providerRef", "==", providerRef).limit(1).get();
  if (snapshot.empty) return null;
  return snapshot.docs[0].data();
}

export async function listPaymentsByContract(contractId: string): Promise<Payment[]> {
  const snapshot = await paymentsCollection().where("contractId", "==", contractId).get();
  return snapshot.docs
    .map((doc) => doc.data())
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}
