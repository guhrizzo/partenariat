"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/design-system/components/button";
import { Input } from "@/design-system/components/input";
import { Label } from "@/design-system/components/label";
import { SignaturePad, type SignaturePadHandle } from "@/features/contracts/components/public/signature-pad";
import { signContractPublicAction } from "@/features/contracts/actions";

interface SignContractFormProps {
  token: string;
  defaultName?: string;
}

export function SignContractForm({ token, defaultName }: SignContractFormProps) {
  const router = useRouter();
  const padRef = React.useRef<SignaturePadHandle>(null);
  const [name, setName] = React.useState(defaultName ?? "");
  const [document, setDocument] = React.useState("");
  const [consent, setConsent] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isPending, startTransition] = React.useTransition();
  const [signed, setSigned] = React.useState(false);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    const dataUrl = padRef.current?.getDataUrl();
    if (!dataUrl) {
      setError("Desenhe sua assinatura antes de continuar.");
      return;
    }
    if (!consent) {
      setError("É necessário aceitar os termos para assinar.");
      return;
    }

    startTransition(async () => {
      const result = await signContractPublicAction(token, {
        signerName: name,
        signerDocument: document,
        signatureImageDataUrl: dataUrl,
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        consent: true,
      });

      if (!result.success) {
        setError(result.error ?? "Não foi possível assinar o contrato.");
        return;
      }

      setSigned(true);
      router.refresh();
    });
  }

  if (signed) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-10 text-center">
        <CheckCircle2 className="size-10 text-emerald-600" />
        <p className="text-lg font-medium text-foreground">Contrato assinado com sucesso</p>
        <p className="text-sm text-foreground-muted">
          Uma cópia fica disponível com quem enviou o contrato.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6">
      <h2 className="text-lg font-semibold text-foreground">Assinar contrato</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="signerName">Nome completo</Label>
          <Input id="signerName" value={name} onChange={(event) => setName(event.target.value)} required />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="signerDocument">CPF</Label>
          <Input
            id="signerDocument"
            value={document}
            onChange={(event) => setDocument(event.target.value)}
            required
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label>Assinatura</Label>
        <SignaturePad ref={padRef} />
      </div>

      <label className="flex items-start gap-2 text-sm text-foreground-muted">
        <input
          type="checkbox"
          checked={consent}
          onChange={(event) => setConsent(event.target.checked)}
          className="mt-0.5"
        />
        Li e concordo com os termos deste contrato.
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button type="submit" disabled={isPending}>
        {isPending ? "Assinando..." : "Assinar contrato"}
      </Button>
    </form>
  );
}
