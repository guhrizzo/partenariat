"use client";

import * as React from "react";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider as RadixToastProvider,
  ToastTitle,
  ToastViewport,
  type ToastProps,
} from "@/design-system/components/toast";

interface ToastItem {
  id: string;
  title: string;
  description?: string;
  variant?: ToastProps["variant"];
}

interface ToastContextValue {
  toast: (item: Omit<ToastItem, "id">) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<ToastItem[]>([]);

  const dismiss = React.useCallback((id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const toast = React.useCallback((item: Omit<ToastItem, "id">) => {
    const id = crypto.randomUUID();
    setItems((current) => [...current, { ...item, id }]);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <RadixToastProvider swipeDirection="right">
        {items.map(({ id, title, description, variant }) => (
          <Toast key={id} variant={variant} onOpenChange={(open) => !open && dismiss(id)}>
            <div className="flex flex-col gap-1">
              <ToastTitle>{title}</ToastTitle>
              {description && <ToastDescription>{description}</ToastDescription>}
            </div>
            <ToastClose />
          </Toast>
        ))}
        <ToastViewport />
      </RadixToastProvider>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast deve ser usado dentro de um ToastProvider.");
  }
  return ctx;
}
