'use client';

import { BackButton } from '@/components/back-button';
import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { RadixSwitch } from '@/components/radix/switch';
import { RadixToast } from '@/components/radix/toast';
import { TasksEditProps } from '@/modules/tasks/edit/types';
import { useTRPC } from '@/trpc/client';
import { cn } from '@/utils/cn';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CheckIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { z } from 'zod';

export function TasksEdit({ id, ...props }: TasksEditProps) {
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const schema = z.object({
    title: z.string().min(1),
    description: z.string().optional().default(''),
  });

  const { data: task, isLoading } = useQuery(trpc.tasks.get.queryOptions({ id }));

  const [title, setTitle] = useState(task?.title || '');
  const [titleError, setTitleError] = useState<string | undefined>(undefined);
  const [description, setDescription] = useState(task?.description || '');
  const [descriptionError, setDescriptionError] = useState<string | undefined>(undefined);
  const [active, setActive] = useState(task?.active || false);

  const { mutate, isPending, error } = useMutation(
    trpc.tasks.edit.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: trpc.tasks.list.infiniteQueryKey() });
        router.push('/');
      },
    }),
  );

  if (isLoading) {
    return <p className="text-sm text-gray-500 text-center">Loading task...</p>;
  }

  if (!isLoading && !task) {
    return <p className="text-sm text-gray-500 text-center">Task not found</p>;
  }

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validated = schema.safeParse({ title, description });

    if (!validated.success) {
      const errors = validated.error.issues.reduce(
        (acc, issue) => {
          const field = issue.path[0] as string;
          acc[field] = issue.message;
          return acc;
        },
        {} as Record<string, string>,
      );
      setTitleError(errors.title);
      setDescriptionError(errors.description);
      return;
    } else {
      setTitleError(undefined);
      setDescriptionError(undefined);
    }

    mutate({ id, title: validated.data.title, description: validated.data.description, active });
  };

  return (
    <>
      <div className="flex flex-col gap-3 bg-gray-950 rounded-md p-4 border border-gray-800 w-full max-w-md mx-auto">
        <div className="flex items-center gap-2">
          <BackButton />
          <h1 className="text-xl font-semibold">Edit Task</h1>
        </div>

        <form
          {...props}
          className={cn(props.className, 'flex flex-col gap-3 mt-1')}
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-1">
            <label htmlFor="title" className="text-xs text-gray-500">
              Title
            </label>
            <Input
              id="title"
              name="title"
              type="text"
              placeholder="Task title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              error={titleError}
              className="w-full"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="description" className="text-xs text-gray-500">
              Description
            </label>
            <Input
              id="description"
              name="description"
              type="text"
              placeholder="Task description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              error={descriptionError}
              className="w-full"
            />
          </div>

          <div className="flex items-center justify-between border border-black rounded px-3 py-2 bg-gray-900">
            <label id="active-label" htmlFor="active" className="Label">
              Active
            </label>
            <RadixSwitch
              id="active"
              ariaLabelledby="active-label"
              checked={active}
              onChange={(checked) => setActive(checked as boolean)}
            />
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="bg-green-950 flex flex-row gap-2 items-center justify-center hover:bg-green-800 hover:cursor-pointer transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckIcon className="w-4 h-4" /> {isPending ? 'Updating...' : 'Update'}
          </Button>
        </form>
      </div>
      <RadixToast open={!!error} onOpenChange={() => {}} title="Error updating task" description={error?.message} />
    </>
  );
}
