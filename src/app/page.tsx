import { TasksList } from '@/modules/tasks/list';
import { getQueryClient, trpc } from '@/trpc/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

export default async function Home() {
  const queryClient = getQueryClient();
  await queryClient.prefetchInfiniteQuery(
    trpc.tasks.list.infiniteQueryOptions({ limit: 5 }, { getNextPageParam: (lastPage) => lastPage.cursor }),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TasksList />
    </HydrationBoundary>
  );
}
