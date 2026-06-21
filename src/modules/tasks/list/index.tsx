'use client';

import { useTRPC } from '@/trpc/client';
import { cn } from '@/utils/cn';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { ComponentProps } from 'react';

export function TasksList(props: ComponentProps<'div'>) {
  const router = useRouter();
  const trpc = useTRPC();
  const { data: tasks = [] } = useQuery(trpc.tasks.list.queryOptions());

  if(!tasks.length) {
    return <p className="text-sm text-gray-400">No tasks yet.</p>
  }

  const handleAddNewTask = () => {
    router.push('/task/creation');
  }

  return (
    <div {...props} className={cn(props.className, 'flex flex-col gap-3')}>
      <h1 className="text-xl font-semibold mb-2">Tasks</h1>
      <div className="flex gap-2">
        <button className="px-3 py-2 bg-black text-white text-sm rounded-md" onClick={handleAddNewTask}>Add new task</button>
      </div>
      <div className="flex flex-col gap-2 mt-1">
        {tasks.map((task) => (
          <div key={task.id} className="flex items-start justify-between border border-gray-200 rounded px-3 py-2">
            <div>
              <p className="text-sm font-medium">{task.title}</p>
              {task.description && <p className="text-xs text-gray-500 mt-0.5">{task.description}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
