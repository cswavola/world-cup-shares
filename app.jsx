/* =====================================================================
   WC26 SHARES — app.jsx
   A no-build React app. Edit this file directly on github.com if you like;
   the browser compiles it on load (via Babel). The two files you actually
   maintain during the tournament are picks.json (who picked what) and,
   only if the live feed is ever wrong, the in-app admin override.
   ===================================================================== */

const { useState, useEffect, useMemo } = React;

/* ---- charts, drawn in plain SVG (no chart library) ---- */
function RaceChart({ data, players }) {
  const W = 320, H = 190, P = { l: 26, r: 8, t: 8, b: 16 };
  const n = data.length;
  const maxV = Math.max(0.5, ...data.flatMap((d) => players.map((p) => d[p.name] || 0)));
  const x = (i) => P.l + (n <= 1 ? 0 : (i * (W - P.l - P.r)) / (n - 1));
  const y = (v) => H - P.b - (v / maxV) * (H - P.t - P.b);
  const ticks = 4;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block" }}>
      {Array.from({ length: ticks + 1 }, (_, k) => {
        const v = (maxV * k) / ticks, yy = y(v);
        return (
          <g key={k}>
            <line x1={P.l} y1={yy} x2={W - P.r} y2={yy} stroke={T.line} strokeWidth="1" />
            <text x={P.l - 4} y={yy + 3} textAnchor="end" fontSize="7" fill={T.sub} fontFamily={MONO}>{v.toFixed(0)}</text>
          </g>
        );
      })}
      {players.map((p, i) => (
        <polyline key={p.id} fill="none" stroke={PLAYER_COLORS[i % 10]} strokeWidth="2"
          strokeLinejoin="round" strokeLinecap="round"
          points={data.map((d, idx) => `${x(idx)},${y(d[p.name] || 0)}`).join(" ")} />
      ))}
    </svg>
  );
}

function DistBars({ rows }) {
  const max = Math.max(0.01, ...rows.map((r) => r.points));
  return (
    <div className="flex flex-col gap-1" style={{ padding: "0 12px" }}>
      {rows.map((r) => (
        <div key={r.team} className="flex items-center gap-2" style={{ fontSize: 12 }}>
          <span style={{ fontFamily: MONO, width: 34, color: T.sub }}>{r.team}</span>
          <div style={{ flex: 1, background: T.soft, borderRadius: 4, height: 14, overflow: "hidden" }}>
            <div style={{ width: `${(r.points / max) * 100}%`, background: T.green, height: "100%", borderRadius: 4, minWidth: r.points > 0 ? 2 : 0 }} />
          </div>
          <span style={{ fontFamily: MONO, width: 38, textAlign: "right", fontWeight: 700 }}>{fmt(r.points)}</span>
        </div>
      ))}
    </div>
  );
}

/* ---- tiny inline icons (so we don't depend on an icon library) ---- */
const Svg = (p) => (
  <svg width={p.size || 18} height={p.size || 18} viewBox="0 0 24 24" fill="none"
    stroke={p.color || "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {p.children}
  </svg>
);
const Trophy = (p) => <Svg {...p}><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" /></Svg>;
const Shield = (p) => <Svg {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /></Svg>;
const ClipboardList = (p) => <Svg {...p}><rect width="8" height="4" x="8" y="2" rx="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><path d="M12 11h4" /><path d="M12 16h4" /><path d="M8 11h.01" /><path d="M8 16h.01" /></Svg>;
const Settings = (p) => <Svg {...p}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2Z" /><circle cx="12" cy="12" r="3" /></Svg>;
const ChevronDown = (p) => <Svg {...p}><path d="m6 9 6 6 6-6" /></Svg>;
const ChevronUp = (p) => <Svg {...p}><path d="m18 15-6-6-6 6" /></Svg>;
const Plus = (p) => <Svg {...p}><path d="M5 12h14" /><path d="M12 5v14" /></Svg>;
const Minus = (p) => <Svg {...p}><path d="M5 12h14" /></Svg>;
const X = (p) => <Svg {...p}><path d="M18 6 6 18" /><path d="m6 6 12 12" /></Svg>;
const User = (p) => <Svg {...p}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></Svg>;

const T = {
  bg: "#F4F6F1", ink: "#16251D", sub: "#5C6B61", green: "#1F6B4A",
  greenDark: "#14442F", gold: "#E8A02E", card: "#FFFFFF",
  line: "#DCE3DA", soft: "#EAF0E8",
};
const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";

// 48 teams · 12 groups · FIFA ranking
const TEAMS = [
  ["CZE","Czechia","A",41],["KOR","Korea Republic","A",25],["MEX","Mexico","A",15],["RSA","South Africa","A",60],
  ["BIH","Bosnia & Herzegovina","B",65],["CAN","Canada","B",30],["SUI","Switzerland","B",19],["QAT","Qatar","B",55],
  ["BRA","Brazil","C",6],["HAI","Haiti","C",83],["MAR","Morocco","C",8],["SCO","Scotland","C",43],
  ["AUS","Australia","D",27],["PAR","Paraguay","D",40],["TUR","Türkiye","D",22],["USA","USA","D",16],
  ["CIV","Côte d'Ivoire","E",34],["CUW","Curaçao","E",82],["ECU","Ecuador","E",23],["GER","Germany","E",10],
  ["JPN","Japan","F",18],["NED","Netherlands","F",7],["SWE","Sweden","F",38],["TUN","Tunisia","F",44],
  ["BEL","Belgium","G",9],["EGY","Egypt","G",29],["IRN","IR Iran","G",21],["NZL","New Zealand","G",85],
  ["CPV","Cabo Verde","H",69],["KSA","Saudi Arabia","H",61],["ESP","Spain","H",2],["URU","Uruguay","H",17],
  ["FRA","France","I",1],["IRQ","Iraq","I",57],["NOR","Norway","I",31],["SEN","Senegal","I",14],
  ["ALG","Algeria","J",28],["ARG","Argentina","J",3],["AUT","Austria","J",24],["JOR","Jordan","J",63],
  ["COL","Colombia","K",13],["COD","Congo DR","K",46],["POR","Portugal","K",5],["UZB","Uzbekistan","K",50],
  ["CRO","Croatia","L",11],["ENG","England","L",4],["GHA","Ghana","L",74],["PAN","Panama","L",33],
].map(([code, name, group, rank]) => ({ code, name, group, rank }));

const TEAM = Object.fromEntries(TEAMS.map((t) => [t.code, t]));
const GROUPS = "ABCDEFGHIJKL".split("");

// Real group-stage schedule (openfootball, public domain)
const FIXTURES = [
  ["2026-06-11","13:00-6","MEX","RSA","Mexico City"],
  ["2026-06-11","20:00-6","KOR","CZE","Guadalajara"],
  ["2026-06-18","12:00-4","CZE","RSA","Atlanta"],
  ["2026-06-18","19:00-6","MEX","KOR","Guadalajara"],
  ["2026-06-24","19:00-6","CZE","MEX","Mexico City"],
  ["2026-06-24","19:00-6","RSA","KOR","Monterrey"],
  ["2026-06-12","15:00-4","CAN","BIH","Toronto"],
  ["2026-06-13","12:00-7","QAT","SUI","San Francisco Bay Area"],
  ["2026-06-18","12:00-7","SUI","BIH","Los Angeles"],
  ["2026-06-18","15:00-7","CAN","QAT","Vancouver"],
  ["2026-06-24","12:00-7","SUI","CAN","Vancouver"],
  ["2026-06-24","12:00-7","BIH","QAT","Seattle"],
  ["2026-06-13","18:00-4","BRA","MAR","New York/New Jersey"],
  ["2026-06-13","21:00-4","HAI","SCO","Boston"],
  ["2026-06-19","18:00-4","SCO","MAR","Boston"],
  ["2026-06-19","20:30-4","BRA","HAI","Philadelphia"],
  ["2026-06-24","18:00-4","SCO","BRA","Miami"],
  ["2026-06-24","18:00-4","MAR","HAI","Atlanta"],
  ["2026-06-12","18:00-7","USA","PAR","Los Angeles"],
  ["2026-06-13","21:00-7","AUS","TUR","Vancouver"],
  ["2026-06-19","12:00-7","USA","AUS","Seattle"],
  ["2026-06-19","20:00-7","TUR","PAR","San Francisco Bay Area"],
  ["2026-06-25","19:00-7","TUR","USA","Los Angeles"],
  ["2026-06-25","19:00-7","PAR","AUS","San Francisco Bay Area"],
  ["2026-06-14","12:00-5","GER","CUW","Houston"],
  ["2026-06-14","19:00-4","CIV","ECU","Philadelphia"],
  ["2026-06-20","16:00-4","GER","CIV","Toronto"],
  ["2026-06-20","19:00-5","ECU","CUW","Kansas City"],
  ["2026-06-25","16:00-4","CUW","CIV","Philadelphia"],
  ["2026-06-25","16:00-4","ECU","GER","New York/New Jersey"],
  ["2026-06-14","15:00-5","NED","JPN","Dallas"],
  ["2026-06-14","20:00-6","SWE","TUN","Monterrey"],
  ["2026-06-20","12:00-5","NED","SWE","Houston"],
  ["2026-06-20","22:00-6","TUN","JPN","Monterrey"],
  ["2026-06-25","18:00-5","JPN","SWE","Dallas"],
  ["2026-06-25","18:00-5","TUN","NED","Kansas City"],
  ["2026-06-15","12:00-7","BEL","EGY","Seattle"],
  ["2026-06-15","18:00-7","IRN","NZL","Los Angeles"],
  ["2026-06-21","12:00-7","BEL","IRN","Los Angeles"],
  ["2026-06-21","18:00-7","NZL","EGY","Vancouver"],
  ["2026-06-26","20:00-7","EGY","IRN","Seattle"],
  ["2026-06-26","20:00-7","NZL","BEL","Vancouver"],
  ["2026-06-15","12:00-4","ESP","CPV","Atlanta"],
  ["2026-06-15","18:00-4","KSA","URU","Miami"],
  ["2026-06-21","12:00-4","ESP","KSA","Atlanta"],
  ["2026-06-21","18:00-4","URU","CPV","Miami"],
  ["2026-06-26","19:00-5","CPV","KSA","Houston"],
  ["2026-06-26","18:00-6","URU","ESP","Guadalajara"],
  ["2026-06-16","15:00-4","FRA","SEN","New York/New Jersey"],
  ["2026-06-16","18:00-4","IRQ","NOR","Boston"],
  ["2026-06-22","17:00-4","FRA","IRQ","Philadelphia"],
  ["2026-06-22","20:00-4","NOR","SEN","New York/New Jersey"],
  ["2026-06-26","15:00-4","NOR","FRA","Boston"],
  ["2026-06-26","15:00-4","SEN","IRQ","Toronto"],
  ["2026-06-16","20:00-5","ARG","ALG","Kansas City"],
  ["2026-06-16","21:00-7","AUT","JOR","San Francisco Bay Area"],
  ["2026-06-22","12:00-5","ARG","AUT","Dallas"],
  ["2026-06-22","20:00-7","JOR","ALG","San Francisco Bay Area"],
  ["2026-06-27","21:00-5","ALG","AUT","Kansas City"],
  ["2026-06-27","21:00-5","JOR","ARG","Dallas"],
  ["2026-06-17","12:00-5","POR","COD","Houston"],
  ["2026-06-17","20:00-6","UZB","COL","Mexico City"],
  ["2026-06-23","12:00-5","POR","UZB","Houston"],
  ["2026-06-23","20:00-6","COL","COD","Guadalajara"],
  ["2026-06-27","19:30-4","COL","POR","Miami"],
  ["2026-06-27","19:30-4","COD","UZB","Atlanta"],
  ["2026-06-17","15:00-5","ENG","CRO","Dallas"],
  ["2026-06-17","19:00-4","GHA","PAN","Toronto"],
  ["2026-06-23","16:00-4","ENG","GHA","Boston"],
  ["2026-06-23","19:00-4","PAN","CRO","Toronto"],
  ["2026-06-27","17:00-4","PAN","ENG","New York/New Jersey"],
  ["2026-06-27","17:00-4","CRO","GHA","Philadelphia"],
].map(([date, time, a, b, city]) => ({ date, time, a, b, city }));


const STAGES = [
  { id: "group", label: "Group stage", win: 1, draw: 0.5 },
  { id: "r32", label: "Round of 32", win: 2 },
  { id: "r16", label: "Round of 16", win: 4 },
  { id: "qf", label: "Quarter-final", win: 8 },
  { id: "sf", label: "Semi-final", win: 16 },
  { id: "third", label: "Third place", win: 8 },
  { id: "final", label: "Final", win: 32 },
];
const STAGE = Object.fromEntries(STAGES.map((s) => [s.id, s]));

const PLAYER_COLORS = ["#1F6B4A","#E8A02E","#3E6FB0","#C84B3C","#7A5BA6","#2E8F8A","#B0563E","#5E7D2E","#9A4D7E","#54616B"];

const DEMO = {
  demo: true,
  locked: false,
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
    { id: "p10", name: "Erwin", shares: { URU: 3, CRO: 3, SEN: 2, EGY: 2 } },
  ],
  matches: [
    { id: "m1", stage: "group", a: "MEX", b: "RSA", outcome: "a" },
    { id: "m2", stage: "group", a: "KOR", b: "CZE", outcome: "draw" },
    { id: "m3", stage: "group", a: "CAN", b: "QAT", outcome: "a" },
    { id: "m4", stage: "group", a: "BRA", b: "SCO", outcome: "a" },
    { id: "m5", stage: "group", a: "ESP", b: "URU", outcome: "draw" },
    { id: "m6", stage: "group", a: "FRA", b: "IRQ", outcome: "a" },
    { id: "m7", stage: "group", a: "JPN", b: "TUN", outcome: "a" },
    { id: "m8", stage: "group", a: "MAR", b: "HAI", outcome: "a" },
  ],
  advanced: [],
};

/* ---------- scoring engine: the heart of the app ---------- */

function teamPoints(state) {
  const pts = Object.fromEntries(TEAMS.map((t) => [t.code, 0]));
  for (const m of state.matches) {
    const s = STAGE[m.stage];
    if (!s) continue;
    if (m.outcome === "draw" && s.draw) { pts[m.a] += s.draw; pts[m.b] += s.draw; }
    else if (m.outcome === "a") pts[m.a] += s.win;
    else if (m.outcome === "b") pts[m.b] += s.win;
  }
  for (const code of state.advanced) pts[code] += 1; // reaching the knockout stage
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
  return state.players
    .map((p) => {
      const rows = Object.entries(p.shares)
        .filter(([, n]) => n > 0)
        .map(([code, n]) => ({
          code, shares: n, pool: tot[code] || n, teamPts: tp[code],
          payout: tot[code] ? (tp[code] * n) / tot[code] : 0,
        }))
        .sort((x, y) => y.payout - x.payout);
      return { ...p, rows, total: rows.reduce((s, r) => s + r.payout, 0) };
    })
    .sort((a, b) => b.total - a.total);
}

const fmt = (x) => (Math.round(x * 100) / 100).toFixed(2);

// Cumulative points after each result, for the race chart.
// Qualification bonuses are treated as banked from the start so the
// final data point always matches the standings total.
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
        if (tot[code]) s += ((tp[code] || 0) * n) / tot[code];
      row[p.name] = Math.round(s * 1000) / 1000;
    }
    return row;
  };
  const data = [snap("•")];
  chron.forEach((m, i) => {
    const s = STAGE[m.stage];
    if (s) {
      if (m.outcome === "draw" && s.draw) { tp[m.a] += s.draw; tp[m.b] += s.draw; }
      else if (m.outcome === "a") tp[m.a] += s.win;
      else if (m.outcome === "b") tp[m.b] += s.win;
    }
    data.push(snap(String(i + 1)));
  });
  return data;
}

/* ---------- shared bits ---------- */

function Card({ children, style }) {
  return (
    <div style={{ background: T.card, border: `1px solid ${T.line}`, borderRadius: 14, ...style }}>
      {children}
    </div>
  );
}

function ShareBar({ code, players, tot }) {
  // signature element: who owns this team, as proportional slices
  const owners = players
    .map((p, i) => ({ name: p.name, n: p.shares[code] || 0, color: PLAYER_COLORS[i % 10] }))
    .filter((o) => o.n > 0);
  if (!owners.length)
    return <div style={{ height: 8, borderRadius: 4, background: T.soft }} />;
  return (
    <div style={{ display: "flex", height: 8, borderRadius: 4, overflow: "hidden" }}>
      {owners.map((o, i) => (
        <div key={i} title={`${o.name}: ${o.n}`} style={{ flex: o.n, background: o.color, marginRight: i < owners.length - 1 ? 1 : 0 }} />
      ))}
      <span style={{ display: "none" }}>{tot}</span>
    </div>
  );
}

/* ---------- views ---------- */

function Leaderboard({ state }) {
  const [open, setOpen] = useState(null);
  const [mode, setMode] = useState("table");
  const board = useMemo(() => leaderboard(state), [state]);
  const race = useMemo(() => pointsRace(state), [state]);
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-1" style={{ background: T.soft, borderRadius: 10, padding: 3 }}>
        {[["table", "Table"], ["race", "Race"]].map(([id, label]) => (
          <button key={id} onClick={() => setMode(id)}
            style={{ flex: 1, padding: 8, borderRadius: 8, fontSize: 13, fontWeight: 700,
              background: mode === id ? T.card : "transparent",
              color: mode === id ? T.ink : T.sub,
              boxShadow: mode === id ? "0 1px 2px rgba(0,0,0,0.08)" : "none" }}>
            {label}
          </button>
        ))}
      </div>
      {mode === "race" && (
        <Card style={{ padding: "12px 4px 4px" }}>
          <RaceChart data={race} players={state.players} />
          <div className="flex flex-wrap gap-2" style={{ padding: "6px 10px" }}>
            {state.players.map((p, i) => (
              <span key={p.id} style={{ fontSize: 11, color: T.sub, display: "inline-flex", alignItems: "center", gap: 4 }}>
                <span style={{ width: 8, height: 8, borderRadius: 4, background: PLAYER_COLORS[i % 10] }} />
                {p.name}
              </span>
            ))}
          </div>
          <div style={{ fontSize: 11, color: T.sub, padding: "0 10px 6px" }}>
            Cumulative points after each result.
          </div>
        </Card>
      )}
      {mode === "table" && board.map((p, i) => {
        const color = PLAYER_COLORS[state.players.findIndex((x) => x.id === p.id) % 10];
        const isOpen = open === p.id;
        return (
          <Card key={p.id} style={i === 0 && p.total > 0 ? { borderColor: T.gold, boxShadow: `0 0 0 1px ${T.gold}` } : {}}>
            <button onClick={() => setOpen(isOpen ? null : p.id)}
              className="w-full flex items-center gap-3 p-3 text-left">
              <span style={{ fontFamily: MONO, fontSize: 13, color: T.sub, width: 22 }}>{i + 1}</span>
              <span style={{ width: 10, height: 10, borderRadius: 5, background: color, flexShrink: 0 }} />
              <span style={{ fontWeight: 700, flex: 1 }}>{p.name}</span>
              {i === 0 && p.total > 0 && <Trophy size={16} color={T.gold} />}
              <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 17 }}>{fmt(p.total)}</span>
              {isOpen ? <ChevronUp size={16} color={T.sub} /> : <ChevronDown size={16} color={T.sub} />}
            </button>
            {isOpen && (
              <div style={{ borderTop: `1px solid ${T.line}`, padding: "8px 12px 12px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto auto", gap: "4px 12px", fontSize: 13 }}>
                  <span style={{ color: T.sub, fontSize: 11 }}>TEAM</span>
                  <span style={{ color: T.sub, fontSize: 11, fontFamily: MONO }}>OWN</span>
                  <span style={{ color: T.sub, fontSize: 11, fontFamily: MONO }}>TEAM PTS</span>
                  <span style={{ color: T.sub, fontSize: 11, fontFamily: MONO }}>YOURS</span>
                  {p.rows.map((r) => (
                    <FragmentRow key={r.code} r={r} />
                  ))}
                </div>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}

function FragmentRow({ r }) {
  return (
    <>
      <span>{TEAM[r.code].name}</span>
      <span style={{ fontFamily: MONO }}>{r.shares}/{r.pool}</span>
      <span style={{ fontFamily: MONO }}>{fmt(r.teamPts)}</span>
      <span style={{ fontFamily: MONO, fontWeight: 700, color: T.green }}>{fmt(r.payout)}</span>
    </>
  );
}

function PlayerView({ state, setState }) {
  const board = useMemo(() => leaderboard(state), [state]);
  const sel = board.find((p) => p.id === state.me) || board[0];
  const today = new Date().toISOString().slice(0, 10);
  const fixtures = useMemo(() => {
    if (!sel) return [];
    return FIXTURES.filter((f) => f.date >= today && (sel.shares[f.a] || sel.shares[f.b])).slice(0, 14);
  }, [sel, today]);

  if (!sel)
    return <Card style={{ padding: 16, color: T.sub, fontSize: 14 }}>No players yet — add them in the Picks tab.</Card>;

  const rank = board.findIndex((p) => p.id === sel.id) + 1;
  const dist = sel.rows.map((r) => ({ team: r.code, points: Math.round(r.payout * 100) / 100 }));
  const fmtDate = (d) => new Date(d + "T12:00:00").toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" });

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2" style={{ overflowX: "auto", paddingBottom: 2 }}>
        {board.map((p) => {
          const i = state.players.findIndex((x) => x.id === p.id);
          const on = p.id === sel.id;
          return (
            <button key={p.id} onClick={() => setState((s) => ({ ...s, me: p.id }))}
              style={{ padding: "7px 12px", borderRadius: 999, whiteSpace: "nowrap", fontSize: 13, fontWeight: 600, flexShrink: 0,
                border: `1px solid ${on ? T.green : T.line}`, background: on ? T.green : T.card, color: on ? "#fff" : T.ink }}>
              <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 4, background: PLAYER_COLORS[i % 10], marginRight: 6 }} />
              {p.name}
            </button>
          );
        })}
      </div>

      <Card style={{ padding: 14 }}>
        <div className="flex items-center gap-2">
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 800 }}>{sel.name}</div>
            <div style={{ fontSize: 12, color: T.sub }}>
              #{rank} of {board.length} · {sel.rows.length} teams
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: MONO, fontSize: 24, fontWeight: 800, color: T.green }}>{fmt(sel.total)}</div>
            <div style={{ fontSize: 11, color: T.sub }}>points</div>
          </div>
        </div>
      </Card>

      <Card style={{ padding: "14px 0 8px" }}>
        <div style={{ fontWeight: 700, fontSize: 14, padding: "0 0 8px 14px" }}>Where the points come from</div>
        <DistBars rows={dist} />
      </Card>

      <div>
        <div style={{ fontSize: 11, letterSpacing: 2, color: T.sub, fontWeight: 700, margin: "0 4px 6px" }}>
          UPCOMING FIXTURES
        </div>
        <Card>
          {fixtures.length === 0 && (
            <div style={{ padding: 16, color: T.sub, fontSize: 14 }}>
              No group fixtures left for these teams. Knockout fixtures appear once the bracket is set.
            </div>
          )}
          {fixtures.map((f, i) => (
            <div key={i} style={{ padding: "10px 12px", borderTop: i ? `1px solid ${T.line}` : "none" }}>
              <div className="flex items-center gap-2">
                <span style={{ fontSize: 14, flex: 1 }}>
                  <b style={{ color: sel.shares[f.a] ? T.green : T.ink }}>{TEAM[f.a].name}</b>
                  <span style={{ color: T.sub }}> v </span>
                  <b style={{ color: sel.shares[f.b] ? T.green : T.ink }}>{TEAM[f.b].name}</b>
                </span>
                <span style={{ fontFamily: MONO, fontSize: 11, color: T.sub }}>{fmtDate(f.date)}</span>
              </div>
              <div style={{ fontSize: 11, color: T.sub, marginTop: 2 }}>{f.city} · kickoff {f.time}</div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

function TeamsView({ state }) {
  const tp = useMemo(() => teamPoints(state), [state]);
  const tot = useMemo(() => totalShares(state), [state]);
  return (
    <div className="flex flex-col gap-4">
      {GROUPS.map((g) => (
        <div key={g}>
          <div style={{ fontSize: 11, letterSpacing: 2, color: T.sub, fontWeight: 700, margin: "0 4px 6px" }}>
            GROUP {g}
          </div>
          <Card>
            {TEAMS.filter((t) => t.group === g).map((t, i) => (
              <div key={t.code} style={{ padding: "10px 12px", borderTop: i ? `1px solid ${T.line}` : "none" }}>
                <div className="flex items-center gap-2" style={{ marginBottom: 6 }}>
                  <span style={{ fontFamily: MONO, fontSize: 11, color: T.sub, width: 30 }}>{t.code}</span>
                  <span style={{ fontWeight: 600, flex: 1, fontSize: 14 }}>{t.name}</span>
                  <span style={{ fontSize: 11, color: T.sub }}>FIFA {t.rank}</span>
                  <span style={{ fontFamily: MONO, fontSize: 13, fontWeight: 700, color: tp[t.code] ? T.green : T.sub, width: 44, textAlign: "right" }}>
                    {fmt(tp[t.code])}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div style={{ flex: 1 }}><ShareBar code={t.code} players={state.players} tot={tot[t.code]} /></div>
                  <span style={{ fontFamily: MONO, fontSize: 11, color: T.sub, width: 50, textAlign: "right" }}>
                    {tot[t.code] || 0} sh
                  </span>
                </div>
              </div>
            ))}
          </Card>
        </div>
      ))}
    </div>
  );
}

function MatchesView({ state, setState }) {
  const [stage, setStage] = useState("group");
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const sel = { width: "100%", padding: 10, borderRadius: 10, border: `1px solid ${T.line}`, background: T.card, fontSize: 14, color: T.ink };

  const addMatch = (outcome) => {
    if (!a || !b || a === b) return;
    setState((s) => ({ ...s, matches: [{ id: "m" + Date.now(), stage, a, b, outcome }, ...s.matches] }));
    setA(""); setB("");
  };
  const removeMatch = (id) => setState((s) => ({ ...s, matches: s.matches.filter((m) => m.id !== id) }));
  const toggleAdv = (code) =>
    setState((s) => ({ ...s, advanced: s.advanced.includes(code) ? s.advanced.filter((c) => c !== code) : [...s.advanced, code] }));

  const outcomeText = (m) =>
    m.outcome === "draw" ? `${TEAM[m.a].name} drew ${TEAM[m.b].name}`
      : m.outcome === "a" ? `${TEAM[m.a].name} beat ${TEAM[m.b].name}`
      : `${TEAM[m.b].name} beat ${TEAM[m.a].name}`;

  return (
    <div className="flex flex-col gap-4">
      <Card style={{ padding: 12, background: T.soft }}>
        <div style={{ fontSize: 13 }}>
          <b>In the deployed app this tab fills itself in</b> from a live results
          feed — no typing. The form below stays as an admin override (and for
          testing the scoring here in the prototype).
        </div>
      </Card>
      <Card style={{ padding: 12 }}>
        <div style={{ fontWeight: 700, marginBottom: 8 }}>Enter a result (admin override)</div>
        <div className="flex flex-col gap-2">
          <select style={sel} value={stage} onChange={(e) => setStage(e.target.value)}>
            {STAGES.map((s) => <option key={s.id} value={s.id}>{s.label} (win {s.win}{s.draw ? `, draw ${s.draw}` : ""})</option>)}
          </select>
          <div className="flex gap-2">
            <select style={sel} value={a} onChange={(e) => setA(e.target.value)}>
              <option value="">Team A…</option>
              {TEAMS.map((t) => <option key={t.code} value={t.code}>{t.name}</option>)}
            </select>
            <select style={sel} value={b} onChange={(e) => setB(e.target.value)}>
              <option value="">Team B…</option>
              {TEAMS.map((t) => <option key={t.code} value={t.code}>{t.name}</option>)}
            </select>
          </div>
          <div className="flex gap-2">
            <button onClick={() => addMatch("a")} style={btn()}>A wins</button>
            {stage === "group" && <button onClick={() => addMatch("draw")} style={btn(true)}>Draw</button>}
            <button onClick={() => addMatch("b")} style={btn()}>B wins</button>
          </div>
        </div>
      </Card>

      <Card style={{ padding: 12 }}>
        <div style={{ fontWeight: 700, marginBottom: 2 }}>Reached the knockouts (+1 pt)</div>
        <div style={{ fontSize: 12, color: T.sub, marginBottom: 8 }}>Tap teams as they qualify for the round of 32.</div>
        <div className="flex flex-wrap gap-1">
          {TEAMS.map((t) => {
            const on = state.advanced.includes(t.code);
            return (
              <button key={t.code} onClick={() => toggleAdv(t.code)}
                style={{ padding: "5px 9px", borderRadius: 999, fontSize: 12, fontFamily: MONO,
                  border: `1px solid ${on ? T.green : T.line}`,
                  background: on ? T.green : T.card, color: on ? "#fff" : T.sub }}>
                {t.code}
              </button>
            );
          })}
        </div>
      </Card>

      <div>
        <div style={{ fontSize: 11, letterSpacing: 2, color: T.sub, fontWeight: 700, margin: "0 4px 6px" }}>
          RESULTS ({state.matches.length})
        </div>
        <Card>
          {state.matches.length === 0 && (
            <div style={{ padding: 16, color: T.sub, fontSize: 14 }}>No results yet — enter the first one above.</div>
          )}
          {state.matches.map((m, i) => (
            <div key={m.id} className="flex items-center gap-2"
              style={{ padding: "10px 12px", borderTop: i ? `1px solid ${T.line}` : "none" }}>
              <span style={{ fontSize: 14, flex: 1 }}>{outcomeText(m)}</span>
              <span style={{ fontSize: 11, color: T.sub, fontFamily: MONO }}>{STAGE[m.stage].label}</span>
              <button onClick={() => removeMatch(m.id)} aria-label="Remove result"><X size={14} color={T.sub} /></button>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

const btn = (outline) => ({
  flex: 1, padding: 10, borderRadius: 10, fontWeight: 700, fontSize: 14,
  background: outline ? T.card : T.green, color: outline ? T.green : "#fff",
  border: `1px solid ${T.green}`,
});

function SetupView({ state, setState, resetDemo }) {
  const [newName, setNewName] = useState("");
  const setShares = (pid, code, delta) =>
    setState((s) => ({
      ...s,
      players: s.players.map((p) => {
        if (p.id !== pid) return p;
        const cur = p.shares[code] || 0;
        const next = Math.max(0, Math.min(4, cur + delta)); // max 4 per team
        const used = Object.values(p.shares).reduce((x, y) => x + y, 0) - cur;
        const capped = Math.min(next, 10 - used); // 10 shares total
        const shares = { ...p.shares, [code]: capped };
        if (!capped) delete shares[code];
        return { ...p, shares };
      }),
    }));

  return (
    <div className="flex flex-col gap-3">
      {state.demo && (
        <Card style={{ padding: 12, background: "#FBF3E2", borderColor: T.gold }}>
          <div style={{ fontSize: 13 }}>
            <b>Demo data loaded.</b> Replace these players and results with your real ones, or keep poking around.
          </div>
        </Card>
      )}
      <Card style={{ padding: 12 }}>
        <div className="flex items-center gap-2">
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 14 }}>
              {state.locked ? "Picks are locked" : "Picks are open"}
            </div>
            <div style={{ fontSize: 12, color: T.sub }}>
              {state.locked
                ? "Per the rules, no changes after kickoff."
                : "Lock at kickoff of the first match."}
            </div>
          </div>
          <button onClick={() => setState((s) => ({ ...s, locked: !s.locked }))}
            style={{ ...btn(state.locked), flex: "none", padding: "8px 14px", fontSize: 13 }}>
            {state.locked ? "Unlock (admin)" : "Lock picks"}
          </button>
        </div>
      </Card>
      {state.players.map((p, i) => {
        const used = Object.values(p.shares).reduce((x, y) => x + y, 0);
        return (
          <Card key={p.id} style={{ padding: 12 }}>
            <div className="flex items-center gap-2" style={{ marginBottom: 8 }}>
              <span style={{ width: 10, height: 10, borderRadius: 5, background: PLAYER_COLORS[i % 10] }} />
              <span style={{ fontWeight: 700, flex: 1 }}>{p.name}</span>
              <span style={{ fontFamily: MONO, fontSize: 12, color: used === 10 ? T.green : "#C84B3C", fontWeight: 700 }}>
                {used}/10 shares
              </span>
              {!state.locked && (
                <button aria-label={`Remove ${p.name}`}
                  onClick={() => setState((s) => ({ ...s, players: s.players.filter((x) => x.id !== p.id) }))}>
                  <X size={14} color={T.sub} />
                </button>
              )}
            </div>
            <div className="flex flex-col gap-1">
              {Object.entries(p.shares).map(([code, n]) => (
                <div key={code} className="flex items-center gap-2" style={{ fontSize: 14 }}>
                  <span style={{ flex: 1 }}>{TEAM[code].name}</span>
                  {!state.locked && <button onClick={() => setShares(p.id, code, -1)} style={stepBtn} aria-label="One fewer share"><Minus size={13} /></button>}
                  <span style={{ fontFamily: MONO, width: 24, textAlign: "center", fontWeight: 700 }}>{state.locked ? `×${n}` : n}</span>
                  {!state.locked && <button onClick={() => setShares(p.id, code, 1)} style={stepBtn} aria-label="One more share"><Plus size={13} /></button>}
                </div>
              ))}
              {!state.locked && (
                <select
                  style={{ marginTop: 4, padding: 8, borderRadius: 10, border: `1px dashed ${T.line}`, background: T.bg, fontSize: 13, color: T.sub }}
                  value="" onChange={(e) => e.target.value && setShares(p.id, e.target.value, 1)}>
                  <option value="">+ Add a team…</option>
                  {TEAMS.filter((t) => !p.shares[t.code]).map((t) => (
                    <option key={t.code} value={t.code}>{t.name} (Group {t.group}, FIFA {t.rank})</option>
                  ))}
                </select>
              )}
            </div>
          </Card>
        );
      })}
      {!state.locked && (
      <Card style={{ padding: 12 }}>
        <div className="flex gap-2">
          <input
            style={{ flex: 1, padding: 10, borderRadius: 10, border: `1px solid ${T.line}`, fontSize: 14 }}
            placeholder="New player name" value={newName} onChange={(e) => setNewName(e.target.value)} />
          <button style={{ ...btn(), flex: "none", padding: "10px 16px" }}
            onClick={() => {
              if (!newName.trim()) return;
              setState((s) => ({ ...s, players: [...s.players, { id: "p" + Date.now(), name: newName.trim(), shares: {} }] }));
              setNewName("");
            }}>
            Add
          </button>
        </div>
      </Card>
      )}
      <button onClick={resetDemo} style={{ padding: 10, fontSize: 13, color: T.sub, textDecoration: "underline" }}>
        Reset to demo data
      </button>
    </div>
  );
}

const stepBtn = {
  width: 26, height: 26, borderRadius: 8, border: `1px solid ${T.line}`,
  display: "flex", alignItems: "center", justifyContent: "center", background: T.card, color: T.ink,
};


/* ---------- live results feed (with embedded fallback) ---------- */

// openfootball: one public-domain file holding the schedule AND scores.
const FEED_URL = "https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json";

const NAME2CODE = {
  "Mexico":"MEX","South Africa":"RSA","South Korea":"KOR","Czech Republic":"CZE",
  "Bosnia & Herzegovina":"BIH","Canada":"CAN","Switzerland":"SUI","Qatar":"QAT","Brazil":"BRA",
  "Haiti":"HAI","Morocco":"MAR","Scotland":"SCO","Australia":"AUS","Paraguay":"PAR","Turkey":"TUR",
  "USA":"USA","Ivory Coast":"CIV","Curaçao":"CUW","Ecuador":"ECU","Germany":"GER","Japan":"JPN",
  "Netherlands":"NED","Sweden":"SWE","Tunisia":"TUN","Belgium":"BEL","Egypt":"EGY","Iran":"IRN",
  "New Zealand":"NZL","Cape Verde":"CPV","Saudi Arabia":"KSA","Spain":"ESP","Uruguay":"URU",
  "France":"FRA","Iraq":"IRQ","Norway":"NOR","Senegal":"SEN","Algeria":"ALG","Argentina":"ARG",
  "Austria":"AUT","Jordan":"JOR","Colombia":"COL","DR Congo":"COD","Portugal":"POR",
  "Uzbekistan":"UZB","Croatia":"CRO","England":"ENG","Ghana":"GHA","Panama":"PAN",
};

const ROUND2STAGE = {
  "Round of 32": "r32", "Round of 16": "r16", "Quarter-final": "qf",
  "Semi-final": "sf", "Match for third place": "third", "Final": "final",
};

// Turn the openfootball file into {matches, advanced} our scorer understands.
function parseFeed(data) {
  const matches = [];
  const advanced = new Set();
  for (const m of data.matches || []) {
    const a = NAME2CODE[m.team1], b = NAME2CODE[m.team2];
    if (!a || !b) continue;                       // unresolved placeholder (e.g. "Winner Group A")
    const stage = ROUND2STAGE[m.round] || "group";
    if (stage === "r32") { advanced.add(a); advanced.add(b); }  // reached the knockouts → +1
    const sc = m.score;
    if (!sc || !sc.ft) continue;                  // not played yet
    let [x, y] = sc.ft;
    let outcome;
    if (stage === "group") {
      outcome = x > y ? "a" : y > x ? "b" : "draw";
    } else {
      if (x === y && sc.et) [x, y] = sc.et;       // extra time
      if (x === y && sc.p) [x, y] = sc.p;         // penalties
      if (x === y) continue;                       // still undecided
      outcome = x > y ? "a" : "b";
    }
    matches.push({ id: m.date + a + b, date: m.date, stage, a, b, outcome });
  }
  return { matches, advanced: [...advanced] };
}

// Merge live results with the admin's manual overrides (manual wins on conflict).
function mergeResults(live, manual, manualAdv) {
  const key = (m) => `${m.stage}:${[m.a, m.b].sort().join("-")}`;
  const byKey = new Map();
  for (const m of live.matches) byKey.set(key(m), m);
  for (const m of manual) byKey.set(key(m), m);   // override
  return {
    matches: [...byKey.values()],
    advanced: [...new Set([...live.advanced, ...(manualAdv || [])])],
  };
}

/* ---------- app shell ---------- */

const LS_KEY = "wc26-local-v1";          // device-local: manual overrides, selected player, draft picks
const loadLocal = () => {
  try { return JSON.parse(localStorage.getItem(LS_KEY)) || {}; } catch { return {}; }
};
const saveLocal = (o) => { try { localStorage.setItem(LS_KEY, JSON.stringify(o)); } catch {} };

function ExportButton({ state }) {
  const onClick = () => {
    const payload = JSON.stringify(
      { locked: state.locked, players: state.players.map((p) => ({ name: p.name, shares: p.shares })) },
      null, 2
    );
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "picks.json"; a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <button onClick={onClick}
      style={{ padding: 12, borderRadius: 10, fontWeight: 700, fontSize: 14, background: T.greenDark, color: "#fff", width: "100%" }}>
      Export picks.json
    </button>
  );
}

function App() {
  const [state, setStateRaw] = useState(null);   // players, locked, me, demo, matches(manual), advanced(manual)
  const [live, setLive] = useState({ matches: [], advanced: [] });
  const [feed, setFeed] = useState("loading");    // loading | live | fallback
  const [tab, setTab] = useState("board");

  // 1) boot from local draft (or demo), 2) let picks.json override players/locked, 3) pull live results
  useEffect(() => {
    const local = loadLocal();
    let initial = { ...DEMO, ...local };
    setStateRaw(initial);

    fetch("picks.json", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((p) => {
        if (!p || !p.players) return;
        setStateRaw((s) => ({
          ...s,
          demo: false,
          locked: p.locked ?? s.locked,
          players: p.players.map((pl, i) => ({ id: "p" + i, name: pl.name, shares: pl.shares || {} })),
        }));
      })
      .catch(() => {});

    fetch(FEED_URL, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => { setLive(parseFeed(data)); setFeed("live"); })
      .catch(() => { setFeed("fallback"); });
  }, []);

  const setState = (fn) =>
    setStateRaw((prev) => {
      const next = typeof fn === "function" ? fn(prev) : fn;
      saveLocal({ me: next.me, locked: next.locked, players: next.players, matches: next.matches, advanced: next.advanced, demo: next.demo });
      return next;
    });

  if (!state)
    return <div style={{ minHeight: "100vh", background: T.bg, display: "flex", alignItems: "center", justifyContent: "center", color: T.sub }}>Loading…</div>;

  // effective results = live feed + manual overrides; this is what the read-only views score against
  const merged = mergeResults(live, state.matches || [], state.advanced || []);
  const eff = { ...state, matches: merged.matches, advanced: merged.advanced };

  const distributed = Object.values(teamPoints(eff)).reduce((a, b) => a + b, 0);
  const tabs = [
    ["board", "Standings", Trophy],
    ["me", "Players", User],
    ["teams", "Teams", Shield],
    ["matches", "Admin", ClipboardList],
    ["setup", "Picks", Settings],
  ];

  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.ink, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <header style={{ background: T.greenDark, color: "#fff", padding: "18px 16px 14px", paddingTop: "calc(18px + env(safe-area-inset-top))" }}>
        <div style={{ fontSize: 24, fontWeight: 900, letterSpacing: -0.5 }}>
          WC26 <span style={{ color: T.gold }}>SHARES</span>
        </div>
        <div style={{ fontSize: 12, opacity: 0.85, fontFamily: MONO, marginTop: 2 }}>
          10 shares · max 4 per team · {fmt(distributed)} pts distributed
          <span style={{ marginLeft: 8, opacity: 0.7 }}>
            {feed === "live" ? "· live ✓" : feed === "fallback" ? "· offline (schedule only)" : "· syncing…"}
          </span>
        </div>
      </header>

      <main style={{ padding: 12, paddingBottom: 84, maxWidth: 560, margin: "0 auto" }}>
        {tab === "board" && <Leaderboard state={eff} />}
        {tab === "me" && <PlayerView state={eff} setState={setState} />}
        {tab === "teams" && <TeamsView state={eff} />}
        {tab === "matches" && <MatchesView state={state} setState={setState} />}
        {tab === "setup" && (
          <div className="flex flex-col gap-3">
            <SetupView state={state} setState={setState} resetDemo={() => setState({ ...DEMO })} />
            <ExportButton state={state} />
            <div style={{ fontSize: 12, color: T.sub, padding: "0 4px" }}>
              Build everyone's picks here, tap <b>Export picks.json</b>, then commit that file to your repo.
              Whatever is in picks.json is what your friends load.
            </div>
          </div>
        )}
      </main>

      <nav style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: T.card, borderTop: `1px solid ${T.line}`, display: "flex", paddingBottom: "env(safe-area-inset-bottom)" }}>
        {tabs.map(([id, label, Icon]) => (
          <button key={id} onClick={() => setTab(id)}
            style={{ flex: 1, padding: "10px 0 8px", display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
              color: tab === id ? T.green : T.sub, fontWeight: tab === id ? 700 : 500, fontSize: 11 }}>
            <Icon size={20} />
            {label}
          </button>
        ))}
      </nav>
    </div>
  );
}


ReactDOM.createRoot(document.getElementById("root")).render(<App />);
