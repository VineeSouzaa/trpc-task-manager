import { TasksEdit } from '@/modules/tasks/edit';
import { getQueryClient, trpc } from '@/trpc/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

export default async function EditionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(trpc.tasks.get.queryOptions({ id }));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TasksEdit id={id} />
    </HydrationBoundary>
  );
}
