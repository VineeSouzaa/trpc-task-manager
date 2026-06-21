'use client';

import { BackButton } from '@/components/back-button';
import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { TasksEditProps } from '@/modules/tasks/edit/types';
import { useTRPC } from '@/trpc/client';
import { cn } from '@/utils/cn';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Switch } from 'radix-ui';
import { useState } from 'react';

export function TasksEdit({ id, ...props }: TasksEditProps) {
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: task, isLoading } = useQuery(trpc.tasks.get.queryOptions({ id }));

  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
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
    mutate({ id, title, description });
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
        <div className="flex gap-2">
          <Input
            name="title"
            type="text"
            placeholder="Task title..."
            className="flex-1"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={error?.message}
          />
          <Input
            name="description"
            type="text"
            placeholder="Task description..."
            className="flex-1"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            error={error?.message}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <label id="active-label" htmlFor="active" className="Label" style={{ paddingRight: 15 }}>
            Active
          </label>
          <Switch.Root id="active" aria-labelledby="active-label" className="SwitchRoot">
            <Switch.Thumb
              className="SwitchThumb"
              data-state={active ? 'checked' : 'unchecked'}
              onClick={() => setActive(!active)}
            />
          </Switch.Root>
        </div>
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Updating...' : 'Update'}
        </Button>
      </form>
    </>
  );
}
