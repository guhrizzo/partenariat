import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { verifySession } from "@/lib/auth/dal";
import { getContract } from "@/features/contracts/repositories/contract-repository";
import { getTemplate } from "@/features/templates/repositories/template-repository";
import { getClient } from "@/features/clients/repositories/client-repository";
import { ContractDetail } from "@/features/contracts/components";

export const metadata: Metadata = {
  title: "Contrato — ContractFlow",
};

interface ContractDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ContractDetailPage({ params }: ContractDetailPageProps) {
  const { id } = await params;
  const session = await verifySession();

  const contract = await getContract(session.organizationId, id);
  if (!contract) {
    notFound();
  }

  const [template, client] = await Promise.all([
    getTemplate(session.organizationId, contract.templateId),
    getClient(session.organizationId, contract.clientId),
  ]);

  if (!template || !client) {
    notFound();
  }

  return <ContractDetail contract={contract} template={template} client={client} />;
}
