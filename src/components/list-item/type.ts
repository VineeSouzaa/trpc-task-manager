import { Task } from '@/modules/tasks/types';
import { ComponentProps } from 'react';

export type ListItemProps = {
  task: Task;
} & ComponentProps<'div'>;
