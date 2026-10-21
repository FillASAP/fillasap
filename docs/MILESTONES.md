# Milestones

## M0: Bootstrap, detection, and read-only explorer

The monorepo, its quality gates, and the first vertical slice: the website detects the extension and shows its data.

Acceptance (all automated, run by `vp run verify`):

- [x] Without the extension, the website shows the install banner with a link to the install guide (`tests/e2e/install-banner.spec.ts`).
- [x] With the extension and seeded data, the website shows each workspace with its environments, flows, fragments, datasets, and suites (`tests/e2e/explorer.spec.ts`).
- [x] With the extension and no data, the website shows an empty state instead of the banner (`tests/e2e/explorer.spec.ts`).
- [x] A page on another origin cannot get an answer from the extension by posting bridge messages to the website's window (`tests/e2e/origin-guard.spec.ts`).
- [x] The production build ships a CSP and loads without violations (`tests/e2e/install-banner.spec.ts`).
- [x] The production manifest runs the content script only on `https://fillasap.ai/*`, `https://fillasap.dev/*`, and `https://fillasap.io/*`, and asks only for `storage` (`vp run test:extension-manifest`).
- [x] Every gate in [AGENTS.md](../AGENTS.md#rules) runs in `vp run verify`, locally and in CI.

Manual, once per release of the extension:

- [ ] Load `apps/extension/.output/chrome-mv3` unpacked in Chrome, open fillasap.ai, and see the empty state.

## Next

- M1: record actions in the browser and save them to a workspace.
- M2: replay a flow with a dataset.
- Publish the extension to the Chrome Web Store, and point the install banner at the listing.
