import { cn } from '@/utils/cn';
import { ListItemProps } from './type';

export function ListItem({ task, ...props }: ListItemProps) {
  return (
    <div
      {...props}
      className={cn('flex items-start justify-between border border-gray-200 rounded px-3 py-2', props.className)}
    >
      <div>
        <p className="text-sm font-medium">{task.title}</p>
        {task.description && <p className="text-xs text-gray-500 mt-0.5">{task.description}</p>}
      </div>
    </div>
  );
}
