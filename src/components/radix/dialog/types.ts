export type RadixDialogProps = {
  dialogTrigger: React.ReactNode;
  dialogTitle: string;
  dialogDescription: string;
  onConfirm: () => void;
  onOpenChange?: (open: boolean) => void;
};
