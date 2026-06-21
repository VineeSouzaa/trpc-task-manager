import { initTRPC } from '@trpc/server';

export const createTRPCContext = async (opts: { headers: Headers }) => {
  const { headers } = opts;
  const userId = headers.get('x-user-id');
  return { userId: userId ?? null };
};

const t = initTRPC
  .context<Awaited<ReturnType<typeof createTRPCContext>>>()
  .create({
    /**
     * @see https://trpc.io/docs/server/data-transformers
      */
      // transformer: superjson,
  });

export const createTRPCRouter = t.router;
export const baseProcedure = t.procedure;
