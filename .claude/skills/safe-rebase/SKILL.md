---
name: safe-rebase
description: >-
  Rebase the current worktree branch onto origin/main safely when working in a
  multi-worktree environment. Use this whenever the user says "rebase", "rebase
  onto main", "bring this branch up to date", or before opening/updating a PR
  that may have fallen behind main while other PRs were landing. The skill's
  defining purpose is catching dropped content — symbols, functions, constants —
  that a naive rebase would silently remove because another concurrent PR added
  them to main after this branch was cut.
---

# Safe Rebase

This project frequently runs multiple worktrees and PRs in parallel. The risk:
a worktree is cut from main at commit X, another PR merges first and adds new
code to a shared file (e.g. `app.jsx`), then this branch rebases — and git's
conflict resolution, or Claude's resolution, drops the code that the other PR
added. The dropped code shows up nowhere in the diff and is only caught when
someone notices the feature is gone.

This skill makes every rebase a verified operation, not a blind one.

## Workflow

### 1. Capture the pre-rebase baseline

Before touching anything, record what's currently in the files this branch
modifies, and what's on main that this branch doesn't yet have.

```sh
git fetch origin main

# Which files does this branch touch?
git diff --name-only origin/main...HEAD

# What has main gained in those files since this branch was cut?
git log --oneline HEAD..origin/main   # commits on main not on this branch
git diff HEAD...origin/main -- <each changed file>   # net diff in those files
```

Read that last diff carefully. You are looking for **symbols this branch does
not define** — constants, functions, object keys — that main has added. Write
them down. These are your canary list: they must survive the rebase.

Example canaries from a real incident: `GS_CLINCH`, `bestThird`, `matchClinch`,
`lastGroupIdx` — added by one PR, silently dropped when a second PR rebased
over the same region of `app.jsx`.

### 2. Run the rebase

```sh
git rebase origin/main
```

If conflicts arise, resolve them **conservatively**: keep both sides of any
hunk where you are not certain which is correct. When in doubt about a conflict
in a file you did not author in this branch, take `--theirs` (main's version)
for the conflicted hunk, then manually re-apply this branch's intended change
on top. Never silently discard a large block of code to resolve a conflict —
surface it to the user first.

### 3. Verify canaries survived

For every symbol on your canary list, confirm it still exists:

```sh
grep -n "<canary symbols>" app.jsx
```

If any canary is missing: **stop**. Do not push. Identify which rebase step
dropped it (`git log --oneline` + `git show <sha> -- <file>`), then manually
re-apply the missing code. Commit the fix before proceeding.

### 4. Sanity-check the net diff

Compare the rebased branch against origin/main one final time:

```sh
git diff origin/main -- <changed files>
```

The diff should contain **only** the changes this branch intentionally
introduces. Any unexpected `-` lines (deletions of code you didn't mean to
remove) are a red flag — investigate before pushing.

### 5. Run the pre-commit hook dry-run

```sh
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh"
npm run build && npm run validate
```

If this fails, fix it before pushing.

### 6. Push and report

```sh
git push --force-with-lease origin <branch>
```

Report to the user:
- Which canaries you checked and confirmed
- Whether any conflicts required manual resolution
- The final `git diff origin/main --stat` so they can see the scope

## Why this matters / the failure mode

The incident that prompted this skill: PR #53 added `GS_CLINCH` (a 30-entry
constant + logic rewrite of `pointsRace`) to `app.jsx`. PR #56 was branched
before #53 merged, also touched `app.jsx`, and when rebased onto main it
resolved the conflict by keeping its own version of the modified region —
silently dropping all of `GS_CLINCH`. The rebase showed no error. The build
passed. The feature was gone and only caught by manual inspection later.

The fix is simple: **always know what main gained before you rebase, and
verify it's still there after**.
