import { TASK_CREATION_ERROR, TASK_DELETION_ERROR, TASK_NOT_FOUND_ERROR } from '@/utils/errors';
import pino from 'pino';
import { z } from 'zod';
import { tasks } from '../in-memory-store';
import { baseProcedure, createTRPCRouter } from '../init';

const logger = pino({
  name: 'tasks-router',
  level: 'debug',
  transport: {
    targets: [
      {
        level: 'debug',
        target: 'pino-pretty',
        options: {
          colorize: true,
          ignore: 'pid,hostname',
          translateTime: 'SYS:dd-mm-yyyy HH:MM:ss',
        },
      },
    ],
  },
});

export const tasksRouter = createTRPCRouter({
  list: baseProcedure.query(() => tasks.filter((task) => task.active)),
  create: baseProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().optional().default(''),
      }),
    )
    .mutation(({ input }) => {
      try {
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

        logger.info(`Task created: ${task.id}`);

        return task;
      } catch (error) {
        logger.error(error, 'Error creating task');

        throw TASK_CREATION_ERROR;
      }
    }),
  delete: baseProcedure.input(z.object({ id: z.string() })).mutation(({ input }) => {
    const task = tasks.find((task) => task.id === input.id);
    if (!task) {
      logger.error(`Task not found: ${input.id}`);
      throw TASK_NOT_FOUND_ERROR;
    }
    try {
      task.active = false;
      task.updated_at = new Date();

      logger.info(`Task deleted: ${input.id}`);

      return task;
    } catch (error) {
      logger.error(error, 'Error deleting task');

      throw TASK_DELETION_ERROR;
    }
    return task;
  }),
});
