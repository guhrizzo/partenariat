"use server";

import { getAppUrl } from "@/lib/env";
import { getContractByToken } from "@/features/contracts/repositories/contract-repository";
import { getTemplate } from "@/features/templates/repositories/template-repository";
import { createPayment, setPaymentProviderRef } from "@/features/payments/repositories/payment-repository";
import { getPaymentProviderAdapter } from "@/features/payments/providers/provider-registry";

interface ActionResult {
  success: boolean;
  error?: string;
  checkoutUrl?: string;
}

/** Público (sem verifySession): quem paga é o signatário, que nunca tem conta no sistema. */
export async function createCheckoutPublicAction(token: string): Promise<ActionResult> {
  const contract = await getContractByToken(token);
  if (!contract) {
    return { success: false, error: "Contrato não encontrado." };
  }
  if (contract.status !== "signed") {
    return { success: false, error: "O pagamento só fica disponível após a assinatura." };
  }
  if (!contract.paymentAmount || !contract.paymentProvider) {
    return { success: false, error: "Este contrato não possui cobrança configurada." };
  }

  const template = await getTemplate(contract.organizationId, contract.templateId);

  try {
    const payment = await createPayment(
      contract.organizationId,
      contract.id,
      contract.paymentProvider,
      contract.paymentAmount
    );

    const adapter = getPaymentProviderAdapter(contract.paymentProvider);
    const result = await adapter.createCheckout({
      amount: contract.paymentAmount,
      description: template?.name ?? "Contrato",
      externalReference: payment.id,
      successUrl: `${getAppUrl()}/sign/${token}`,
    });

    await setPaymentProviderRef(payment.id, result.providerRef);

    return { success: true, checkoutUrl: result.checkoutUrl };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Não foi possível iniciar o pagamento.",
    };
  }
}
