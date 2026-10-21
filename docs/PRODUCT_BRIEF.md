# Product brief

Fill ASAP records and replays browser flows for developers: logging in, filling a long form, creating an order, reproducing a bug. The browser extension owns the user's data. The website at [fillasap.ai](https://fillasap.ai) is where the user manages that data; from M1, the extension's side panel works on the page open in the current tab ([Surfaces](#surfaces)).

## Concepts

| Concept                  | Meaning                                                                                                   |
| ------------------------ | --------------------------------------------------------------------------------------------------------- |
| **Workspace**            | The context of one application: its environments (name and base URL), URLs, and settings.                 |
| **Flow**                 | A sequence with one goal, such as creating an order or reproducing a bug.                                 |
| **Fragment**             | A smaller, reusable sequence, such as logging in, that flows include as one step.                         |
| **Action**               | One atomic operation (navigate, click, fill, select, wait, assert), either recorded or entered by hand.   |
| **Variables & Datasets** | A flow declares variables; a dataset holds rows of values, so the same flow runs with different data.     |
| **Suite**                | A group of flows by feature, domain, or task. It is only an organization: it has no test-suite semantics. |

Every flow, fragment, action, dataset, and suite belongs to exactly one workspace. Flows reference actions and fragments by id, so editing a fragment changes every flow that uses it.

## The website and the extension

1. A visitor opens fillasap.ai (or a local dev server).
2. The website asks whether the extension is installed.
   - **Missing:** it shows a banner explaining what the extension does, with a link to the install guide.
   - **Installed:** it reads the extension's data and shows each workspace with its environments, flows (with their steps and variables), fragments, datasets, and suites.
   - **Installed but empty:** it says there are no workspaces yet, rather than asking to install.
   - **Installed but unreadable** (for example, stored data from an incompatible version): it shows the reason.
3. The extension popup shows how many workspaces are stored and links to the website (until the side panel replaces it).

The website never stores the user's data and never sends it anywhere: it reads it from the extension in the visitor's own browser.

## Surfaces

M0 has two surfaces: the website and the toolbar popup. Recording and replaying (M1, M2) happen in the user's own application, in a tab the website cannot see or control, so the extension gets a side panel: it opens beside the page and stays open while the user clicks and navigates, which a popup cannot do (it closes on the first click in the page).

| Surface           | Job                                                     | Sees                               |
| ----------------- | ------------------------------------------------------- | ---------------------------------- |
| Side panel        | Work on the current tab: record, replay, quick edits    | The workspace that matches the tab |
| Website           | Manage everything: browse, organize, and edit at length | Every workspace                    |
| Toolbar icon      | Opens the side panel                                    |                                    |
| Keyboard shortcut | Opens the side panel; starts and stops a recording      |                                    |

Rule of thumb: the side panel handles one item at a time, in the context of the open tab; the website handles many items at once, or items that need no tab.

### Side panel

- **Context.** The panel picks the workspace whose environment base URL matches the current tab, and shows which environment it is. When none matches, it offers to create a workspace for the tab's origin. The user can switch workspaces by hand.
- **Record.** Start, pause, and stop. Steps appear as they are recorded; the user can delete or reorder a step, turn a typed value into a variable, and add a wait or an assertion, then save the steps as a new flow or fragment.
- **Run.** Pick a flow (search, recent, or by suite), an environment, and a dataset row or typed values. Run it whole or step by step, and see each step's progress and where it failed.
- **Library: simplified management.** The flows, fragments, datasets, and suites of the current workspace, with quick edits:
  - rename, duplicate, and delete an item, and move a flow between suites;
  - edit a flow's or fragment's steps in the same editor used while recording;
  - edit one dataset row, or add one, through a form.
- **Open on fillasap.ai.** The workspace and every item have a shortcut that opens the same item on the website in a new tab, for anything beyond a quick edit.

### Website

What needs room or several items at once stays on the website:

- all workspaces side by side, and workspace settings (environments, base URLs);
- datasets as tables: bulk edits, and CSV or JSON import and export;
- organizing suites;
- fragments: extracting steps into a fragment, and seeing which flows use it;
- exporting and importing a workspace, as a backup or to move to another browser.

Editing on the website comes after M2; until then it stays read-only and the side panel is where data changes.

### Popup

The popup goes away when the side panel ships: Chrome opens either a popup or the side panel on an icon click, not both, and the side panel covers what the popup shows today.

### Data across surfaces

- The extension stays the only store. The side panel is an extension page, so it reads and writes through the background directly, without the bridge.
- Editing on the website needs write messages on the bridge, which widens the [security model](ARCHITECTURE.md#security-model); each one follows the `adding-a-bridge-message` checklist.
- Both surfaces can be open at once, so neither may show stale data: the side panel follows storage changes, and the website needs a change notification from the content script (a new bridge message).
- The side panel and the website are both Preact. Sharing components between them needs a new package (for example `packages/ui`), an architecture change decided when the side panel is built.

## Out of scope for now

Recording, replaying, and editing. The current milestone is read-only; see [MILESTONES.md](MILESTONES.md).

## Platforms

Chromium-based browsers with Manifest V3 (Chrome, Edge, Brave). Firefox and Safari are not planned yet.
