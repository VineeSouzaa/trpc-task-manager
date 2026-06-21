export type ToastVariant = 'success' | 'error';

export type RadixToastProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  variant?: ToastVariant;
};
