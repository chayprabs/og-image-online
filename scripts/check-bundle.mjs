import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const DIST = "packages/web/dist";
const MAX_TOTAL_MB = 25;

function totalSizeMb(dir) {
  let total = 0;
  for (const name of readdirSync(dir, { recursive: true })) {
    const p = join(dir, String(name));
    try {
      const st = statSync(p);
      if (st.isFile()) total += st.size;
    } catch {
      /* skip */
    }
  }
  return total / (1024 * 1024);
}

const mb = totalSizeMb(DIST);
console.log(`Total dist size: ${mb.toFixed(2)} MB (budget ${MAX_TOTAL_MB} MB)`);
if (mb > MAX_TOTAL_MB) {
  console.error("Bundle budget exceeded");
  process.exit(1);
}
