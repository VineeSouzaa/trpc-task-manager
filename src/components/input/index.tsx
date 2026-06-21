import { InputProps } from "@/components/input/types";
import { cn } from "@/utils/cn";

export function Input(props: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      <input {...props} className={cn(props.className, 'border border-gray-300 rounded-md p-2')} />
      {props.error && <p className="text-sm text-red-500">{props.error}</p>}
    </div>
  );
}
