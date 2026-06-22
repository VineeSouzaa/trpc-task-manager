'use client';

import { ListItem } from '@/components/list-item';
import { RadixDialog } from '@/components/radix/dialog';
import { RadixToast } from '@/components/radix/toast';
import { useTRPC } from '@/trpc/client';
import { cn } from '@/utils/cn';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PencilIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ComponentProps, useEffect, useRef, useState } from 'react';

export function TasksList(props: ComponentProps<'div'>) {
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const infiniteScrollHidedDiveRef = useRef<HTMLDivElement>(null);

  const [hoveredTask, setHoveredTask] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery(
    trpc.tasks.list.infiniteQueryOptions(
      { limit: 5 },
      {
        getNextPageParam: (lastPage) => lastPage.cursor,
      },
    ),
  );

  const tasks = data?.pages.flatMap((page) => page.tasks) ?? [];

  const { mutate: deleteTask, isPending: isDeletingTask } = useMutation(
    trpc.tasks.delete.mutationOptions({
      onMutate: async ({ id }) => {
        const queryKey = trpc.tasks.list.infiniteQueryKey({ limit: 5 });

        // Cancel any outgoing refetches (see readme for more details)
        await queryClient.cancelQueries({ queryKey });
        const previous = queryClient.getQueryData(queryKey);

        // Optimistically update to the new state (see readme for more details)
        queryClient.setQueryData(queryKey, (old) =>
          old
            ? {
                ...old,
                pages: old.pages.map((page) => ({
                  ...page,
                  tasks: page.tasks.filter((task) => task.id !== id),
                })),
              }
            : old,
        );

        return { previous };
      },
      onError: (_err, _variables, context) => {
        queryClient.setQueryData(trpc.tasks.list.infiniteQueryKey({ limit: 5 }), context?.previous);
        setToast({ open: true, title: 'Error deleting task', description: _err.message, variant: 'error' });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: trpc.tasks.list.infiniteQueryKey() });
        setToast({
          open: true,
          title: 'Task deleted',
          description: 'The task was successfully removed.',
          variant: 'success',
        });
      },
    }),
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        threshold: 1,
      },
    );

    if (infiniteScrollHidedDiveRef.current) {
      observer.observe(infiniteScrollHidedDiveRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const [toast, setToast] = useState<{
    open: boolean;
    title: string;
    description?: string;
    variant?: 'success' | 'error';
  }>({
    open: false,
    title: '',
  });

  const handleAddNewTask = () => {
    router.push('/task/creation');
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTask({ id: taskId });
  };

  return (
    <>
      <div
        {...props}
        className={cn(
          props.className,
          'flex flex-col gap-3 bg-gray-950 rounded-md p-4 border border-gray-800 w-full max-w-md mx-auto',
        )}
      >
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
          <p className="text-xs text-gray-500">
            {isDeletingTask
              ? 'Deleting...'
              : tasks.length === 0
                ? 'No tasks yet. Add one above.'
                : `${tasks.length} task${tasks.length === 1 ? '' : 's'} — hover to edit or delete`}
          </p>

          <div className="flex flex-col gap-4 items-center w-full">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="flex flex-row w-full "
                onMouseEnter={() => !dialogOpen && setHoveredTask(task.id)}
                onMouseLeave={() => !dialogOpen && setHoveredTask(null)}
              >
                <ListItem task={task} className="flex-1 min-w-0 mx-2 shadow-md" />

                <div
                  className={cn(
                    ' rounded-md flex flex-row gap-2 items-center shrink-0 overflow-hidden transition-all duration-500',
                    hoveredTask === task.id
                      ? 'w-16 opacity-100 translate-x-0'
                      : 'w-0 opacity-0 translate-x-2 pointer-events-none',
                  )}
                >
                  <PencilIcon
                    size={18}
                    className="hover:cursor-pointer text-gray-400 hover:text-gray-200"
                    onClick={() => router.push(`/task/edition/${task.id}`)}
                  />
                  <RadixDialog
                    onConfirm={() => handleDeleteTask(task.id)}
                    onOpenChange={(open) => {
                      setDialogOpen(open);
                      if (open) setHoveredTask(null);
                    }}
                    dialogTitle="Delete task"
                    dialogDescription={`Are you sure you want to delete task "${task.title}"?`}
                    dialogTrigger={
                      <Trash2Icon size={18} className="hover:cursor-pointer text-red-800 hover:text-red-600" />
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <RadixToast
          open={toast.open}
          onOpenChange={(open) => setToast((prev) => ({ ...prev, open }))}
          title={toast.title}
          description={toast.description}
          variant={toast.variant}
        />
      </div>
      <div ref={infiniteScrollHidedDiveRef} className="min-h-2 py-2">
        {isFetchingNextPage && <p className="text-sm text-gray-500 text-center">Loading more tasks...</p>}
        {!hasNextPage && tasks.length > 0 && <p className="text-sm text-gray-500 text-center">No more data to load</p>}
      </div>
    </>
  );
}
