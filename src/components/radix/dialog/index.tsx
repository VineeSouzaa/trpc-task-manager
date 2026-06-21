import { Button } from '@/components/button';
import { RadixDialogProps } from '@/components/radix/dialog/types';
import { XIcon } from 'lucide-react';
import { Dialog } from 'radix-ui';
import './styles.css';

export function RadixDialog({ dialogTrigger, dialogTitle, dialogDescription, onConfirm }: RadixDialogProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{dialogTrigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="DialogOverlay" />
        <Dialog.Content className="DialogContent bg-gray-900 text-white">
          <Dialog.Title className="DialogTitle">{dialogTitle}</Dialog.Title>
          <Dialog.Description className="DialogDescription">{dialogDescription}</Dialog.Description>
          <div style={{ display: 'flex', marginTop: 25, justifyContent: 'flex-end' }}>
            <Dialog.Close asChild>
              <div className="flex flex-row gap-2">
                <Button className="bg-red-950 text-white hover:bg-red-800 hover:cursor-pointer transition-all duration-500">
                  Cancel
                </Button>
                <Button
                  className="bg-green-950 text-white hover:bg-green-600 hover:cursor-pointer transition-all duration-500"
                  onClick={onConfirm}
                >
                  Confirm
                </Button>
              </div>
            </Dialog.Close>
          </div>
          <Dialog.Close asChild>
            <button className="IconButton" aria-label="Close">
              <XIcon />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
