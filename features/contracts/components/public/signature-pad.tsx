"use client";

import * as React from "react";
import SignatureCanvas from "react-signature-canvas";
import { Eraser } from "lucide-react";
import { Button } from "@/design-system/components/button";

export interface SignaturePadHandle {
  getDataUrl: () => string | null;
  clear: () => void;
}

export const SignaturePad = React.forwardRef<SignaturePadHandle>(function SignaturePad(_props, ref) {
  const padRef = React.useRef<SignatureCanvas>(null);

  React.useImperativeHandle(ref, () => ({
    getDataUrl: () => {
      if (!padRef.current || padRef.current.isEmpty()) return null;
      return padRef.current.toDataURL("image/png");
    },
    clear: () => padRef.current?.clear(),
  }));

  return (
    <div className="flex flex-col gap-2">
      <div className="rounded-lg border border-border bg-white">
        <SignatureCanvas
          ref={padRef}
          penColor="#111827"
          canvasProps={{ className: "h-40 w-full touch-none" }}
        />
      </div>
      <Button type="button" variant="ghost" size="sm" className="w-fit" onClick={() => padRef.current?.clear()}>
        <Eraser className="size-3.5" />
        Limpar assinatura
      </Button>
    </div>
  );
});
