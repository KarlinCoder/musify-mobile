# AGENTS.md

## Commands
- Package manager is **pnpm** (pnpm-lock.yaml; CI uses pnpm 9). Use `pnpm`, never npm/yarn.
- Dev server: `pnpm start` (or `pnpm android` / `pnpm ios` / `pnpm web`).
- No test suite. Verification is `npx tsc --noEmit` and `pnpm lint` (runs `expo lint`; no eslint config is committed, first run may scaffold one).
- Android APK: `eas build --platform android --profile production-apk` (profiles in `eas.json`).

## Architecture
- Expo SDK 57 + expo-router. Routes are in `src/app/` (not root `app/`): `_layout.tsx`, `index.tsx`, `test.tsx`. Route subfolders (`album/`, `artist/`, `charts/`, ...) are currently empty.
- Path aliases: `@/*` → `src/*`, `@/assets/*` → root `assets/*`. Brand/font files live under `src/assets/` (e.g. `src/assets/brand/`), so `@/assets/brand/...` will NOT resolve to them.
- NativeWind 5 (preview) + Tailwind v4. Custom theme tokens (`bg-background*`, `text*`, font utilities) are defined via `@theme` in `src/global.css`.
- GraphQL documents in `src/graphql/*.graphql` are imported directly as modules (babel plugin `import-graphql`; metro adds `graphql` to sourceExts).
- Result shapes (`MFTrack`, `MFAlbum`, `MFTrackPage`, ...) are ambient globals in `src/types/musify.d.ts` — no import needed.
- React Compiler is enabled (`app.json` experiments) — don't hand-roll `useMemo`/`useCallback` optimizations.

## Offline mock mode
- `src/services/deezer.service.ts` now exports standalone async arrow functions (no class) that return mock data from `mock-data.ts` (repo root) instead of hitting the Deezer API. Credentials/proxy in `src/config/` and `src/lib/deezer-client.ts` are only used when switching back to the real client.

## Gotchas
- Custom fonts: `_layout.tsx` registers `"Spotify Title"`, `"Spotify-Text"`, `"Spotify-Mono"` families, but `global.css` defines `--font-primary: "Spotify-Title"` (hyphen) — `font-primary`/`font-secondary` utilities won't match the loaded font family names.