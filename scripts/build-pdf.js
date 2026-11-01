/* يحوّل التقرير والعرض إلى PDF:  npm run pdf */
const path = require("path");
const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const docs = path.join(__dirname, "..", "docs");

  await page.goto("file://" + path.join(docs, "report.html"), { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({
    path: path.join(docs, "Inayati-Report.pdf"), format: "A4", printBackground: true,
    displayHeaderFooter: true, headerTemplate: "<span></span>",
    footerTemplate: `<div style="width:100%;font-size:9px;color:#888;text-align:center;font-family:sans-serif">Inayati — IT473 · <span class="pageNumber"></span> / <span class="totalPages"></span></div>`,
    margin: { top: "16mm", bottom: "18mm", left: "15mm", right: "15mm" }
  });

  await page.goto("file://" + path.join(docs, "slides.html"), { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({ path: path.join(docs, "Inayati-Presentation.pdf"), width: "1280px", height: "720px", printBackground: true, preferCSSPageSize: true });

  await browser.close();
  console.log("docs/Inayati-Report.pdf و docs/Inayati-Presentation.pdf جاهزة");
})();
