# AGENTS.md

## Commands

- Package manager is **pnpm** (pnpm-lock.yaml; CI uses pnpm 9). Use `pnpm`, never npm/yarn.
- Monorepo (pnpm workspaces): the Expo app lives in `apps/mobile`, shared packages in `packages/*`. Run workspace commands from the repo root.
- Dev server: `pnpm start` (or `pnpm android` / `pnpm ios` / `pnpm web`) — proxies to `apps/mobile`.
- Verification: `pnpm typecheck` (`tsc --noEmit` in every workspace) and `pnpm lint` (`expo lint` in the app; no eslint config is committed, first run may scaffold one).
- Android APK: run `eas build --platform android --profile production-apk` from `apps/mobile` (profiles in `apps/mobile/eas.json`).

## Architecture

- Expo SDK 57 + expo-router. Routes are in `apps/mobile/src/app/` (not root `app/`): `_layout.tsx`, `index.tsx`, `test.tsx`. Route subfolders (`album/`, `artist/`, `charts/`, ...) are currently empty.
- Path aliases (in `apps/mobile/tsconfig.json`): `@/*` → `apps/mobile/src/*`, `@/assets/*` → `apps/mobile/src/assets/*`. Brand/font files live under `apps/mobile/src/assets/` (e.g. `src/assets/brand/`).
- NativeWind 5 (preview) + Tailwind v4. Custom theme tokens (`bg-background*`, `text*`, font utilities) are defined via `@theme` in `apps/mobile/src/global.css`.
- GraphQL documents in `apps/mobile/src/graphql/*.graphql` are imported directly as modules (babel plugin `import-graphql`; metro adds `graphql` to sourceExts).
- Result shapes (`MFTrack`, `MFAlbum`, `MFTrackPage`, ...) are ambient globals in `apps/mobile/src/types/musify.d.ts` — no import needed.
- React Compiler is enabled (`apps/mobile/app.json` experiments) — don't hand-roll `useMemo`/`useCallback` optimizations.
- Local Expo module lives in `apps/mobile/modules/expo-app-proxy`.

## Packages

- `packages/deezer-arl` — creates a temporary Deezer account (autolog) and returns its ARL. Deps: axios. Uses Node `crypto`.
- `packages/deezer-sdk` — unofficial client for Deezer's GraphQL API (pipe.deezer.com). Depends on `deezer-arl`. Regenerate types with `pnpm --dir packages/deezer-sdk codegen`.
- `packages/deezer-downloader` — downloads and decrypts tracks by ID (Node `fs`/`https`/`stream`). Depends on `deezer-sdk`.
- Packages expose TypeScript sources directly (`exports` → `./src/index.ts`); Metro transpiles them — there is no build step.

## Offline mock mode

- `apps/mobile/src/services/deezer.service.ts` exports standalone async arrow functions (no class) that return mock data from `apps/mobile/mock-data.ts` instead of hitting the Deezer API. Credentials/proxy in `apps/mobile/src/config/` and `apps/mobile/src/lib/deezer-client.ts` are only used when switching back to the real client.

## Gotchas

- Custom fonts: `_layout.tsx` registers `"Spotify Title"`, `"Spotify-Text"`, `"Spotify-Mono"` families, but `global.css` defines `--font-title: "Spotify-Title"` (hyphen) — `font-title`/`font-secondary` utilities won't match the loaded font family names.
