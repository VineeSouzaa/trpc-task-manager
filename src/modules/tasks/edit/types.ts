import { ComponentProps } from 'react';

export type TasksEditProps = {
  id: string;
} & ComponentProps<'form'>;
