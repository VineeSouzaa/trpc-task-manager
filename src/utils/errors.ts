import { TRPCError } from '@trpc/server';

export const TASK_NOT_FOUND_ERROR = new TRPCError({ code: 'NOT_FOUND', message: 'Task not found' });
export const TASK_DELETION_ERROR = new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to delete task' });
export const TASK_CREATION_ERROR = new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create task' });
export const TASK_UPDATE_ERROR = new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to update task' });
