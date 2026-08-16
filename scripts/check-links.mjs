import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const outDir = join(process.cwd(), "out");
const requiredPaths = [
  "index.html",
  "sv/index.html",
  "en/index.html",
  "sv/tjanster/index.html",
  "sv/offentlig-sektor/index.html",
  "sv/leveransformaga/index.html",
  "sv/kvalitet-sakerhet/index.html",
  "sv/for-upphandlande-organisationer/index.html",
  "sv/partnerskap/index.html",
  "sv/om-oss/index.html",
  "sv/insikter/index.html",
  "sv/kontakt/index.html",
  "sv/integritet/index.html",
  "sv/cookies/index.html",
  "en/services/index.html",
  "en/public-sector/index.html",
  "en/delivery-capability/index.html",
  "en/quality-security/index.html",
  "en/for-procuring-organizations/index.html",
  "en/partnership/index.html",
  "en/about/index.html",
  "en/insights/index.html",
  "en/contact/index.html",
  "en/privacy/index.html",
  "en/cookies/index.html",
  "sitemap.xml",
  "robots.txt",
  ".htaccess",
];

function walkHtml(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) walkHtml(full, files);
    else if (extname(full) === ".html") files.push(full);
  }
  return files;
}

let failed = false;

for (const rel of requiredPaths) {
  const full = join(outDir, rel);
  try {
    statSync(full);
    console.log(`ok  ${rel}`);
  } catch {
    console.error(`MISSING ${rel}`);
    failed = true;
  }
}

const htmlFiles = walkHtml(outDir);
const hrefRe = /href="(\/[^"#?][^"]*)"/g;
const seen = new Set();

for (const file of htmlFiles) {
  const html = readFileSync(file, "utf8");
  let match;
  while ((match = hrefRe.exec(html))) {
    const href = match[1];
    if (href.startsWith("/_next")) continue;
    seen.add(href);
  }
}

function resolvePublicPath(href) {
  const clean = href.split("#")[0].split("?")[0];
  if (clean.endsWith("/")) {
    return join(outDir, clean.slice(1), "index.html");
  }
  const asFile = join(outDir, clean.slice(1));
  try {
    if (statSync(asFile).isFile()) return asFile;
  } catch {
    /* try directory index */
  }
  return join(outDir, clean.slice(1), "index.html");
}

for (const href of [...seen].sort()) {
  // External-looking or mailto/tel skipped by regex (starts with /)
  const target = resolvePublicPath(href);
  try {
    statSync(target);
  } catch {
    // Soft-404 and asset paths may be files without index
    const alt = join(outDir, href.replace(/^\//, ""));
    try {
      statSync(alt);
    } catch {
      console.error(`BROKEN LINK ${href}`);
      failed = true;
    }
  }
}

if (failed) {
  console.error("check:links failed");
  process.exit(1);
}

console.log(`check:links passed (${htmlFiles.length} html files, ${seen.size} local hrefs)`);
