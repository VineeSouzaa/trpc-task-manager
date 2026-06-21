'use client';

import { cn } from '@/utils/cn';
import { Toast } from 'radix-ui';
import { RadixToastProps } from './types';

export function RadixToast({ open, onOpenChange, title, description, variant = 'success' }: RadixToastProps) {
  return (
    <Toast.Root
      className={cn('ToastRoot', variant === 'error' && 'border-red-800')}
      open={open}
      onOpenChange={onOpenChange}
    >
      <Toast.Title className={cn('ToastTitle', variant === 'error' && 'text-red-400')}>
        {title}
      </Toast.Title>
      {description && (
        <Toast.Description className="ToastDescription">{description}</Toast.Description>
      )}
    </Toast.Root>
  );
}
