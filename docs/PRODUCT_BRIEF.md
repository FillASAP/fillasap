# Product brief

Fill ASAP records and replays browser flows for developers: logging in, filling a long form, creating an order, reproducing a bug. The browser extension owns the user's data. The website at [fillasap.ai](https://fillasap.ai) is the extension's UI.

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
3. The extension popup shows how many workspaces are stored and links to the website.

The website never stores the user's data and never sends it anywhere: it reads it from the extension in the visitor's own browser.

## Out of scope for now

Recording, replaying, and editing. The current milestone is read-only; see [MILESTONES.md](MILESTONES.md).

## Platforms

Chromium-based browsers with Manifest V3 (Chrome, Edge, Brave). Firefox and Safari are not planned yet.
