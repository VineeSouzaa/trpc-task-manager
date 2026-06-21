import { z } from 'zod';
import { tasks } from '../in-memory-store';
import { baseProcedure, createTRPCRouter } from '../init';

export const tasksRouter = createTRPCRouter({
  list: baseProcedure.query(() => tasks),
  create: baseProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().optional().default(''),
      }),
    )
    .mutation(({ input }) => {
      const task = {
        id: crypto.randomUUID(),
        title: input.title,
        description: input.description,
        created_at: new Date(),
        updated_at: new Date(),
        active: true,
        completed: false,
      };

      tasks.push(task);

      return task;
    }),

});
