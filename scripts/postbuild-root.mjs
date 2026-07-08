import { copyFileSync } from "node:fs";
import { join } from "node:path";

const outDir = join(process.cwd(), "out");
const svIndex = join(outDir, "sv", "index.html");
const rootIndex = join(outDir, "index.html");

copyFileSync(svIndex, rootIndex);
