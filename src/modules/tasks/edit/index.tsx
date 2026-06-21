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
        queryClient.invalidateQueries({ queryKey: trpc.tasks.list.queryKey() });
        router.push('/');
      },
    }),
  );

  if (isLoading) {
    return <p>Loading task...</p>;
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

    mutate({ id, title: validated.data.title, description: validated.data.description });
  };

  return (
    <>
      <div className="flex items-center gap-2 pb-4">
        <BackButton />
        <h1 className="text-2xl font-bold">Edit Task</h1>
      </div>

      <form
        {...props}
        className={cn(props.className, 'flex flex-col gap-3 justify-center items-center')}
        onSubmit={handleSubmit}
      >
        <div className="flex gap-2 items-start w-full">
          <div className="flex flex-col flex-1">
            <Input
              name="title"
              type="text"
              placeholder="Task title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              error={titleError}
            />
          </div>
          <div className="flex flex-col flex-1">
            <Input
              name="description"
              type="text"
              placeholder="Task description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              error={descriptionError}
            />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <label id="active-label" htmlFor="active" className="Label" style={{ paddingRight: 15 }}>
            Active
          </label>
          <RadixSwitch
            id="active"
            ariaLabelledby="active-label"
            checked={active}
            onChange={(checked) => setActive(checked as boolean)}
          />
        </div>
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Updating...' : 'Update'}
        </Button>
      </form>
      <RadixToast open={!!error} onOpenChange={() => {}} title="Error updating task" description={error?.message} />
    </>
  );
}
