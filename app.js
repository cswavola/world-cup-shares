const { useState, useEffect, useMemo } = React;
function RaceChart({ data, players }) {
  const W = 320, H = 190, P = { l: 26, r: 8, t: 8, b: 16 };
  const n = data.length;
  const maxV = Math.max(0.5, ...data.flatMap((d) => players.map((p) => d[p.name] || 0)));
  const x = (i) => P.l + (n <= 1 ? 0 : i * (W - P.l - P.r) / (n - 1));
  const y = (v) => H - P.b - v / maxV * (H - P.t - P.b);
  const ticks = 4;
  return /* @__PURE__ */ React.createElement("svg", { viewBox: `0 0 ${W} ${H}`, width: "100%", style: { display: "block" } }, Array.from({ length: ticks + 1 }, (_, k) => {
    const v = maxV * k / ticks, yy = y(v);
    return /* @__PURE__ */ React.createElement("g", { key: k }, /* @__PURE__ */ React.createElement("line", { x1: P.l, y1: yy, x2: W - P.r, y2: yy, stroke: T.line, strokeWidth: "1" }), /* @__PURE__ */ React.createElement("text", { x: P.l - 4, y: yy + 3, textAnchor: "end", fontSize: "7", fill: T.sub, fontFamily: MONO }, v.toFixed(0)));
  }), players.map((p, i) => /* @__PURE__ */ React.createElement(
    "polyline",
    {
      key: p.id,
      fill: "none",
      stroke: PLAYER_COLORS[i % 10],
      strokeWidth: "2",
      strokeLinejoin: "round",
      strokeLinecap: "round",
      points: data.map((d, idx) => `${x(idx)},${y(d[p.name] || 0)}`).join(" ")
    }
  )));
}
function DistBars({ rows }) {
  const max = Math.max(0.01, ...rows.map((r) => r.points));
  return /* @__PURE__ */ React.createElement("div", { className: "flex flex-col gap-1", style: { padding: "0 12px" } }, rows.map((r) => /* @__PURE__ */ React.createElement("div", { key: r.team, className: "flex items-center gap-2", style: { fontSize: 12 } }, /* @__PURE__ */ React.createElement("span", { style: { fontFamily: MONO, width: 34, color: T.sub } }, r.team), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, background: T.soft, borderRadius: 4, height: 14, overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { width: `${r.points / max * 100}%`, background: T.green, height: "100%", borderRadius: 4, minWidth: r.points > 0 ? 2 : 0 } })), /* @__PURE__ */ React.createElement("span", { style: { fontFamily: MONO, width: 38, textAlign: "right", fontWeight: 700 } }, fmt(r.points)))));
}
const Svg = (p) => /* @__PURE__ */ React.createElement(
  "svg",
  {
    width: p.size || 18,
    height: p.size || 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: p.color || "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  },
  p.children
);
const Trophy = (p) => /* @__PURE__ */ React.createElement(Svg, { ...p }, /* @__PURE__ */ React.createElement("path", { d: "M6 9H4.5a2.5 2.5 0 0 1 0-5H6" }), /* @__PURE__ */ React.createElement("path", { d: "M18 9h1.5a2.5 2.5 0 0 0 0-5H18" }), /* @__PURE__ */ React.createElement("path", { d: "M4 22h16" }), /* @__PURE__ */ React.createElement("path", { d: "M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" }), /* @__PURE__ */ React.createElement("path", { d: "M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" }), /* @__PURE__ */ React.createElement("path", { d: "M18 2H6v7a6 6 0 0 0 12 0V2Z" }));
const Shield = (p) => /* @__PURE__ */ React.createElement(Svg, { ...p }, /* @__PURE__ */ React.createElement("path", { d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" }));
const ChevronDown = (p) => /* @__PURE__ */ React.createElement(Svg, { ...p }, /* @__PURE__ */ React.createElement("path", { d: "m6 9 6 6 6-6" }));
const ChevronUp = (p) => /* @__PURE__ */ React.createElement(Svg, { ...p }, /* @__PURE__ */ React.createElement("path", { d: "m18 15-6-6-6 6" }));
const User = (p) => /* @__PURE__ */ React.createElement(Svg, { ...p }, /* @__PURE__ */ React.createElement("path", { d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" }), /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "7", r: "4" }));
const Grid = (p) => /* @__PURE__ */ React.createElement(Svg, { ...p }, /* @__PURE__ */ React.createElement("rect", { x: "3", y: "3", width: "7", height: "7" }), /* @__PURE__ */ React.createElement("rect", { x: "14", y: "3", width: "7", height: "7" }), /* @__PURE__ */ React.createElement("rect", { x: "14", y: "14", width: "7", height: "7" }), /* @__PURE__ */ React.createElement("rect", { x: "3", y: "14", width: "7", height: "7" }));
const T = {
  bg: "#F4F6F1",
  ink: "#16251D",
  sub: "#5C6B61",
  green: "#1F6B4A",
  greenDark: "#14442F",
  gold: "#E8A02E",
  card: "#FFFFFF",
  line: "#DCE3DA",
  soft: "#EAF0E8"
};
const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";
const TEAMS = [
  ["CZE", "Czechia", "A", 41],
  ["KOR", "Korea Republic", "A", 25],
  ["MEX", "Mexico", "A", 15],
  ["RSA", "South Africa", "A", 60],
  ["BIH", "Bosnia & Herzegovina", "B", 65],
  ["CAN", "Canada", "B", 30],
  ["SUI", "Switzerland", "B", 19],
  ["QAT", "Qatar", "B", 55],
  ["BRA", "Brazil", "C", 6],
  ["HAI", "Haiti", "C", 83],
  ["MAR", "Morocco", "C", 8],
  ["SCO", "Scotland", "C", 43],
  ["AUS", "Australia", "D", 27],
  ["PAR", "Paraguay", "D", 40],
  ["TUR", "T\xFCrkiye", "D", 22],
  ["USA", "USA", "D", 16],
  ["CIV", "C\xF4te d'Ivoire", "E", 34],
  ["CUW", "Cura\xE7ao", "E", 82],
  ["ECU", "Ecuador", "E", 23],
  ["GER", "Germany", "E", 10],
  ["JPN", "Japan", "F", 18],
  ["NED", "Netherlands", "F", 7],
  ["SWE", "Sweden", "F", 38],
  ["TUN", "Tunisia", "F", 44],
  ["BEL", "Belgium", "G", 9],
  ["EGY", "Egypt", "G", 29],
  ["IRN", "IR Iran", "G", 21],
  ["NZL", "New Zealand", "G", 85],
  ["CPV", "Cabo Verde", "H", 69],
  ["KSA", "Saudi Arabia", "H", 61],
  ["ESP", "Spain", "H", 2],
  ["URU", "Uruguay", "H", 17],
  ["FRA", "France", "I", 1],
  ["IRQ", "Iraq", "I", 57],
  ["NOR", "Norway", "I", 31],
  ["SEN", "Senegal", "I", 14],
  ["ALG", "Algeria", "J", 28],
  ["ARG", "Argentina", "J", 3],
  ["AUT", "Austria", "J", 24],
  ["JOR", "Jordan", "J", 63],
  ["COL", "Colombia", "K", 13],
  ["COD", "Congo DR", "K", 46],
  ["POR", "Portugal", "K", 5],
  ["UZB", "Uzbekistan", "K", 50],
  ["CRO", "Croatia", "L", 11],
  ["ENG", "England", "L", 4],
  ["GHA", "Ghana", "L", 74],
  ["PAN", "Panama", "L", 33]
].map(([code, name, group, rank]) => ({ code, name, group, rank }));
const TEAM = Object.fromEntries(TEAMS.map((t) => [t.code, t]));
const GROUPS = "ABCDEFGHIJKL".split("");
const FIXTURES = [
  ["2026-06-11", "13:00-6", "MEX", "RSA", "Mexico City"],
  ["2026-06-11", "20:00-6", "KOR", "CZE", "Guadalajara"],
  ["2026-06-18", "12:00-4", "CZE", "RSA", "Atlanta"],
  ["2026-06-18", "19:00-6", "MEX", "KOR", "Guadalajara"],
  ["2026-06-24", "19:00-6", "CZE", "MEX", "Mexico City"],
  ["2026-06-24", "19:00-6", "RSA", "KOR", "Monterrey"],
  ["2026-06-12", "15:00-4", "CAN", "BIH", "Toronto"],
  ["2026-06-13", "12:00-7", "QAT", "SUI", "San Francisco Bay Area"],
  ["2026-06-18", "12:00-7", "SUI", "BIH", "Los Angeles"],
  ["2026-06-18", "15:00-7", "CAN", "QAT", "Vancouver"],
  ["2026-06-24", "12:00-7", "SUI", "CAN", "Vancouver"],
  ["2026-06-24", "12:00-7", "BIH", "QAT", "Seattle"],
  ["2026-06-13", "18:00-4", "BRA", "MAR", "New York/New Jersey"],
  ["2026-06-13", "21:00-4", "HAI", "SCO", "Boston"],
  ["2026-06-19", "18:00-4", "SCO", "MAR", "Boston"],
  ["2026-06-19", "20:30-4", "BRA", "HAI", "Philadelphia"],
  ["2026-06-24", "18:00-4", "SCO", "BRA", "Miami"],
  ["2026-06-24", "18:00-4", "MAR", "HAI", "Atlanta"],
  ["2026-06-12", "18:00-7", "USA", "PAR", "Los Angeles"],
  ["2026-06-13", "21:00-7", "AUS", "TUR", "Vancouver"],
  ["2026-06-19", "12:00-7", "USA", "AUS", "Seattle"],
  ["2026-06-19", "20:00-7", "TUR", "PAR", "San Francisco Bay Area"],
  ["2026-06-25", "19:00-7", "TUR", "USA", "Los Angeles"],
  ["2026-06-25", "19:00-7", "PAR", "AUS", "San Francisco Bay Area"],
  ["2026-06-14", "12:00-5", "GER", "CUW", "Houston"],
  ["2026-06-14", "19:00-4", "CIV", "ECU", "Philadelphia"],
  ["2026-06-20", "16:00-4", "GER", "CIV", "Toronto"],
  ["2026-06-20", "19:00-5", "ECU", "CUW", "Kansas City"],
  ["2026-06-25", "16:00-4", "CUW", "CIV", "Philadelphia"],
  ["2026-06-25", "16:00-4", "ECU", "GER", "New York/New Jersey"],
  ["2026-06-14", "15:00-5", "NED", "JPN", "Dallas"],
  ["2026-06-14", "20:00-6", "SWE", "TUN", "Monterrey"],
  ["2026-06-20", "12:00-5", "NED", "SWE", "Houston"],
  ["2026-06-20", "22:00-6", "TUN", "JPN", "Monterrey"],
  ["2026-06-25", "18:00-5", "JPN", "SWE", "Dallas"],
  ["2026-06-25", "18:00-5", "TUN", "NED", "Kansas City"],
  ["2026-06-15", "12:00-7", "BEL", "EGY", "Seattle"],
  ["2026-06-15", "18:00-7", "IRN", "NZL", "Los Angeles"],
  ["2026-06-21", "12:00-7", "BEL", "IRN", "Los Angeles"],
  ["2026-06-21", "18:00-7", "NZL", "EGY", "Vancouver"],
  ["2026-06-26", "20:00-7", "EGY", "IRN", "Seattle"],
  ["2026-06-26", "20:00-7", "NZL", "BEL", "Vancouver"],
  ["2026-06-15", "12:00-4", "ESP", "CPV", "Atlanta"],
  ["2026-06-15", "18:00-4", "KSA", "URU", "Miami"],
  ["2026-06-21", "12:00-4", "ESP", "KSA", "Atlanta"],
  ["2026-06-21", "18:00-4", "URU", "CPV", "Miami"],
  ["2026-06-26", "19:00-5", "CPV", "KSA", "Houston"],
  ["2026-06-26", "18:00-6", "URU", "ESP", "Guadalajara"],
  ["2026-06-16", "15:00-4", "FRA", "SEN", "New York/New Jersey"],
  ["2026-06-16", "18:00-4", "IRQ", "NOR", "Boston"],
  ["2026-06-22", "17:00-4", "FRA", "IRQ", "Philadelphia"],
  ["2026-06-22", "20:00-4", "NOR", "SEN", "New York/New Jersey"],
  ["2026-06-26", "15:00-4", "NOR", "FRA", "Boston"],
  ["2026-06-26", "15:00-4", "SEN", "IRQ", "Toronto"],
  ["2026-06-16", "20:00-5", "ARG", "ALG", "Kansas City"],
  ["2026-06-16", "21:00-7", "AUT", "JOR", "San Francisco Bay Area"],
  ["2026-06-22", "12:00-5", "ARG", "AUT", "Dallas"],
  ["2026-06-22", "20:00-7", "JOR", "ALG", "San Francisco Bay Area"],
  ["2026-06-27", "21:00-5", "ALG", "AUT", "Kansas City"],
  ["2026-06-27", "21:00-5", "JOR", "ARG", "Dallas"],
  ["2026-06-17", "12:00-5", "POR", "COD", "Houston"],
  ["2026-06-17", "20:00-6", "UZB", "COL", "Mexico City"],
  ["2026-06-23", "12:00-5", "POR", "UZB", "Houston"],
  ["2026-06-23", "20:00-6", "COL", "COD", "Guadalajara"],
  ["2026-06-27", "19:30-4", "COL", "POR", "Miami"],
  ["2026-06-27", "19:30-4", "COD", "UZB", "Atlanta"],
  ["2026-06-17", "15:00-5", "ENG", "CRO", "Dallas"],
  ["2026-06-17", "19:00-4", "GHA", "PAN", "Toronto"],
  ["2026-06-23", "16:00-4", "ENG", "GHA", "Boston"],
  ["2026-06-23", "19:00-4", "PAN", "CRO", "Toronto"],
  ["2026-06-27", "17:00-4", "PAN", "ENG", "New York/New Jersey"],
  ["2026-06-27", "17:00-4", "CRO", "GHA", "Philadelphia"]
].map(([date, time, a, b, city]) => ({ date, time, a, b, city }));
const STAGES = [
  { id: "group", label: "Group stage", win: 1, draw: 0.5 },
  { id: "r32", label: "Round of 32", win: 2 },
  { id: "r16", label: "Round of 16", win: 4 },
  { id: "qf", label: "Quarter-final", win: 8 },
  { id: "sf", label: "Semi-final", win: 16 },
  { id: "third", label: "Third place", win: 8 },
  { id: "final", label: "Final", win: 32 }
];
const STAGE = Object.fromEntries(STAGES.map((s) => [s.id, s]));
const PLAYER_COLORS = ["#1F6B4A", "#E8A02E", "#3E6FB0", "#C84B3C", "#7A5BA6", "#2E8F8A", "#B0563E", "#5E7D2E", "#9A4D7E", "#54616B"];
const DEMO = {
  demo: true,
  me: null,
  players: [
    { id: "p1", name: "Ada", shares: { ESP: 3, ARG: 3, MAR: 2, JPN: 2 } },
    { id: "p2", name: "Niels", shares: { FRA: 4, SEN: 2, MEX: 2, URU: 2 } },
    { id: "p3", name: "Marie", shares: { ENG: 3, POR: 3, COL: 2, CRO: 2 } },
    { id: "p4", name: "Enrico", shares: { BRA: 4, GER: 3, NED: 3 } },
    { id: "p5", name: "Lise", shares: { ARG: 2, ESP: 2, FRA: 2, ENG: 2, BRA: 2 } },
    { id: "p6", name: "Paul", shares: { MAR: 4, TUR: 3, ECU: 3 } },
    { id: "p7", name: "Emmy", shares: { MEX: 4, USA: 3, CAN: 3 } },
    { id: "p8", name: "Richard", shares: { JPN: 4, KOR: 3, AUS: 3 } },
    { id: "p9", name: "Chien", shares: { NOR: 4, BEL: 3, SUI: 3 } },
    { id: "p10", name: "Erwin", shares: { URU: 3, CRO: 3, SEN: 2, EGY: 2 } }
  ],
  matches: [
    { id: "m1", stage: "group", a: "MEX", b: "RSA", outcome: "a" },
    { id: "m2", stage: "group", a: "KOR", b: "CZE", outcome: "draw" },
    { id: "m3", stage: "group", a: "CAN", b: "QAT", outcome: "a" },
    { id: "m4", stage: "group", a: "BRA", b: "SCO", outcome: "a" },
    { id: "m5", stage: "group", a: "ESP", b: "URU", outcome: "draw" },
    { id: "m6", stage: "group", a: "FRA", b: "IRQ", outcome: "a" },
    { id: "m7", stage: "group", a: "JPN", b: "TUN", outcome: "a" },
    { id: "m8", stage: "group", a: "MAR", b: "HAI", outcome: "a" }
  ],
  advanced: []
};
function teamPoints(state) {
  const pts = Object.fromEntries(TEAMS.map((t) => [t.code, 0]));
  for (const m of state.matches) {
    const s = STAGE[m.stage];
    if (!s) continue;
    if (m.outcome === "draw" && s.draw) {
      pts[m.a] += s.draw;
      pts[m.b] += s.draw;
    } else if (m.outcome === "a") pts[m.a] += s.win;
    else if (m.outcome === "b") pts[m.b] += s.win;
  }
  for (const code of state.advanced) pts[code] += 1;
  return pts;
}
function totalShares(state) {
  const tot = {};
  for (const p of state.players)
    for (const [code, n] of Object.entries(p.shares)) tot[code] = (tot[code] || 0) + n;
  return tot;
}
function leaderboard(state) {
  const tp = teamPoints(state);
  const tot = totalShares(state);
  return state.players.map((p) => {
    const rows = Object.entries(p.shares).filter(([, n]) => n > 0).map(([code, n]) => ({
      code,
      shares: n,
      pool: tot[code] || n,
      teamPts: tp[code],
      payout: tot[code] ? tp[code] * n / tot[code] : 0
    })).sort((x, y) => y.payout - x.payout);
    return { ...p, rows, total: rows.reduce((s, r) => s + r.payout, 0) };
  }).sort((a, b) => b.total - a.total);
}
const fmt = (x) => (Math.round(x * 100) / 100).toFixed(2);
function pointsRace(state) {
  const chron = [...state.matches].sort((x, y) => (x.date || "") < (y.date || "") ? -1 : 1);
  const tot = totalShares(state);
  const tp = Object.fromEntries(TEAMS.map((t) => [t.code, 0]));
  for (const code of state.advanced) tp[code] += 1;
  const snap = (label) => {
    const row = { label };
    for (const p of state.players) {
      let s = 0;
      for (const [code, n] of Object.entries(p.shares))
        if (tot[code]) s += (tp[code] || 0) * n / tot[code];
      row[p.name] = Math.round(s * 1e3) / 1e3;
    }
    return row;
  };
  const data = [snap("\u2022")];
  chron.forEach((m, i) => {
    const s = STAGE[m.stage];
    if (s) {
      if (m.outcome === "draw" && s.draw) {
        tp[m.a] += s.draw;
        tp[m.b] += s.draw;
      } else if (m.outcome === "a") tp[m.a] += s.win;
      else if (m.outcome === "b") tp[m.b] += s.win;
    }
    data.push(snap(String(i + 1)));
  });
  return data;
}
function Card({ children, style }) {
  return /* @__PURE__ */ React.createElement("div", { style: { background: T.card, border: `1px solid ${T.line}`, borderRadius: 14, ...style } }, children);
}
function ShareBar({ code, players, tot }) {
  const owners = players.map((p, i) => ({ name: p.name, n: p.shares[code] || 0, color: PLAYER_COLORS[i % 10] })).filter((o) => o.n > 0);
  if (!owners.length)
    return /* @__PURE__ */ React.createElement("div", { style: { height: 8, borderRadius: 4, background: T.soft } });
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", height: 8, borderRadius: 4, overflow: "hidden" } }, owners.map((o, i) => /* @__PURE__ */ React.createElement("div", { key: i, title: `${o.name}: ${o.n}`, style: { flex: o.n, background: o.color, marginRight: i < owners.length - 1 ? 1 : 0 } })), /* @__PURE__ */ React.createElement("span", { style: { display: "none" } }, tot));
}
function Leaderboard({ state }) {
  const [open, setOpen] = useState(null);
  const [mode, setMode] = useState("table");
  const board = useMemo(() => leaderboard(state), [state]);
  const race = useMemo(() => pointsRace(state), [state]);
  return /* @__PURE__ */ React.createElement("div", { className: "flex flex-col gap-2" }, /* @__PURE__ */ React.createElement("div", { className: "flex gap-1", style: { background: T.soft, borderRadius: 10, padding: 3 } }, [["table", "Table"], ["race", "Race"]].map(([id, label]) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: id,
      onClick: () => setMode(id),
      style: {
        flex: 1,
        padding: 8,
        borderRadius: 8,
        fontSize: 13,
        fontWeight: 700,
        background: mode === id ? T.card : "transparent",
        color: mode === id ? T.ink : T.sub,
        boxShadow: mode === id ? "0 1px 2px rgba(0,0,0,0.08)" : "none"
      }
    },
    label
  ))), mode === "race" && /* @__PURE__ */ React.createElement(Card, { style: { padding: "12px 4px 4px" } }, /* @__PURE__ */ React.createElement(RaceChart, { data: race, players: state.players }), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap gap-2", style: { padding: "6px 10px" } }, state.players.map((p, i) => /* @__PURE__ */ React.createElement("span", { key: p.id, style: { fontSize: 11, color: T.sub, display: "inline-flex", alignItems: "center", gap: 4 } }, /* @__PURE__ */ React.createElement("span", { style: { width: 8, height: 8, borderRadius: 4, background: PLAYER_COLORS[i % 10] } }), p.name))), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: T.sub, padding: "0 10px 6px" } }, "Cumulative points after each result.")), mode === "table" && board.map((p, i) => {
    const color = PLAYER_COLORS[state.players.findIndex((x) => x.id === p.id) % 10];
    const isOpen = open === p.id;
    return /* @__PURE__ */ React.createElement(Card, { key: p.id, style: i === 0 && p.total > 0 ? { borderColor: T.gold, boxShadow: `0 0 0 1px ${T.gold}` } : {} }, /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => setOpen(isOpen ? null : p.id),
        className: "w-full flex items-center gap-3 p-3 text-left"
      },
      /* @__PURE__ */ React.createElement("span", { style: { fontFamily: MONO, fontSize: 13, color: T.sub, width: 22 } }, i + 1),
      /* @__PURE__ */ React.createElement("span", { style: { width: 10, height: 10, borderRadius: 5, background: color, flexShrink: 0 } }),
      /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 700, flex: 1 } }, p.name),
      i === 0 && p.total > 0 && /* @__PURE__ */ React.createElement(Trophy, { size: 16, color: T.gold }),
      /* @__PURE__ */ React.createElement("span", { style: { fontFamily: MONO, fontWeight: 700, fontSize: 17 } }, fmt(p.total)),
      isOpen ? /* @__PURE__ */ React.createElement(ChevronUp, { size: 16, color: T.sub }) : /* @__PURE__ */ React.createElement(ChevronDown, { size: 16, color: T.sub })
    ), isOpen && /* @__PURE__ */ React.createElement("div", { style: { borderTop: `1px solid ${T.line}`, padding: "8px 12px 12px" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr auto auto auto", gap: "4px 12px", fontSize: 13 } }, /* @__PURE__ */ React.createElement("span", { style: { color: T.sub, fontSize: 11 } }, "TEAM"), /* @__PURE__ */ React.createElement("span", { style: { color: T.sub, fontSize: 11, fontFamily: MONO } }, "OWN"), /* @__PURE__ */ React.createElement("span", { style: { color: T.sub, fontSize: 11, fontFamily: MONO } }, "TEAM PTS"), /* @__PURE__ */ React.createElement("span", { style: { color: T.sub, fontSize: 11, fontFamily: MONO } }, "YOURS"), p.rows.map((r) => /* @__PURE__ */ React.createElement(FragmentRow, { key: r.code, r })))));
  }));
}
function FragmentRow({ r }) {
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("span", null, TEAM[r.code].name), /* @__PURE__ */ React.createElement("span", { style: { fontFamily: MONO } }, r.shares, "/", r.pool), /* @__PURE__ */ React.createElement("span", { style: { fontFamily: MONO } }, fmt(r.teamPts)), /* @__PURE__ */ React.createElement("span", { style: { fontFamily: MONO, fontWeight: 700, color: T.green } }, fmt(r.payout)));
}
function PlayerView({ state, setState }) {
  const board = useMemo(() => leaderboard(state), [state]);
  const sel = board.find((p) => p.id === state.me) || board[0];
  const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  const fixtures = useMemo(() => {
    if (!sel) return [];
    return FIXTURES.filter((f) => f.date >= today && (sel.shares[f.a] || sel.shares[f.b])).slice(0, 14);
  }, [sel, today]);
  if (!sel)
    return /* @__PURE__ */ React.createElement(Card, { style: { padding: 16, color: T.sub, fontSize: 14 } }, "No players yet \u2014 add them in the Picks tab.");
  const rank = board.findIndex((p) => p.id === sel.id) + 1;
  const dist = sel.rows.map((r) => ({ team: r.code, points: Math.round(r.payout * 100) / 100 }));
  const fmtDate = (d) => (/* @__PURE__ */ new Date(d + "T12:00:00")).toLocaleDateString(void 0, { weekday: "short", day: "numeric", month: "short" });
  return /* @__PURE__ */ React.createElement("div", { className: "flex flex-col gap-3" }, /* @__PURE__ */ React.createElement("div", { className: "flex gap-2", style: { overflowX: "auto", paddingBottom: 2 } }, board.map((p) => {
    const i = state.players.findIndex((x) => x.id === p.id);
    const on = p.id === sel.id;
    return /* @__PURE__ */ React.createElement(
      "button",
      {
        key: p.id,
        onClick: () => setState((s) => ({ ...s, me: p.id })),
        style: {
          padding: "7px 12px",
          borderRadius: 999,
          whiteSpace: "nowrap",
          fontSize: 13,
          fontWeight: 600,
          flexShrink: 0,
          border: `1px solid ${on ? T.green : T.line}`,
          background: on ? T.green : T.card,
          color: on ? "#fff" : T.ink
        }
      },
      /* @__PURE__ */ React.createElement("span", { style: { display: "inline-block", width: 8, height: 8, borderRadius: 4, background: PLAYER_COLORS[i % 10], marginRight: 6 } }),
      p.name
    );
  })), /* @__PURE__ */ React.createElement(Card, { style: { padding: 14 } }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 18, fontWeight: 800 } }, sel.name), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: T.sub } }, "#", rank, " of ", board.length, " \xB7 ", sel.rows.length, " teams")), /* @__PURE__ */ React.createElement("div", { style: { textAlign: "right" } }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: MONO, fontSize: 24, fontWeight: 800, color: T.green } }, fmt(sel.total)), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: T.sub } }, "points")))), /* @__PURE__ */ React.createElement(Card, { style: { padding: "14px 0 8px" } }, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 700, fontSize: 14, padding: "0 0 8px 14px" } }, "Where the points come from"), /* @__PURE__ */ React.createElement(DistBars, { rows: dist })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, letterSpacing: 2, color: T.sub, fontWeight: 700, margin: "0 4px 6px" } }, "UPCOMING FIXTURES"), /* @__PURE__ */ React.createElement(Card, null, fixtures.length === 0 && /* @__PURE__ */ React.createElement("div", { style: { padding: 16, color: T.sub, fontSize: 14 } }, "No group fixtures left for these teams. Knockout fixtures appear once the bracket is set."), fixtures.map((f, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { padding: "10px 12px", borderTop: i ? `1px solid ${T.line}` : "none" } }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 14, flex: 1 } }, /* @__PURE__ */ React.createElement("b", { style: { color: sel.shares[f.a] ? T.green : T.ink } }, TEAM[f.a].name), /* @__PURE__ */ React.createElement("span", { style: { color: T.sub } }, " v "), /* @__PURE__ */ React.createElement("b", { style: { color: sel.shares[f.b] ? T.green : T.ink } }, TEAM[f.b].name)), /* @__PURE__ */ React.createElement("span", { style: { fontFamily: MONO, fontSize: 11, color: T.sub } }, fmtDate(f.date))), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: T.sub, marginTop: 2 } }, f.city, " \xB7 kickoff ", f.time))))));
}
function TeamsView({ state }) {
  const tp = useMemo(() => teamPoints(state), [state]);
  const tot = useMemo(() => totalShares(state), [state]);
  return /* @__PURE__ */ React.createElement("div", { className: "flex flex-col gap-4" }, GROUPS.map((g) => /* @__PURE__ */ React.createElement("div", { key: g }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, letterSpacing: 2, color: T.sub, fontWeight: 700, margin: "0 4px 6px" } }, "GROUP ", g), /* @__PURE__ */ React.createElement(Card, null, TEAMS.filter((t) => t.group === g).map((t, i) => /* @__PURE__ */ React.createElement("div", { key: t.code, style: { padding: "10px 12px", borderTop: i ? `1px solid ${T.line}` : "none" } }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2", style: { marginBottom: 6 } }, /* @__PURE__ */ React.createElement("span", { style: { fontFamily: MONO, fontSize: 11, color: T.sub, width: 30 } }, t.code), /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 600, flex: 1, fontSize: 14 } }, t.name), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, color: T.sub } }, "FIFA ", t.rank), /* @__PURE__ */ React.createElement("span", { style: { fontFamily: MONO, fontSize: 13, fontWeight: 700, color: tp[t.code] ? T.green : T.sub, width: 44, textAlign: "right" } }, fmt(tp[t.code]))), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement(ShareBar, { code: t.code, players: state.players, tot: tot[t.code] })), /* @__PURE__ */ React.createElement("span", { style: { fontFamily: MONO, fontSize: 11, color: T.sub, width: 50, textAlign: "right" } }, tot[t.code] || 0, " sh"))))))));
}
const FEED_URL = "https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json";
const NAME2CODE = {
  "Mexico": "MEX",
  "South Africa": "RSA",
  "South Korea": "KOR",
  "Czech Republic": "CZE",
  "Bosnia & Herzegovina": "BIH",
  "Canada": "CAN",
  "Switzerland": "SUI",
  "Qatar": "QAT",
  "Brazil": "BRA",
  "Haiti": "HAI",
  "Morocco": "MAR",
  "Scotland": "SCO",
  "Australia": "AUS",
  "Paraguay": "PAR",
  "Turkey": "TUR",
  "USA": "USA",
  "Ivory Coast": "CIV",
  "Cura\xE7ao": "CUW",
  "Ecuador": "ECU",
  "Germany": "GER",
  "Japan": "JPN",
  "Netherlands": "NED",
  "Sweden": "SWE",
  "Tunisia": "TUN",
  "Belgium": "BEL",
  "Egypt": "EGY",
  "Iran": "IRN",
  "New Zealand": "NZL",
  "Cape Verde": "CPV",
  "Saudi Arabia": "KSA",
  "Spain": "ESP",
  "Uruguay": "URU",
  "France": "FRA",
  "Iraq": "IRQ",
  "Norway": "NOR",
  "Senegal": "SEN",
  "Algeria": "ALG",
  "Argentina": "ARG",
  "Austria": "AUT",
  "Jordan": "JOR",
  "Colombia": "COL",
  "DR Congo": "COD",
  "Portugal": "POR",
  "Uzbekistan": "UZB",
  "Croatia": "CRO",
  "England": "ENG",
  "Ghana": "GHA",
  "Panama": "PAN"
};
const ROUND2STAGE = {
  "Round of 32": "r32",
  "Round of 16": "r16",
  "Quarter-final": "qf",
  "Semi-final": "sf",
  "Match for third place": "third",
  "Final": "final"
};
function parseFeed(data) {
  const matches = [];
  const advanced = /* @__PURE__ */ new Set();
  for (const m of data.matches || []) {
    const a = NAME2CODE[m.team1], b = NAME2CODE[m.team2];
    if (!a || !b) continue;
    const stage = ROUND2STAGE[m.round] || "group";
    if (stage === "r32") {
      advanced.add(a);
      advanced.add(b);
    }
    const sc = m.score;
    if (!sc || !sc.ft) continue;
    let [x, y] = sc.ft;
    let outcome;
    if (stage === "group") {
      outcome = x > y ? "a" : y > x ? "b" : "draw";
    } else {
      if (x === y && sc.et) [x, y] = sc.et;
      if (x === y && sc.p) [x, y] = sc.p;
      if (x === y) continue;
      outcome = x > y ? "a" : "b";
    }
    matches.push({ id: m.date + a + b, date: m.date, stage, a, b, outcome });
  }
  return { matches, advanced: [...advanced] };
}
function mergeResults(live, override) {
  const key = (m) => `${m.stage}:${[m.a, m.b].sort().join("-")}`;
  const byKey = /* @__PURE__ */ new Map();
  for (const m of live.matches) byKey.set(key(m), m);
  for (const m of override.matches || []) byKey.set(key(m), m);
  return {
    matches: [...byKey.values()],
    advanced: [.../* @__PURE__ */ new Set([...live.advanced, ...override.advanced || []])]
  };
}
const LS_KEY = "wc26-local-v1";
const loadLocal = () => {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY)) || {};
  } catch {
    return {};
  }
};
const saveLocal = (o) => {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(o));
  } catch {
  }
};
const BINGO_LS_KEY = "wc26-bingo-v1";
const BINGO_SIZE = 5;
const BINGO_CELLS = BINGO_SIZE * BINGO_SIZE;
const FREE_INDEX = Math.floor(BINGO_CELLS / 2);
const BINGO_FALLBACK = [
  "Goalie ponch",
  "Own goal",
  "Ball to space",
  "Too many wheaties",
  "That doesn't belong there",
  "You might be wondering how I got here",
  "Inconvenient ref",
  "Spicy coach",
  "Orbital strike",
  "Just f my s up (dumb haircut)",
  "I've never been here before",
  "Protect face or groin",
  "I didn't know <celebrity> was from <country>",
  "Surprise Canadian (only allowed for Canada games)",
  "Nobody liked that",
  "God helped me",
  "Big man upstairs loves the footie",
  "Lazarus",
  "Stream freezes at worst possible moment",
  "Total whiff",
  "And the award for best supporting actor goes to...",
  "Commentator calls the bluff"
];
const btn = (outline) => ({
  flex: 1,
  padding: 10,
  borderRadius: 10,
  fontWeight: 700,
  fontSize: 14,
  background: outline ? T.card : T.green,
  color: outline ? T.green : "#fff",
  border: `1px solid ${T.green}`
});
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function makeBingoCard(squares) {
  const picked = shuffle(squares).slice(0, BINGO_CELLS - 1);
  const cells = [...picked];
  cells.splice(FREE_INDEX, 0, "FREE");
  return cells;
}
function checkBingo(marked) {
  const s = BINGO_SIZE;
  const lines = [];
  for (let r = 0; r < s; r++) lines.push(Array.from({ length: s }, (_, c) => r * s + c));
  for (let c = 0; c < s; c++) lines.push(Array.from({ length: s }, (_, r) => r * s + c));
  lines.push(Array.from({ length: s }, (_, i) => i * s + i));
  lines.push(Array.from({ length: s }, (_, i) => i * s + (s - 1 - i)));
  return lines.some((line) => line.every((i) => marked.has(i)));
}
function loadBingoState() {
  try {
    const raw = localStorage.getItem(BINGO_LS_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw);
    if (!s.card || s.card.length !== BINGO_CELLS) return null;
    return s;
  } catch {
    return null;
  }
}
function saveBingoState(s) {
  try {
    localStorage.setItem(BINGO_LS_KEY, JSON.stringify(s));
  } catch {
  }
}
function BingoView() {
  const [squares, setSquares] = useState(BINGO_FALLBACK);
  const [card, setCard] = useState(null);
  const [marked, setMarked] = useState(null);
  const [prev, setPrev] = useState(null);
  const [hasBingo, setHasBingo] = useState(false);
  useEffect(() => {
    fetch("bingo.json", { cache: "no-store" }).then((r) => r.ok ? r.json() : Promise.reject()).then((d) => {
      if (Array.isArray(d.squares) && d.squares.length >= BINGO_CELLS - 1) setSquares(d.squares);
    }).catch(() => {
    });
  }, []);
  useEffect(() => {
    const saved = loadBingoState();
    if (saved) {
      setCard(saved.card);
      const m = new Set(saved.marked || []);
      m.add(FREE_INDEX);
      setMarked(m);
      setHasBingo(checkBingo(m));
    } else {
      newCard(squares, false);
    }
  }, []);
  function newCard(sq, saveUndo = true) {
    const src = sq || squares;
    if (saveUndo && card) setPrev({ card, marked: [...marked || []] });
    const c = makeBingoCard(src);
    const m = /* @__PURE__ */ new Set([FREE_INDEX]);
    setCard(c);
    setMarked(m);
    setHasBingo(false);
    saveBingoState({ card: c, marked: [FREE_INDEX] });
  }
  function toggleCell(i) {
    if (i === FREE_INDEX) return;
    setMarked((prev2) => {
      const next = new Set(prev2);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      const bingo = checkBingo(next);
      setHasBingo(bingo);
      saveBingoState({ card, marked: [...next] });
      return next;
    });
  }
  function undoNewCard() {
    if (!prev) return;
    const m = new Set(prev.marked);
    m.add(FREE_INDEX);
    setCard(prev.card);
    setMarked(m);
    setHasBingo(checkBingo(m));
    saveBingoState({ card: prev.card, marked: [...m] });
    setPrev(null);
  }
  if (!card || !marked) return null;
  const cellSize = Math.min(Math.floor((Math.min(window.innerWidth, 560) - 32) / BINGO_SIZE), 100);
  return /* @__PURE__ */ React.createElement("div", { className: "flex flex-col gap-3" }, hasBingo && /* @__PURE__ */ React.createElement("div", { style: {
    background: T.gold,
    color: T.inkDark || T.greenDark,
    borderRadius: 14,
    padding: "14px 16px",
    textAlign: "center",
    fontWeight: 900,
    fontSize: 28,
    letterSpacing: 2
  } }, "\u{1F389} BINGO! \u{1F389}"), /* @__PURE__ */ React.createElement(Card, { style: { padding: 8, overflowX: "auto" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: `repeat(${BINGO_SIZE}, ${cellSize}px)`, gap: 4, margin: "0 auto", width: "fit-content" } }, "BINGO".split("").map((l) => /* @__PURE__ */ React.createElement("div", { key: l, style: {
    width: cellSize,
    textAlign: "center",
    fontWeight: 900,
    fontSize: 18,
    color: T.green,
    letterSpacing: 1,
    paddingBottom: 2
  } }, l)), card.map((text, i) => {
    const isFree = i === FREE_INDEX;
    const isMarked = marked.has(i);
    return /* @__PURE__ */ React.createElement(
      "button",
      {
        key: i,
        onClick: () => toggleCell(i),
        style: {
          width: cellSize,
          height: cellSize,
          borderRadius: 8,
          border: `2px solid ${isMarked ? T.green : T.line}`,
          background: isFree ? T.green : isMarked ? T.soft : T.card,
          color: isFree ? "#fff" : isMarked ? T.green : T.ink,
          fontSize: isFree ? 13 : Math.max(8, Math.min(11, cellSize / 7)),
          fontWeight: isFree ? 900 : isMarked ? 700 : 500,
          padding: 3,
          lineHeight: 1.2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          cursor: isFree ? "default" : "pointer",
          position: "relative",
          transition: "background 0.15s, border-color 0.15s",
          wordBreak: "break-word",
          hyphens: "auto"
        }
      },
      text,
      isMarked && !isFree && /* @__PURE__ */ React.createElement("span", { style: {
        position: "absolute",
        fontSize: cellSize * 0.45,
        opacity: 0.6,
        pointerEvents: "none",
        lineHeight: 1
      } }, "\u26BD")
    );
  }))), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => newCard(squares, true),
      style: { ...btn(), flex: 2 }
    },
    "New card"
  ), prev && /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: undoNewCard,
      style: { ...btn(true), flex: 1 }
    },
    "Undo"
  )), /* @__PURE__ */ React.createElement(Card, { style: { padding: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: T.sub, lineHeight: 1.5 } }, /* @__PURE__ */ React.createElement("b", { style: { color: T.ink } }, "How to play"), /* @__PURE__ */ React.createElement("br", null), "Tap a square when you spot it happening during the match. Tap again to unmark. Get five in a row \u2014 across, down, or diagonal \u2014 to win. The centre square is a free space.", " ", /* @__PURE__ */ React.createElement("b", null, "New card"), " deals a fresh random card (you can undo it if you tap by accident). Add more squares by editing", " ", /* @__PURE__ */ React.createElement("span", { style: { fontFamily: MONO } }, "bingo.json"), " in the repo.")));
}
function App() {
  const [state, setStateRaw] = useState(null);
  const [live, setLive] = useState({ matches: [], advanced: [] });
  const [override, setOverride] = useState({ matches: [], advanced: [] });
  const [feed, setFeed] = useState("loading");
  const [tab, setTab] = useState("board");
  useEffect(() => {
    setStateRaw({ ...DEMO, me: loadLocal().me || null });
    fetch("picks.json", { cache: "no-store" }).then((r) => r.ok ? r.json() : Promise.reject()).then((p) => {
      if (!p || !p.players) return;
      setStateRaw((s) => ({
        ...s,
        demo: false,
        players: p.players.map((pl, i) => ({ id: "p" + i, name: pl.name, shares: pl.shares || {} }))
      }));
    }).catch(() => {
    });
    fetch(FEED_URL, { cache: "no-store" }).then((r) => r.ok ? r.json() : Promise.reject()).then((data) => {
      setLive(parseFeed(data));
      setFeed("live");
    }).catch(() => {
      setFeed("fallback");
    });
    fetch("results.json", { cache: "no-store" }).then((r) => r.ok ? r.json() : Promise.reject()).then((o) => {
      if (o) setOverride({ matches: o.matches || [], advanced: o.advanced || [] });
    }).catch(() => {
    });
  }, []);
  const setState = (fn) => setStateRaw((prev) => {
    const next = typeof fn === "function" ? fn(prev) : fn;
    saveLocal({ me: next.me });
    return next;
  });
  if (!state)
    return /* @__PURE__ */ React.createElement("div", { style: { minHeight: "100vh", background: T.bg, display: "flex", alignItems: "center", justifyContent: "center", color: T.sub } }, "Loading\u2026");
  const merged = mergeResults(live, override);
  const eff = { ...state, matches: merged.matches, advanced: merged.advanced };
  const distributed = Object.values(teamPoints(eff)).reduce((a, b) => a + b, 0);
  const tabs = [
    ["board", "Standings", Trophy],
    ["me", "Players", User],
    ["teams", "Teams", Shield],
    ["bingo", "Bingo", Grid]
  ];
  return /* @__PURE__ */ React.createElement("div", { style: { minHeight: "100vh", background: T.bg, color: T.ink, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" } }, /* @__PURE__ */ React.createElement("header", { style: { background: T.greenDark, color: "#fff", padding: "18px 16px 14px", paddingTop: "calc(18px + env(safe-area-inset-top))" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 24, fontWeight: 900, letterSpacing: -0.5 } }, "WC26 ", /* @__PURE__ */ React.createElement("span", { style: { color: T.gold } }, "SHARES")), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, opacity: 0.85, fontFamily: MONO, marginTop: 2 } }, state.players.length, " players \xB7 max 4 shares per team \xB7 ", fmt(distributed), " pts distributed", /* @__PURE__ */ React.createElement("span", { style: { marginLeft: 8, opacity: 0.7 } }, feed === "live" ? "\xB7 live \u2713" : feed === "fallback" ? "\xB7 offline (schedule only)" : "\xB7 syncing\u2026"))), /* @__PURE__ */ React.createElement("main", { style: { padding: 12, paddingBottom: 84, maxWidth: 560, margin: "0 auto" } }, tab === "board" && /* @__PURE__ */ React.createElement(Leaderboard, { state: eff }), tab === "me" && /* @__PURE__ */ React.createElement(PlayerView, { state: eff, setState }), tab === "teams" && /* @__PURE__ */ React.createElement(TeamsView, { state: eff }), tab === "bingo" && /* @__PURE__ */ React.createElement(BingoView, null)), /* @__PURE__ */ React.createElement("nav", { style: { position: "fixed", bottom: 0, left: 0, right: 0, background: T.card, borderTop: `1px solid ${T.line}`, display: "flex", paddingBottom: "env(safe-area-inset-bottom)" } }, tabs.map(([id, label, Icon]) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: id,
      onClick: () => setTab(id),
      style: {
        flex: 1,
        padding: "10px 0 8px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        color: tab === id ? T.green : T.sub,
        fontWeight: tab === id ? 700 : 500,
        fontSize: 11
      }
    },
    /* @__PURE__ */ React.createElement(Icon, { size: 20 }),
    label
  ))));
}
ReactDOM.createRoot(document.getElementById("root")).render(/* @__PURE__ */ React.createElement(App, null));
