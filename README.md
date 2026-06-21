# Task Manager

Task manager built with Next.js + tRPC.

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

| Script        | Description              |
| ------------- | ------------------------- |
| `pnpm dev`    | Dev server                |
| `pnpm build`  | Production build          |
| `pnpm start`  | Run production build      |
| `pnpm lint`   | Run ESLint                |
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

## Commits

Conventional Commits enforced via Husky:

- `pre-commit` → lints staged files (`lint-staged`)
- `commit-msg` → validates message format (`commitlint`)

Use `pnpm commit` for a guided prompt, or write the message manually following the convention.
