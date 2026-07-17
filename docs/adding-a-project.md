# Adding a project to the content-flow system

Checklist for adding or updating a project's gallery. Assumes the content-flow system (manifest generator, `ContentBlock`/`ProjectContent` types, `ProjectContentFlow`, `DoubleSpread`) already exists — see the CRD content-flow-system brief for how it was built.

There is no `docs/asset-conventions.md` yet — the convention lives here and in `scripts/src/generate-content-manifest.ts`'s parser:

- Issue-based: `YEAR_Client_IssueID_Discipline_Descriptor_Suffix.ext`
- Campaign (no issue): `YEAR_Client_Discipline_Descriptor_Suffix.ext`
- `Suffix` is one of: `Cover`, `Cover_##` (numbered variant), `Page##`, `Spread##_PageL`/`Spread##_PageR`
- `Descriptor` is the article/feature name for multi-feature issues (e.g. `CarsOfTheYear`) — omit it for single-feature/campaign work

## Steps

1. **Drop assets locally** into `artifacts/portfolio/src/assets/new images/`, following the convention above. This folder is ignored and should stay out of Git; keep raw source drops in Drive or a local working copy. Add the client's raw filename token to `CLIENT_SLUGS` in `scripts/src/generate-content-manifest.ts` if it's a new client (and to `ISSUE_ALLOWLIST` if only specific issues are in launch scope, e.g. Kruger).

2. **Run the generator**: `pnpm --filter @workspace/scripts generate-content-manifest` (from repo root). Read its console output — it reports skipped/out-of-scope files and any parsing exceptions. It writes, per project, to `artifacts/portfolio/src/data/content/`:
   - `{slug}.json` — the draft manifest
   - `{slug}.assets.ts` — generated static imports for exactly the files that manifest references (do not hand-edit; do not use `import.meta.glob` over the asset folder instead — see the Phase 5 commit for why that balloons the build output)

   It preserves an existing `"reviewed": true` flag on rerun — it will not silently un-review a manifest.

   If it throws on an unrecognised filename pattern (e.g. a new `Spread_NN` — no `PageL`/`PageR` — variant), that's a genuine "is this a spread pair or independent pages?" question that needs a human answer, added to `SPREAD_UNDERSCORE_HANDLING` in the generator. Don't guess at it.

3. **Manual reorder** (multi-group projects only — the generator tells you if a project has more than one group): open `{slug}.json`, reorder `groups` to match actual running/printed order, then set `"reviewed": true`. Single-group projects need no action here, and the build will hard-fail if this step is skipped for a multi-group project.

4. **Wire it into the app** (`artifacts/portfolio/src/data/`):
   - `projects.ts`: import the new `{slug}.json`, add it to the `projectContent` map, add a `Project` entry to the `projects` array with `coverImage: coverPicFor("{slug}")`
   - `content-assets.ts`: import the new `{slug}.assets.ts`'s `assets` export, add it to `assetsBySlug`
   - `pages/ProjectDetail.tsx` already renders any project found in `projectContent` via `ProjectContentFlow` automatically — no per-project JSX needed there

5. **Verify visually** at `localhost:5173` (`pnpm dev`). Confirm cover placement, spread pairing, and page/group order match the manifest — not just that `pnpm build` succeeds. `pnpm build` runs `scripts/validate-content.ts` as a `prebuild` step and will fail if a multi-group manifest isn't reviewed or a block is malformed.
