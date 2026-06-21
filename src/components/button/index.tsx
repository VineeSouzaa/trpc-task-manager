import { ButtonProps } from '@/components/button/types';
import { cn } from '@/utils/cn';

export function Button(props: ButtonProps) {
  return <button {...props} className={cn(props.className, 'px-3 py-2 text-white text-sm rounded-md')} />;
}
