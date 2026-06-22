import { Task } from '@/modules/tasks/types';

const inMemoryTasks = globalThis as unknown as {
  tasks: Task[];
};

if (!inMemoryTasks.tasks) {
  const now = Date.now();

  // Seed timestamps are offset by 1s each so cursor pagination has a stable order to walk through.
  inMemoryTasks.tasks = [
    {
      id: '1',
      title: 'Task 1',
      description: 'Description 1',
      created_at: new Date(now - 9000),
      updated_at: new Date(now - 9000),
      active: true,
    },
    {
      id: '2',
      title: 'Task 2',
      description: 'Description 2',
      created_at: new Date(now - 8000),
      updated_at: new Date(now - 8000),
      active: true,
    },
    {
      id: '3',
      title: 'Task 3',
      description: 'Description 3',
      created_at: new Date(now - 7000),
      updated_at: new Date(now - 7000),
      active: true,
    },
    {
      id: '4',
      title: 'Task 4',
      description: 'Description 4',
      created_at: new Date(now - 6000),
      updated_at: new Date(now - 6000),
      active: true,
    },
    {
      id: '5',
      title: 'Task 5',
      description: 'Description 5',
      created_at: new Date(now - 5000),
      updated_at: new Date(now - 5000),
      active: true,
    },
    {
      id: '6',
      title: 'Task 6',
      description: 'Description 6',
      created_at: new Date(now - 4000),
      updated_at: new Date(now - 4000),
      active: true,
    },
    {
      id: '7',
      title: 'Task 7',
      description: 'Description 7',
      created_at: new Date(now - 3000),
      updated_at: new Date(now - 3000),
      active: true,
    },
    {
      id: '8',
      title: 'Task 8',
      description: 'Description 8',
      created_at: new Date(now - 2000),
      updated_at: new Date(now - 2000),
      active: true,
    },
    {
      id: '9',
      title: 'Task 9',
      description: 'Description 9',
      created_at: new Date(now - 1000),
      updated_at: new Date(now - 1000),
      active: true,
    },
  ];
}

export const tasks = inMemoryTasks.tasks;
