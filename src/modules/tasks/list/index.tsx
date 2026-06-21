'use client';

import { ListItem } from '@/components/list-item';
import { RadixDialog } from '@/components/radix/dialog';
import { RadixToast } from '@/components/radix/toast';
import { useTRPC } from '@/trpc/client';
import { cn } from '@/utils/cn';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PencilIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ComponentProps, useState } from 'react';

export function TasksList(props: ComponentProps<'div'>) {
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data: tasks = [] } = useQuery(trpc.tasks.list.queryOptions());

  const { mutate: deleteTask, isPending: isDeletingTask } = useMutation(
    trpc.tasks.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: trpc.tasks.list.queryKey() });
      },
    }),
  );

  const [hoveredTask, setHoveredTask] = useState<string | null>(null);

  const handleAddNewTask = () => {
    router.push('/task/creation');
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTask({ id: taskId });
  };

  if (isDeletingTask) {
    return <p className="text-sm text-gray-400">Updating task list...</p>;
  }

  return (
    <div {...props} className={cn(props.className, 'flex flex-col gap-3')}>
      <h1 className="text-xl font-semibold mb-2">Tasks</h1>
      <div className="flex gap-2">
        <button
          className="px-3 py-2 bg-green-950 text-white text-sm rounded-md flex flex-row gap-2 items-center hover:bg-green-800 hover:cursor-pointer transition-all duration-500"
          onClick={handleAddNewTask}
        >
          <PlusIcon className="w-4 h-4" /> Add new task
        </button>
      </div>
      <div className="flex flex-col gap-2 mt-1">
        {!tasks.length && <p className="text-sm text-gray-400">No tasks yet.</p>}
        {tasks.length && <p className="text-sm text-gray-400">Hover task to edit or delete</p>}
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex flex-row"
            onMouseEnter={() => setHoveredTask(task.id)}
            onMouseLeave={() => setHoveredTask(null)}
          >
            <ListItem
              task={task}
              className={cn(hoveredTask === task.id ? 'w-5/7' : 'w-full', 'transition-all duration-500')}
            />

            <div
              className={cn(
                'w-2/7 p-2 rounded-md flex flex-row gap-2 items-center transition-all duration-500',
                hoveredTask === task.id ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2 pointer-events-none',
              )}
            >
              <PencilIcon
                className="hover:cursor-pointer text-gray-400 hover:text-gray-200"
                onClick={() => router.push(`/task/edition/${task.id}`)}
              />
              <RadixDialog
                onConfirm={() => {
                  handleDeleteTask(task.id);
                }}
                dialogTitle="Delete task"
                dialogDescription={`Are you sure you want to delete task "${task.title}"?`}
                dialogTrigger={<Trash2Icon className="hover:cursor-pointer text-red-800 hover:text-red-600" />}
              />
            </div>
          </div>
        ))}
      </div>
      <RadixToast />
    </div>
  );
}
