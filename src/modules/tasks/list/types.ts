import { Task } from '@/modules/tasks/types';
import { ComponentProps } from 'react';

export type TasksListProps = {
  tasks: Task[];
} & ComponentProps<'div'>;
