'use client';

import { BackButton } from '@/components/back-button';
import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { RadixToast } from '@/components/radix/toast';
import { useTRPC } from '@/trpc/client';
import { cn } from '@/utils/cn';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { z } from 'zod';
import { TasksCreateProps } from './types';

export function TasksCreate({ ...props }: TasksCreateProps) {
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState('');
  const [titleError, setTitleError] = useState<string | undefined>(undefined);
  const [description, setDescription] = useState('');
  const [descriptionError, setDescriptionError] = useState<string | undefined>(undefined);

  const { mutate, isPending, error } = useMutation(
    trpc.tasks.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: trpc.tasks.list.infiniteQueryKey() });
        router.push('/');
      },
    }),
  );

  const schema = z.object({
    title: z.string().min(1),
    description: z.string().optional().default(''),
  });

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

    mutate({ title: validated.data.title, description: validated.data.description });
  };

  if (isPending) {
    return <p>Creating task...</p>;
  }
  return (
    <>
      <div className="flex items-center gap-2 pb-4">
        <BackButton />
        <h1 className="text-2xl font-bold">Create Task</h1>
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
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Adding...' : 'Add'}
        </Button>
      </form>
      <RadixToast open={!!error} onOpenChange={() => {}} title="Error creating task" description={error?.message} />
    </>
  );
}
