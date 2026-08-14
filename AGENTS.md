# AGENTS.md

Working guide for this repository: how it is laid out, how to build and verify it, and the
conventions that changes are expected to follow. See `README.md` for the consumer-facing API
documentation.

## Project overview

`@multiversx/sdk-dapp-swap` is a React library providing hooks, components, and utilities for
implementing token swapping (and EGLD wrap/unwrap) on the MultiversX blockchain via the xExchange
GraphQL service. It is published to npm as both ESM and CommonJS builds.

There is no runnable app in this repository — consumers integrate the exported hooks and components
into their own React dApps. The only way to exercise the library end to end is to publish it into a
consuming app (see [Verifying a change](#verifying-a-change)).

## Setup

- **Node >= 24** and **pnpm** (the repository ships `pnpm-lock.yaml`; CI runs `pnpm install --frozen-lockfile`).
- `pnpm install` — install dependencies.

The `scripts` in `package.json` are written with `npm run`, but `pnpm <script>` works identically and
is what CI uses.

## Commands

| Command | Purpose |
| --- | --- |
| `pnpm build` | Full build: clean `dist/`, emit per-module ESM (`build:esm`) and CJS (`build:cjs`) via `tsc` + `tsc-alias`, copy `package.json` + `README.md` into `dist/`. |
| `pnpm start` / `pnpm watch` | `tsc --watch` + `tsc-alias --watch` for local development. |
| `pnpm test` | Jest test suite (jsdom + `@swc/jest`). |
| `pnpm test:watch` | Jest watch mode. |
| `pnpm lint` | ESLint over `src/`. |
| `npx jest src/utils/tests/canParseAmount.test.ts` | Run a single test file. |
| `npx jest -t "partial test name"` | Filter tests by name. |
| `pnpm lint --fix` | Apply ESLint and Prettier fixes. |

`pnpm build` is the primary correctness gate — it runs a full `tsc` typecheck over `src/` for both
output targets. Test coverage is thin, so a green test run alone does not mean a change is safe.

Publishing scripts (`publish-package`, `publish-package-next`, `publish-yalc`, `publish-verdaccio`)
build from and publish the `dist/` folder, never the repository root.

## Architecture

The library is a thin, opinionated layer over an Apollo GraphQL client talking to xExchange. The data
flow is: **`SwapAuthorizationProvider` (Apollo client + auth)** → **hooks (issue GraphQL queries,
compute swap state)** → **`SwapForm` / `TokenSelect` components**.

- **`src/components/SwapAuthorizationProvider`** — the required root wrapper. Builds the
  `ApolloClient` (HTTP link + `graphql-ws` subscription link split by operation type, auth middleware
  injecting the `Bearer` token and optional `getAuthorizationHeaders`, error link) and exposes it via
  React context (`useAuthorizationContext`). Everything else assumes this provider is mounted. WS
  subscriptions (e.g. token price) use `graphql-ws`, not the deprecated `subscriptions-transport-ws`.

- **`src/hooks`** — the main API surface. `useSwapRoute` is the core: it polls the swap/wrap/unwrap
  GraphQL queries (`POLLING_INTERVAL`) to compute a route and build the raw transaction. The other
  hooks (`useFilteredTokens`, `useSwapInfo`, `useSwapFormHandlers`, `useRateCalculator`,
  `useWrapEgld`, `useUnwrapEgld`, `useTokenPriceSubscription`) compose around it. `useQueryWrapper` /
  `useLazyQueryWrapper` wrap Apollo's `useQuery` / `useLazyQuery` and pause polling when the page is
  hidden (`useIsPageVisible`).

- **`src/queries`** — GraphQL documents (`gql`) and their TS response types, grouped by domain
  (`tokens`, `swap`, `wrapping`, `settings`, `attributes`). `attributes` holds shared GraphQL field
  fragments (e.g. `esdtAttributes`) interpolated into query strings to keep selected fields
  consistent.

- **`src/lib`** — the single boundary to MultiversX SDK packages. Re-exports a curated subset of
  `@multiversx/sdk-core` (`sdkCore.ts`), `@multiversx/sdk-dapp` (`sdkDapp/`), and
  `@multiversx/sdk-dapp-utils` (`sdkDappUtils.ts`). **Always import SDK symbols from `lib`, never
  directly from the SDK packages** — this isolates upgrades and keeps the dependency footprint
  controlled.

- **`src/utils`** — pure functions for swap math and formatting (price impact, minimum received,
  fees, dust handling, amount formatting/rounding). Unit-tested under `src/utils/tests`.

- **`src/validation`** — Formik/yup validation. `hooks/useSwapValidationSchema` produces the schema
  (insufficient balance, minimum amount, too many decimals, …) consumed by `SwapForm`. Individual
  rules live in `rules/` as plain `{ name, message, test }` objects and are composed onto a schema by
  `utils/applyValidationSchemaRules`.

- **`src/types`**, **`src/constants`** — shared types and constants (`FIXED_INPUT` / `FIXED_OUTPUT`
  swap modes, `EGLD_IDENTIFIER`, `DIGITS`, `MIN_EGLD_DUST`, `POLLING_INTERVAL`).
  `SwapGraphQLAddressEnum` enumerates the environment GraphQL endpoints.

## Conventions

- **Absolute imports** resolve from `src/` (tsconfig `baseUrl: ./src`, Jest `moduleDirectories`).
  Import as `from 'hooks'`, `from 'lib'`, `from 'types'`, `from 'utils'` — not relative `../../` paths
  across top-level folders.
- Each folder re-exports through an `index.ts`. New hooks/utils/queries must be added to their
  folder's `index.ts`. The top-level public API is curated in `src/index.tsx` and intentionally
  exposes only a small subset.
- Consumers may import from either the barrel (`@multiversx/sdk-dapp-swap/hooks`) or the specific
  file (`@multiversx/sdk-dapp-swap/hooks/useSwapRoute`) for tree-shaking. Keep per-file exports
  intact so both continue to work.
- Two TS build configs: `tsconfig.json` (ESM, also the base config) and `tsconfig.cjs.json` (extends
  it, `module: CommonJS`, emits to `dist/__commonjs`). `tsc` does the production transpile (one file
  per module) and `tsc-alias` resolves path aliases. SWC (`.swcrc`) is used only by `@swc/jest` for
  the test transpile, never for the build.
- Adding a new top-level folder under `src/` requires no build config change — the `"*": ["*"]` path
  mapping and `tsc-alias` resolve any new `baseUrl`-relative import automatically.

## Code style

ESLint 9 flat config lives in `eslint.config.mjs`. Prettier (`.prettierrc`) runs through
`eslint-plugin-prettier`, so formatting violations surface as lint errors and `pnpm lint --fix`
resolves them.

There is no git hook — lint is not enforced on commit, so run `pnpm lint` before opening a PR.

`react-hooks/exhaustive-deps` is deliberately set to `warn`. Several hooks omit dependencies on
purpose (polling loops, one-shot effects) and there is no test coverage that would catch a
behavioural regression from "fixing" them. Do not bulk-apply its suggestions; address individual
cases only with a specific reason.

## Testing

- Tests live in `tests/` subfolders next to the code (e.g. `src/utils/tests/`,
  `src/validation/hooks/tests/`) or as `*.test.ts(x)` / `*.spec.ts(x)`.
- `src/setupTests.js` registers `@testing-library/jest-dom` and stubs `window.matchMedia` /
  `window.scrollTo`.
- `src/__mocks__/accountConfig.ts` holds shared fixtures. There is no network-mocking layer — MSW was
  removed as unused; add `msw@^2` back if request-level mocks are ever needed.
- Test files and `__mocks__` are excluded from `tsconfig.json`, so ESLint lints them without type
  information (see the last block in `eslint.config.mjs`).
- Prefer tests that pin behaviour which types cannot express — validation rule outcomes, swap math,
  amount parsing. `src/validation/hooks/tests/useSwapValidationSchema.test.ts` is the model: it
  asserts the exact rejection messages the form relies on.

## Build output & downstream bundler compatibility

The build emits **per-module** output (one file per source module) for both targets, via `tsc` +
`tsc-alias` — no bundling, no code-splitting, no shared chunks. ESM goes to the `dist/` root
(`tsconfig.json`, `module: ESNext`), CJS to `dist/__commonjs/` (`tsconfig.cjs.json`,
`module: CommonJS`); `dist/package.json` maps `module` → root and `main` → `./__commonjs`. This is
the same shape `@multiversx/sdk-dapp` and `sdk-dapp-utils` ship, which Vite's dependency pre-bundler
optimizes cleanly — so consumers (e.g. `mx-wallet-dapp`) need **no**
`optimizeDeps.exclude` / `include` workarounds for this package.

Path-alias resolution is the load-bearing detail: source uses `baseUrl`-relative bare imports
(`from 'utils'`, `from 'queries'`, …). `tsconfig.json` adds `"paths": { "*": ["*"] }` so `tsc-alias`
rewrites those to plain relative specifiers (`../utils`) in both `.js` and `.d.ts` output, while
leaving real externals (`react`, `@apollo/client`, `@multiversx/*`) untouched. Without `tsc-alias`
the bare aliases leak into `dist` and break resolution in consumers. To check:

```bash
grep -rE "from '(utils|hooks|queries|types|lib|constants|validation|components)'" dist
```

This must return nothing after a build.

**History** — the build previously used esbuild with `bundle: true` + `splitting: true`, which
produced `__chunks__/*.js` that Vite could not re-bundle (`init_chunk_* is not defined` at runtime),
forcing an `optimizeDeps.exclude` cascade in consumers. Within esbuild, `minify: false` and removing
the `node-stdlib-browser` shim did not help; `splitting: false` fixed it but bloated ESM ~43×
(≈166 KB → ≈7.25 MB); `bundle: false` leaked the path-alias imports. The `tsc` + `tsc-alias` approach
avoids all of these (ESM JS payload ≈100 KB across ~100 modules). Polyfilling node builtins is the
consumer bundler's job — the old shim was a library anti-pattern.

## Dependencies

- **`peerDependencies` are the public contract.** Widening them is a minor change; narrowing or
  bumping a major (e.g. `@apollo/client` 3 → 4, `@multiversx/sdk-core` 15 → 16) breaks consumers and
  requires a major release of this package. Keep `devDependencies` resolving inside the peer ranges
  so local builds match what consumers get.
- `@multiversx/sdk-core` and `@multiversx/sdk-dapp` move together: `sdk-dapp` declares its own peer
  range for `sdk-core`, so `sdk-core` cannot be bumped past what `sdk-dapp` supports.
- Transitive dependencies with advisories that upstream has not yet patched are pinned through
  `overrides` in `pnpm-workspace.yaml`. Every entry is bounded to the major already present in the
  tree so an override can never move a package across a breaking release. The block documents why
  `uuid` is deliberately left alone.
- Verify with `pnpm audit` and `pnpm peers check` after any dependency change.

## Verifying a change

Run in order; each one catches something the previous does not:

1. `pnpm install` — no new unmet peer warnings (`pnpm peers check` to inspect).
2. `pnpm build` — the real gate: a full typecheck of `src/` for both targets. Then confirm no bare
   path aliases leaked into `dist/` (see the grep above).
3. `pnpm test`.
4. `pnpm lint` — must be free of errors; warnings are expected.
5. `pnpm audit` — no new advisories.
6. **Downstream smoke test, required before publishing:** `pnpm publish-yalc` from this repository,
   then run `mx-wallet-dapp`'s `pnpm start-devnet` and confirm the swap flow loads with no console
   errors and without any `optimizeDeps` workaround. This is the only end-to-end check that the
   library behaves in a real bundler and a real app.

## Releasing

- `development` is the integration branch; `main` is the release branch.
- Bump `version` in `package.json` and add a matching entry at the top of `CHANGELOG.md` (Keep a
  Changelog format, newest first, linking the PR). Version numbers follow semver against the
  **consumer-visible** surface: `src/index.tsx`, the subpath exports, and `peerDependencies`.
- `.github/workflows/sdk-dapp-swap-publish.yml` publishes from `dist/` on manual dispatch
  (`workflow_dispatch`): install → build → test → publish, with `--tag next` for prereleases. Nothing
  runs automatically on push or pull request, so verification is the author's responsibility.
