import { InputProps } from "@/components/input/types";
import { cn } from "@/utils/cn";

export function Input(props: InputProps) {
  return <input {...props} className={cn(props.className, 'border border-gray-300 rounded-md p-2')} />;
}
