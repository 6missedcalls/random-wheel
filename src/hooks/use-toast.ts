import { useState, useCallback } from 'react';

export interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

const toasts: Toast[] = [];
let toastId = 0;

export function useToast() {
  const [, forceUpdate] = useState({});

  const toast = useCallback(
    ({ title, description, variant = 'default' }: Omit<Toast, 'id'>) => {
      const id = String(toastId++);
      const newToast: Toast = { id, title, description, variant };

      toasts.push(newToast);
      forceUpdate({});

      // Auto dismiss after 3 seconds
      setTimeout(() => {
        const index = toasts.findIndex((t) => t.id === id);
        if (index !== -1) {
          toasts.splice(index, 1);
          forceUpdate({});
        }
      }, 3000);

      return { id };
    },
    []
  );

  return { toast, toasts };
}
