'use client';

import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { useTRPC } from '@/trpc/client';
import { cn } from '@/utils/cn';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { TasksCreateProps } from './types';

export function TasksCreate({ ...props }: TasksCreateProps) {
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const { mutate, isPending } = useMutation(trpc.tasks.create.mutationOptions({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trpc.tasks.list.queryKey() });
      router.push('/');
    },
  }));

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate({ title, description });
  };

  if(isPending) {
    return <p>Creating task...</p>;
  }
  return (
    <form {...props} className={cn(props.className, 'flex flex-col gap-3')} onSubmit={handleSubmit}>
      <div className="flex gap-2">
        <Input name="title" type="text" placeholder="Task title..." className="flex-1" value={title} onChange={(e) => setTitle(e.target.value)} />
        <Input name="description" type="text" placeholder="Task description..." className="flex-1" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending ? 'Adding...' : 'Add'}
      </Button>
    </form>
  );
}
