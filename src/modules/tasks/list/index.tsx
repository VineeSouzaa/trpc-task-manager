'use client';

import { useTRPC } from '@/trpc/client';
import { useQuery } from '@tanstack/react-query';
import { ComponentProps } from 'react';

export function TasksList(props: ComponentProps<'div'>) {
  const trpc = useTRPC();
  const { data: tasks = [] } = useQuery(trpc.tasks.list.queryOptions());

  return (
    <div {...props}>
      {tasks.map((task) => (
        <div key={task.id}>
          <h3>{task.title}</h3>
          <p>{task.description}</p>
        </div>
      ))}
    </div>
  );
}
