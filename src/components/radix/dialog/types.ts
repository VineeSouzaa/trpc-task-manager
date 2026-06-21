import { ComponentProps } from 'react';

export type RadixDialogProps = {
  dialogTrigger: React.ReactNode;
  dialogTitle: string;
  dialogDescription: string;
  onConfirm: () => void;
} & ComponentProps<'div'>;
