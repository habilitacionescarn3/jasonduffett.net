# jasonduffett.net

Monorepo for `jasonduffett.net` — infrastructure and blog.

## Packages

- `packages/cdk` — AWS CDK app managing the domain, DNS, and hosting infrastructure.
- `packages/site` — the blog and landing site.

## Scripts

- `npm run build` — build all packages (via Nx).
- `npm run typecheck` — typecheck all packages.
- `npm test` — run tests across all packages.
- `npm run lint` / `npm run lint:fix` — ESLint across the repo.
- `npm run format` / `npm run format:check` — Prettier across the repo.
- `npm run verify` — format check, build, lint, and test (CI parity).
