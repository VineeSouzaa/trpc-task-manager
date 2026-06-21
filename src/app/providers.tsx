'use client';

import '@/components/radix/toast/styles.css';
import { Toast } from 'radix-ui';

export function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <Toast.Provider swipeDirection="right">
      {children}
      <Toast.Viewport className="ToastViewport" />
    </Toast.Provider>
  );
}
