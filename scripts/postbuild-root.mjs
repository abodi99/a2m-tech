import {
  cpSync,
  existsSync,
  mkdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";

const outDir = join(process.cwd(), "out");
const svIndex = join(outDir, "sv", "index.html");

/** Internal filesystem path → localized public path (Swedish). */
const svLocalizedCopies = [
  ["services", "tjanster"],
  ["public-sector", "offentlig-sektor"],
  ["delivery-capability", "leveransformaga"],
  ["quality-security", "kvalitet-sakerhet"],
  ["for-procuring-organizations", "for-upphandlande-organisationer"],
  ["partnership", "partnerskap"],
  ["about", "om-oss"],
  ["insights", "insikter"],
  ["contact", "kontakt"],
  ["privacy", "integritet"],
];

if (!existsSync(svIndex)) {
  console.error("postbuild-root: missing out/sv/index.html");
  process.exit(1);
}

function copyDir(from, to) {
  if (!existsSync(from)) {
    console.warn(`postbuild-root: skip missing ${from}`);
    return;
  }
  rmSync(to, { recursive: true, force: true });
  mkdirSync(to, { recursive: true });
  cpSync(from, to, { recursive: true });
}

for (const [internal, localized] of svLocalizedCopies) {
  copyDir(join(outDir, "sv", internal), join(outDir, "sv", localized));
}

const redirectHtml = `<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="utf-8" />
  <title>A2M Tech</title>
  <meta http-equiv="refresh" content="0;url=/sv/" />
  <link rel="canonical" href="https://a2m-tech.com/sv/" />
  <script>location.replace("/sv/");</script>
</head>
<body>
  <p><a href="/sv/">A2M Tech – fortsätt till startsidan</a></p>
</body>
</html>
`;

writeFileSync(join(outDir, "index.html"), redirectHtml, "utf8");

console.log(
  "postbuild-root: root → /sv/ redirect; Swedish localized path copies written"
);
