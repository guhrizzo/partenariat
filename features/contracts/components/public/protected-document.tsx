"use client";

/**
 * Fricção, não DRM real: nada disso impede um usuário determinado (dev
 * tools, print screen). O objetivo é dificultar cópia/impressão casual,
 * como pedido no escopo — não existe bloqueio garantido no browser.
 */
export function ProtectedDocument({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div
        className="select-none print:hidden"
        onContextMenu={(event) => event.preventDefault()}
        onCopy={(event) => event.preventDefault()}
        onCut={(event) => event.preventDefault()}
      >
        {children}
      </div>
      <p className="hidden text-center text-sm print:block">
        A impressão deste documento não está disponível. Acesse o link original para visualizá-lo.
      </p>
    </>
  );
}
