import { ArrowLeftIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '../button';
import { BackButtonProps } from './types';

export function BackButton({ ...props }: BackButtonProps) {
  const router = useRouter();
  return (
    <Button {...props} onClick={() => router.back()}>
      <ArrowLeftIcon className="w-4 h-4" />
    </Button>
  );
}
