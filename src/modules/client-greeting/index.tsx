'use client';

import { useTRPC } from '@/trpc/client';
import { useQuery } from '@tanstack/react-query';

interface ClientGreetingProps {
  text: string;
}

export function ClientGreeting({ text }: ClientGreetingProps) {
  const trpc = useTRPC();
  const greeting = useQuery(trpc.hello.queryOptions({ text }));
  if (!greeting.data) return <div>Loading...</div>;
  return <div>{greeting.data.greeting}</div>;
}
