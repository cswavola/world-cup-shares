# WC26 Shares

A small web app for a World Cup 2026 shares pool. Runs as a static site on
GitHub Pages, installs to the iPhone home screen, and pulls live results
automatically.

## Files

| File | What it is | Do you edit it? |
|------|------------|-----------------|
| `index.html` | Page shell, loads React + `app.js` | rarely |
| `app.jsx` | The whole app (source) | only to change features |
| `app.js` | Built from `app.jsx` — **generated, never edit by hand** | no |
| `picks.json` | Who picked which teams | **yes — edit in the repo** |
| `results.json` | Optional manual corrections to the live feed | only if the feed is wrong |
| `manifest.webmanifest`, `icon-*.png` | Home-screen install bits | no |

The app is read-only for your friends — three tabs (Standings, Players, Teams).
All admin is done in the repo by editing `picks.json` and `results.json`; there
are no editable controls in the app, and picks can only change via a commit/PR.
Late entrants can be added any time (optionally with a discounted share count —
the scoring works with whatever totals you give each player).

## How results work

On load the app fetches the public-domain
[openfootball](https://github.com/openfootball/worldcup.json) schedule+scores
file and computes everyone's points automatically — group results, "reached the
knockouts" (+1), and knockout rounds. If that fetch fails (offline, feed down),
it falls back to the schedule embedded in `app.jsx`, so the app always renders.

If the feed is ever wrong or slow, correct it from your PC by adding entries to
`results.json` and committing — your correction overrides the feed for everyone.
Format:

```json
{
  "matches": [
    { "stage": "group", "a": "ESP", "b": "URU", "outcome": "a" }
  ],
  "advanced": ["ESP", "NOR"]
}
```

`stage` is one of `group`, `r32`, `r16`, `qf`, `sf`, `third`, `final`.
`outcome` is `"a"` (team a won), `"b"` (team b won), or `"draw"` (group only).
`a`/`b` are the three-letter codes used in the app. `advanced` lists teams that
reached the knockouts (each worth +1); the feed fills this in automatically once
the Round of 32 is set, so you rarely need it. Leave the arrays empty when there's
nothing to correct.

## Scoring rules

Each player gets 10 shares, max 4 in one team. Team points: group win 1 /
draw 0.5, reaching the knockouts 1, then 2 / 4 / 8 / 16 per knockout round won,
third-place match 8, final 32. Your points from a team = team points × your
shares ÷ total shares held in that team across all players.

## Deploy (one time)

1. Put all these files in the root of your repo and push to `main`.
2. Repo **Settings → Pages → Build and deployment → Source: Deploy from a
   branch**, branch `main`, folder `/ (root)`, **Save**.
3. Wait ~1 minute. Your site is at
   `https://cswavola.github.io/world-cup-shares/`.

## Set the picks

Edit `picks.json` in the repo: list each player with their team codes and share
counts. Most players get 10 shares (max 4 in one team); late entrants can be
given fewer as a discount. Commit it — that file is what everyone loads, and
the only way to change picks is another commit.

```json
{
  "players": [
    { "name": "Lauren", "shares": { "ESP": 2, "ENG": 2, "ARG": 2, "BRA": 1, "POR": 1, "GER": 1, "NED": 1 } }
  ]
}
```

## Editing the data (picks & results)

`picks.json` and `results.json` are plain data — not compiled — so you can still
edit them right on github.com and commit, no tools needed. The change is live
after the commit, and these are the only files most admin ever touches.

## Editing the app (app.jsx)

`app.jsx` is now precompiled to `app.js` by a tiny build (esbuild), instead of
being compiled in every visitor's browser. So changes to `app.jsx` go through a
one-step build. It's still local-only — no Mac-specific tooling, just Node.

**First time on a machine:**

```sh
npm install      # installs esbuild (the only dependency)
npm run setup    # turns on the pre-commit hook (sets core.hooksPath)
```

**While working on the app:**

```sh
npm run dev      # watches app.jsx and rebuilds app.js on every save (~10ms)
python3 -m http.server   # in another terminal, then open localhost:8000
```

Edit `app.jsx`, save, refresh — same loop as before, the compile just happens
locally now. Then commit as normal. The pre-commit hook rebuilds `app.js`,
validates the JSON files, and stages `app.js` into the commit, so the built file
always matches the source. If `app.jsx` has a syntax error or a JSON file is
malformed, the commit is blocked with a message instead of shipping a broken
site. (Emergency bypass, rarely needed: `git commit --no-verify`.)

`app.js` is committed (Pages serves it directly), but treat it as generated —
never hand-edit it. To build once without committing, run `npm run build`.

