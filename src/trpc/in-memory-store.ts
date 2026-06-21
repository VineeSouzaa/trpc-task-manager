import { Task } from '@/modules/tasks/types';

const inMemoryTasks = globalThis as unknown as {
  tasks: Task[];
};

if(!inMemoryTasks.tasks) {
  inMemoryTasks.tasks = [{
    id: '1',
    title: 'Task 1',
    description: 'Description 1',
    created_at: new Date(),
    updated_at: new Date(),
    active: true,
    completed: false,
  }, {
    id: '2',
    title: 'Task 2',
    description: 'Description 2',
    created_at: new Date(),
    updated_at: new Date(),
    active: true,
    completed: false,
  }];
}

export const tasks = inMemoryTasks.tasks;
