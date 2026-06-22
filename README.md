# Task Manager

Task manager built with Next.js 15 + tRPC, with full CRUD, SSR on the listing page, and infinite scroll.

## Features

- **CRUD via tRPC**: create, list, edit and soft-delete tasks, fully typed end-to-end from server to client.
- **Server-Side Rendering**: the task list is pre-fetched on the server and hydrated on the client via `@tanstack/react-query`'s `HydrationBoundary`.
- **Infinite scroll** (bonus): tasks are loaded incrementally via cursor-based pagination (`created_at`) as the user scrolls, using `useInfiniteQuery` + `IntersectionObserver`.
- **Validation**: required title enforced with Zod on both client and server.
- **Typed errors**: backend failures are thrown as `TRPCError` with semantic codes (e.g. `NOT_FOUND`) and surfaced to the user as toasts.
- **Optimistic UI**: deleting a task updates the list immediately (with rollback on failure) for instant feedback.

## Tech Stack

- [Next.js 15](https://nextjs.org/) (App Router)
- [tRPC](https://trpc.io/) + [TanStack Query](https://tanstack.com/query/latest) (`@trpc/tanstack-react-query`)
- [Zod](https://zod.dev/) for validation
- [Tailwind CSS](https://tailwindcss.com/) + [Radix UI](https://www.radix-ui.com/) primitives
- TypeScript end-to-end

## Requirements

Tool versions pinned via asdf:

| Tool | Version |
| ---- | ------- |
| Node | 26.3.0  |
| pnpm | 11.8.0  |

`asdf install` to install them.

## Run

```bash
pnpm install
pnpm dev
```

## Scripts

| Script        | Description                |
| ------------- | -------------------------- |
| `pnpm dev`    | Dev server                 |
| `pnpm build`  | Production build           |
| `pnpm start`  | Run production build       |
| `pnpm lint`   | Run ESLint                 |
| `pnpm commit` | Guided commit (Commitizen) |

## Structure

```
src/
├── app/        # Next.js routes and API
├── components/ # Shared UI
├── modules/    # Feature modules
├── trpc/       # tRPC setup and routers
└── utils/      # Shared utilities
```

## Design decisions

- **Soft delete**: deleting a task only flips its `active` flag instead of removing it from the in-memory array, so data isn't permanently lost and can be restored later (e.g. via the "Active" toggle on the edit page).
- **Cursor pagination by `created_at`**: the `list` procedure paginates using a `created_at` cursor instead of an array index/offset, so deleting a task mid-scroll never shifts or breaks the pagination window.
- **Optimistic delete**: the listing page removes a task from the cache immediately on delete, rolling back on error. Without this, the deleted item would briefly flash back in the list for an instant while the cache caught up with the server — see TanStack Query's [optimistic updates guide](https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates).
- Data is held in memory and is not persisted across server restarts.
- Data is pre-loaded on server render before being displayed; subsequent updates happen via CSR.
- **Component local css** Each primitive component with external css has it own style to keep global cleaner as possible
