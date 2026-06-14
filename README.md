# WC26 Shares

A small web app for a World Cup 2026 shares pool. Runs as a static site on
GitHub Pages, installs to the iPhone home screen, and pulls live results
automatically.

## Files

| File | What it is | Do you edit it? |
|------|------------|-----------------|
| `index.html` | Page shell, loads libraries | rarely |
| `app.jsx` | The whole app | only to change features |
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

## Editing the app later

`app.jsx` compiles in the browser, so you can edit it right on github.com and
the change is live after the commit — no Mac, no build tools. (To preview
locally you need a local web server, e.g. `python3 -m http.server`, because
browsers block the in-page compiler on `file://`.)
