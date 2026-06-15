// Validates the hand-edited data files. Exits nonzero if any required file is
// missing or any file is not valid JSON, which aborts the commit when run from
// the pre-commit hook. Uses only Node's stdlib so it works on macOS/Windows/Linux.
const fs = require("fs");

// Must exist AND be valid JSON.
const required = ["picks.json", "bingo.json", "manifest.webmanifest"];
// Optional (the app fetches these at runtime and falls back if absent),
// but must be valid JSON if present.
const optional = ["results.json"];

let failed = false;

function check(file, mustExist) {
  if (!fs.existsSync(file)) {
    if (mustExist) {
      console.error("\u2718 " + file + " is missing");
      failed = true;
    }
    return;
  }
  try {
    JSON.parse(fs.readFileSync(file, "utf8"));
    console.log("\u2714 " + file);
  } catch (e) {
    console.error("\u2718 " + file + " is not valid JSON: " + e.message);
    failed = true;
  }
}

required.forEach(function (f) { check(f, true); });
optional.forEach(function (f) { check(f, false); });

if (failed) {
  console.error("\nJSON validation failed \u2014 fix the file(s) above before committing.");
  process.exit(1);
}
console.log("\nAll JSON files valid.");
