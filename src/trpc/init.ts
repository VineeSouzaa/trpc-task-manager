import { initTRPC } from '@trpc/server';
import SuperJSON from 'superjson';

export const createTRPCContext = async (opts: { headers: Headers }) => {
  const { headers } = opts;
  const userId = headers.get('x-user-id');
  return { userId: userId ?? null };
};

const t = initTRPC.context<Awaited<ReturnType<typeof createTRPCContext>>>().create({
  transformer: SuperJSON,
});

export const createTRPCRouter = t.router;
export const baseProcedure = t.procedure;
