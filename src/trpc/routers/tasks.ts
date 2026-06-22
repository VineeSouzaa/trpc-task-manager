import { TASK_CREATION_ERROR, TASK_DELETION_ERROR, TASK_NOT_FOUND_ERROR, TASK_UPDATE_ERROR } from '@/utils/errors';
import pino from 'pino';
import { z } from 'zod';
import { tasks } from '../in-memory-store';
import { baseProcedure, createTRPCRouter } from '../init';

const logger = pino({
  name: 'tasks-router',
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
});

export const tasksRouter = createTRPCRouter({
  list: baseProcedure
    .input(
      z.object({
        cursor: z.date().nullish(),
        limit: z.number().min(1).max(50).default(10),
      }),
    )
    .query(({ input }) => {
      const { limit, cursor } = input;

      const taskList = tasks
        .filter((task) => task.active)
        .filter((task) => task.created_at > (cursor ?? new Date(0)))
        .slice(0, limit);

      return {
        tasks: taskList,
        cursor: taskList.length == limit ? taskList[taskList.length - 1].created_at : undefined,
      };
    }),
  get: baseProcedure.input(z.object({ id: z.string() })).query(({ input }) => {
    const task = tasks.find((task) => task.id === input.id);

    if (!task) {
      logger.error(`Task not found: ${input.id}`);
      throw TASK_NOT_FOUND_ERROR;
    }

    return task;
  }),
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
        };

        tasks.push(task);

        logger.info(`Task created: ${task.id}`);

        return task;
      } catch (error) {
        logger.error(error, 'Error creating task');

        throw TASK_CREATION_ERROR;
      }
    }),
  //I used soft delete to avoid losing data and be able to recover it if needed in the future.
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
  }),
  edit: baseProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        description: z.string().optional(),
        active: z.boolean().optional(),
      }),
    )
    .mutation(({ input }) => {
      const task = tasks.find((task) => task.id === input.id);

      if (!task) {
        logger.error(`Task not found: ${input.id}`);
        throw TASK_NOT_FOUND_ERROR;
      }

      try {
        task.title = input.title || task.title;
        task.description = input.description || task.description;
        task.active = input.active ?? task.active;
        task.updated_at = new Date();

        logger.info(`Task updated: ${input.id}`);

        return task;
      } catch (error) {
        logger.error(error, 'Error updating task');

        throw TASK_UPDATE_ERROR;
      }
    }),
});
