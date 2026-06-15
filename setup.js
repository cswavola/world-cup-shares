// One-time per clone: installs the repo-root pre-commit hook into this clone's
// .git/hooks directory. Cross-platform (no cp/chmod shell dependency).
//   npm run setup
const fs = require("fs");
const path = require("path");

const src = "pre-commit";
const hooksDir = path.join(".git", "hooks");
const dest = path.join(hooksDir, "pre-commit");

if (!fs.existsSync(src)) {
  console.error("Could not find ./pre-commit at the repo root.");
  process.exit(1);
}
fs.mkdirSync(hooksDir, { recursive: true });
fs.copyFileSync(src, dest);
fs.chmodSync(dest, 0o755);
console.log("Installed pre-commit hook -> " + dest);
