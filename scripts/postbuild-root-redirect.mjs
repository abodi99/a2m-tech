import { writeFileSync } from "node:fs";
import { join } from "node:path";

const outDir = join(process.cwd(), "out");
const target = "/sv/";

const html = `<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="utf-8">
  <meta http-equiv="refresh" content="0;url=${target}">
  <link rel="canonical" href="https://a2m-tech.com${target}">
  <title>A2M Tech</title>
  <script>location.replace("${target}");</script>
</head>
<body>
  <p>Redirecting to <a href="${target}">A2M Tech</a>…</p>
</body>
</html>
`;

writeFileSync(join(outDir, "index.html"), html, "utf8");
