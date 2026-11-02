/* يحوّل ملفات الشعار SVG إلى PNG بخلفية شفافة (ضعف الحجم) + أيقونات المتصفح.
   التشغيل من مجلد المشروع:  node brand/scripts/export_png.js   (يحتاج playwright) */
const { chromium } = require("playwright");
const fs = require("fs"), path = require("path");
(async () => {
  const d = path.join(__dirname, "..", "logo") + path.sep;
  const b = await chromium.launch();
  for (const f of fs.readdirSync(d).filter(x => x.endsWith(".svg"))) {
    const svg = fs.readFileSync(d + f, "utf8"); const m = svg.match(/width="(\d+)" height="(\d+)"/);
    const p = await b.newPage({ viewport: { width: +m[1], height: +m[2] } });
    await p.setContent(`<html><body style="margin:0;background:transparent">${svg}</body></html>`);
    await p.screenshot({ path: d + f.replace(".svg", ".png"), omitBackground: true }); await p.close();
  }
  const ic = fs.readFileSync(d + "renaura-icon.svg", "utf8");
  for (const s of [32, 180, 512]) {
    const q = await b.newPage({ viewport: { width: s, height: s } });
    await q.setContent(`<html><body style="margin:0">${ic.replace(/width="512" height="512"/, `width="${s}" height="${s}"`)}</body></html>`);
    await q.screenshot({ path: d + `favicon-${s}.png`, omitBackground: true }); await q.close();
  }
  await b.close(); console.log("PNG جاهزة في brand/logo");
})();
