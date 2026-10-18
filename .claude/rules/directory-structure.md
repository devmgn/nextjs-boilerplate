# Directory Structure Rules

## Principles

1. Colocate route-specific code under `app/`; classify shared code by kind directly under `src/`
2. No domain-named directories
3. Do not add top-level directories

## `src/` Top Level

Top-level entries fall into **3 layers**:

- **Contract**: regenerable code that follows an external spec (`api/`, `types/`)
- **Generic**: UI / logic portable outside this project (`components/`, `hooks/`, `utils/`)
- **App-specific**: this app's config, integrations, and glue (`lib/`, `providers/`, `mocks/`, `env.ts`, `proxy.ts`, `instrumentation-client.ts`)

| Path | Layer | Role |
| --- | --- | --- |
| `app/` | - | Next.js App Router |
| `api/` | Contract | Orval output (`api/openapi/`, gitignored, see `api.md`) + its mutator (`api/api-client/`) |
| `types/` | Contract | Type helpers and global type augmentations (incl. `.d.ts`) |
| `components/` | Generic | UI components |
| `hooks/` | Generic | React hooks |
| `utils/` | Generic | Logic portable outside this project |
| `lib/` | App-specific | App-specific config, integrations, and glue |
| `providers/` | App-specific | Context providers wrapping the whole app |
| `mocks/` | App-specific | MSW server for Vitest + adapter turning Orval fixtures into MSW handlers (see `mocks.md`) |
| `env.ts` | App-specific | Typed environment variables |
| `proxy.ts` | App-specific | Next.js Proxy (formerly middleware) |
| `instrumentation-client.ts` | App-specific | Next.js client instrumentation hook |

Import direction between layers (e.g. generic code must not import app-specific code) is enforced by `boundaries` in `fallow.toml`. `requireAllFiles` makes every file under `src/` belong to a zone, so a new top-level entry also needs a zone and rules there.

## `utils/` vs `lib/`

Decide by **portability**, not by side effects.

- `utils/`: works unchanged in another project. Depending on standard APIs (`setTimeout`, `AbortController`, `process.env`, `window`, ...) is fine
- `lib/`: tied to this app — e.g. `QueryClient` config, proxy middleware, the Web Vitals destination, shared styles

Rules of thumb:

- Would it work after `cp -r` into another project? Yes → `utils/`, no → `lib/`
- Does it depend on app-specific config values, endpoints, token names, or the logger implementation? Yes → `lib/`

## Naming

**All files and directories are kebab-case**, regardless of role.

| Kind | Example |
| --- | --- |
| Component | `components/loading-overlay/loading-overlay.tsx` |
| Feature entrypoint | `hooks/use-media-query/use-media-query.ts` |
| Grouping | `utils/is/is-key-of/` |
| Companion file | `button.stories.tsx` / `button.test.tsx` / `use-toggle.test-d.ts` |

Exported identifiers keep their usual casing (PascalCase components, `useXxx` hooks, camelCase functions). **File names need not match identifiers.**

```
components/loading-overlay/loading-overlay.tsx   →  export function LoadingOverlay()
hooks/use-media-query/use-media-query.ts         →  export function useMediaQuery()
```

Enforced by Oxlint: `unicorn/filename-case` rejects camelCase and PascalCase, `github/filenames-match-regex` rejects a leading capital and more than two dot-separated segments.

Exceptions: generated code (`src/api/openapi/**`, excluded via `ignorePatterns`) and Next.js convention files (already lowercase).

## One Feature, One Directory

Every feature — component, hook, function, query, mutation, ... — is **one directory + `index.ts`**. Do not place a lone file directly in a grouping directory (e.g. `form/field.tsx`).

Why: it removes the "promote a file to a directory" refactor when a feature grows, and leaves nothing to decide. Bundle only closely related features under a grouping directory.

Whether a directory has an `index.ts` defines its role:

- **Feature entrypoint**: exposes a function / object / provider from `index.ts`
- **Grouping**: bundles several features and has **no** `index.ts` (no barrels)

```
utils/
  debounce/                  # feature entrypoint
    debounce.ts
    index.ts
  is/                        # grouping (no index.ts)
    is-function/
      is-function.ts
      index.ts
    is-key-of/
    is-value-of/

lib/
  get-query-client/          # feature entrypoint
    get-query-client.ts
    index.ts
    config/                  # internal to get-query-client
      query-client-config.ts
  proxy/                     # grouping
    add-custom-header/
    request-logger/
    response-logger/

components/
  card/                      # feature entrypoint
    card.tsx
    index.ts
  form/                      # grouping (no index.ts)
    field/
      field.tsx
      field.stories.tsx
      index.ts
    input/
    label/

hooks/
  use-debounced-callback/    # feature entrypoint
  storage/                   # grouping
    use-local-storage/
    use-session-storage/
    use-web-storage/
    utils/                   # utils local to the group
      web-storage-store/
```

Files that are not features stay flat: global declarations (`types/*.d.ts`), stylesheets (`lib/styles/`), and the MSW setup (`mocks/`).

### Local `utils/`

A component, hook, or group may keep its internals in a `utils/` subdirectory. It is a grouping directory (no `index.ts`); each feature inside follows the one-directory rule.

```
components/
  loading-overlay/
    loading-overlay.tsx
    index.ts
    utils/                   # grouping (no index.ts)
      loading-store/         # feature entrypoint
        loading-store.ts     # factory
        index.ts             # creates the instance
```

## Colocation under `app/`

Route-specific code goes in underscore-prefixed private folders, split by kind, one feature per directory.

```
app/
  posts/
    _components/
      post-card/
        post-card.tsx
        index.ts
    _hooks/
      use-post-form/
    _lib/
      post-validator/
    _actions/
      create-post/
        create-post.ts         # "use server"
        index.ts
    page.tsx
  (settings)/
    _providers/
      settings-provider/
    _components/
      settings-nav/
    account/
      page.tsx
```

- The `_` prefix is required (opts the folder out of routing)
- Kinds: `_components/` `_hooks/` `_lib/` `_utils/` `_providers/` `_actions/`
- Works inside route groups `(group)`
- Route directory names are kebab-case (URL convention)
- Only Next.js convention files (see `app-router.md`) sit flat in a route directory. Everything else — schemas, actions, components, hooks — goes in a kind folder as one directory + `index.ts`
- **Keep action-specific validators and helpers inside `_actions/<name>/`.** Move a helper to `_lib/` only once 2 or more actions actually share it

## Route-Specific vs Shared

- Always start in `app/<route>/_*`
- Promote to `src/*` once a second route **actually** uses it (promoting up front is fine if the same PR adds the second use)
- No speculative promotion. While only one route uses it, it stays in `app/`

## Where Providers Go

| Used by                          | Location                  |
| -------------------------------- | ------------------------- |
| The whole app (`app/layout.tsx`) | `src/providers/`          |
| Multiple route groups            | `src/providers/`          |
| A single route group             | `app/(group)/_providers/` |
| A single route                   | `app/<route>/_providers/` |
