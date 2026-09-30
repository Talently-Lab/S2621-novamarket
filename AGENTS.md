# AGENTS.md — NovaMarket (S2621)

> Agent instructions. Loaded by Claude Code, Codex, OpenCode, Cursor, and any agentic tooling the team uses, so every assistant works under the same conventions. Read this before editing, committing, or opening a PR.

## 1. Project context

NovaMarket is an e-commerce MVP built as an 8-week simulated collaborative project (Talently Lab, grupo S2621).

**Brand & identity.** NovaMarket is a small technology retailer that today sells through social networks and third-party marketplaces. This project builds its own web sales channel. Visual identity and brand assets are owned by the UX/UI role (§9).

**MVP scope — included:** user registration, login, product catalog, category filtering, product detail, shopping cart, simulated checkout, purchase confirmation, admin login, product CRUD, basic order visualization.

**Out of scope** unless explicitly approved: real payment gateway, shipping management, external integrations, native/mobile app.

**Monorepo & stack:**

- `/frontend`: React 18, Vite 8, Tailwind 3, React Router 6, axios, lucide-react (JavaScript, no TypeScript).
- `/backend`: Node + Express + MongoDB (not scaffolded yet, `backend/` is empty).
- Long-lived branches: `main` (production) + `develop` (integration/QA). Both protected. PRs are mandatory.

**Frontend layout:** `src/pages/` (one file per route: Home, Products, ProductDetail, Cart, Checkout, Login, Register, Admin, NotFound), `src/routes/AppRouter.jsx` (route table), `src/components/`, `src/context/`, `src/hooks/`, `src/services/api.js` (axios, `baseURL` from `VITE_API_URL`).

## 2. Naming

One token ties Trello cards, branches, and PR titles together for traceability.

- Card / PR title: `<ÁREA>-<NNN>-S<N> | <descripción>`
- ÁREAS: `FRONT`, `BACK`, `UX`, `QA`, `PM`; `S<N>` = sprint number.
- Example: `QA-002-S2 | Pruebas de registro y validaciones.` · `UX-001-S1 | Definir alcance UX/UI y arquitectura base del MVP`.

Branches slugify the same token: `<área>/<NNN>-s<N>-<slug>`, e.g. `qa/002-s2-registro-validaciones`.

The board also shows a looser weekly-planning form (`FRONT-SP3-…`, `BACK-SP3-…`, `QA-SP3-…`) for sprint-level planning cards. Prefer the `<ÁREA>-<NNN>-S<N>` form for deliverable cards.

Not every PR maps 1:1 to a card (some map to none, some to several). The token's job is correlation (PR ↔ Trello ↔ docs), not a hard 1:1.

## 3. Code standards

- Package manager: **npm** only (`package-lock.json`). Never `bun`, `yarn`, or `pnpm`.
- Node `20.19`+ (`.nvmrc` = `20.19`; `frontend` `engines` `>=20.19`).
- Lint/format: ESLint + Prettier + `eslint-config-prettier` (Prettier runs last, no rule clashes).
- Prettier: single quotes, semicolons, 2-space indent, `endOfLine: auto`.
- JSX for React components. No TypeScript in `frontend/`.

## 4. Commits, branches, PRs

- Conventional commits: `type(scope): description` — `feat(front): add login`, `fix(back): auth`, `ci: quality gates`.
- Scopes: `front` / `back` for code; UX adds `ux`, `ui`, `design-system`, `prototype`, `qa`, `case-study`, `research`, `assets` (§9).
- One commit = one responsibility.
- No AI attribution and no forensic trailers (no `Worktree:`/`Session:`/`Co-Authored-By:`). Commits read as human-authored.
- PRs target **`develop`**, not `main`. Squash-merge on completion.
- Rebase onto `origin/develop` before opening a PR; resolve conflicts there, never drag in upstream commits.
- After rebase, `git push --force-with-lease` (never `--force`).

## 5. Quality gates (do not bypass)

The repo enforces gates on commit and push. Agents must run them, never skip or disable them.

| Gate             | When                        | What                                                      |
| ---------------- | --------------------------- | --------------------------------------------------------- |
| husky pre-commit | every commit                | lint-staged: ESLint `--fix` then Prettier on staged files |
| husky pre-push   | push touching `frontend/`   | `format:check` → `lint` → `build`                         |
| CI               | PR/push to `develop`/`main` | `format:check` → `lint` → `build` (Node 20 and 22)        |

Commands:

```bash
npm install                  # root: activates husky
cd frontend && npm install   # frontend deps
npm run format:check
npm run lint
npm run build
```

## 6. Docs — single source of truth

- **Repo** = technical docs: READMEs, code conventions, this file.
- **Google Drive** = project docs: contracts, acceptance criteria, minutas, roadmap.
- Link from one to the other; never copy the same doc into both places.

## 7. Communication

- **Discord** = announcements/avisos only (merges, deploys, "test this now").
- **Trello card** = details, errors, suggestions, decisions. Put the substance on the card, not in Discord.

## 8. Environments

| Branch    | Role                                                |
| --------- | --------------------------------------------------- |
| `develop` | primary QA environment (test data)                  |
| `main`    | production (stable) + reduced E2E set (manual data) |
| PR branch | may be tested before merge                          |

There is no `staging` branch. Announce merges on Discord so QA does not test a stale build.

## 9. Role conventions — UX/UI

Owned by the UX/UI role. Tool-agnostic rules; the role's full Codex operational playbook stays a separate working doc.

**Source hierarchy** (authority order when requirements conflict):

1. Official NovaMarket brief + final-delivery requirements.
2. Official role deliverables.
3. Weekly checkpoints.
4. UX/UI roadmap.
5. Other-role roadmaps (dependency context only).
6. Team research, decisions, documentation.
7. Ideas, suggestions, assumptions.

When sources conflict, do not silently pick one: identify the conflict, prefer the higher authority, and record the unresolved issue.

**Tools, one role each:**

- Repo = research, evidence, decisions, UX requirements, case-study source.
- Figma = wireframes, UI, components, Design System, prototype (visual source of truth).
- Trello = operational task status (card titles/descriptions in Spanish).
- Clockify = time tracking (task names/descriptions in Spanish).
- Typst = technical report + case study (`docs/technical-report/`).

**Deliverables:** navigable Figma prototype of the purchase funnel; UI Kit/Design System (purchase buttons, product cards at minimum); Proto-Persona; User Flows; design decision records; final case study.

**Traceability IDs:** `OBS-###` observation, `INS-###` insight, `NEED-###` need, `REQ-###` requirement, `HYP-###` hypothesis, `DEC-###` decision, `TEST-###` usability finding, `ISSUE-###` open issue; operational work items use `UX-###`.

**Evidence discipline:** never invent interviews, quotes, metrics, analytics, or test results. Distinguish fact / source / assumption / hypothesis / interpretation. A Proto-Persona is a hypothesis unless supported by research.

**Figma principles:** reusable components + Auto Layout; document states (default, hover, focus, active/selected, disabled, loading, error, empty, success); design responsive behavior intentionally.

**Accessibility** is part of product quality: contrast, visible labels, focus states, keyboard navigation, touch target size, error identification, status feedback, semantic hierarchy, readability, responsive behavior.

**Critical flow** (priority): Home/Catalog → product detail → add to cart → cart → authentication if required → checkout → order confirmation. Secondary work must not compromise this flow.

## 10. Per-folder conventions

`/frontend` and `/backend` may add their own `agents.md` with folder-specific rules. Role conventions (like UX/UI above) live in this root file, not in a separate folder. Folder- and role-level files extend, never contradict, this file.
