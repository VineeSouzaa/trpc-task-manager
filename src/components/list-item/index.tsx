import { cn } from '@/utils/cn';
import { ListItemProps } from './type';

export function ListItem({ task, ...props }: ListItemProps) {
  return (
    <div
      {...props}
      className={cn(
        'flex items-start justify-between border border-black rounded px-3 py-2 bg-gray-900',
        props.className,
      )}
    >
      <div className="min-w-0">
        <p className="text-sm font-medium truncate" title={task.title}>
          {task.title}
        </p>
        {task.description && (
          <p className="text-xs text-gray-500 mt-0.5 truncate" title={task.description}>
            {task.description}
          </p>
        )}
      </div>
    </div>
  );
}
