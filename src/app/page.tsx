import { ClientGreeting } from '@/modules/client-greeting';
import { getQueryClient, trpc } from '@/trpc/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

export default async function Home() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(
    trpc.hello.queryOptions({
      text: 'world test',
    }),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ClientGreeting text="world test 2sdsd" />
    </HydrationBoundary>
  );
}
