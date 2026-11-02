/* يبني نسخة من الموقع تعمل بدون خادم (للنشر كرابط):  npm run static
   الناتج في مجلد static/ — كل طلبات /api تُنفّذ داخل المتصفح عبر js/mock-api.js */
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
const src = path.join(root, "public"), out = path.join(root, "static");

fs.rmSync(out, { recursive: true, force: true });
fs.cpSync(src, out, { recursive: true });

for (const f of fs.readdirSync(out).filter(f => f.endsWith(".html"))) {
  const p = path.join(out, f);
  let html = fs.readFileSync(p, "utf8");
  html = html.replace('<script src="js/engine.js"></script>', '<script src="js/engine.js"></script><script src="js/mock-api.js"></script>');
  html = html.replace("<body>", '<body>\n<div style="background:#2F3B30;color:#FBF7F1;text-align:center;font-size:13px;padding:6px 16px">نسخة عرض تعمل داخل المتصفح · البيانات تنحفظ على جهازك فقط · الدفع تجريبي</div>');
  fs.writeFileSync(p, html);
}

// في الرابط المنشور index.html محجوزة للصفحة الرئيسية للرابط، فنسمي الرئيسية home.html
fs.renameSync(path.join(out, "index.html"), path.join(out, "home.html"));
for (const f of fs.readdirSync(out).filter(f => f.endsWith(".html")).map(f => path.join(out, f)).concat([path.join(out, "js", "app.js")])) {
  fs.writeFileSync(f, fs.readFileSync(f, "utf8").replace(/(["'(=/])index\.html/g, "$1home.html"));
}

// صفحة الدخول للرابط المنشور: تنقل مباشرة للرئيسية
fs.writeFileSync(path.join(out, "launch.html"), `<title>رينورا</title>
<meta name="claude:viewport-fit-sides" content="cover">
<style>
  :root { --bg: #FBF7F1; --fg: #2F3B30; --accent: #6F9277 }
  @media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { --bg: #1E2620; --fg: #EDE6DA; --accent: #8FB397; color-scheme: dark } }
  :root[data-theme="dark"] { --bg: #1E2620; --fg: #EDE6DA; --accent: #8FB397; color-scheme: dark }
  body { background: var(--bg); color: var(--fg); font-family: Tajawal, system-ui, sans-serif; display: grid; place-items: center; min-height: 80vh; padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px)) }
  a { color: var(--accent); font-weight: 700; font-size: 18px }
</style>
<div dir="rtl" style="text-align:center"><p>جاري فتح موقع رينورا…</p><a href="home.html">افتحي الموقع</a></div>
<script>location.replace("home.html");</script>
`);
// لنشر GitHub Pages: صفحة البداية index.html تنقل للرئيسية، و.nojekyll لنشر الملفات كما هي
fs.writeFileSync(path.join(out, "index.html"), `<!doctype html>
<html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>رينورا</title><meta http-equiv="refresh" content="0; url=home.html"><link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
<style>body{background:#FBF7F1;color:#2F3B30;font-family:Tajawal,system-ui,sans-serif;display:grid;place-items:center;min-height:90vh;margin:0}a{color:#6F9277;font-weight:700}</style>
</head><body><p>جاري فتح رينورا… <a href="home.html">اضغطي هنا</a></p><script>location.replace("home.html")</script></body></html>
`);
fs.writeFileSync(path.join(out, ".nojekyll"), "");
console.log("static/ جاهزة (رابط Claude: launch.html — GitHub Pages: index.html)");
