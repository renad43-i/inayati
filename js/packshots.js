/* =========================================================
   عنايتي — رسم صور المنتجات (Packshots)
   يرسم كل منتج بشكل عبوته الحقيقية وألوانها واسم البراند، بإضاءة وظل
   عشان يبان مثل صور المتاجر. لا يحتاج أي صور خارجية.
   عند الإطلاق الفعلي تُستبدل بصور المورد الرسمية (حقل image في المنتج).
   ========================================================= */
(function (root, factory) {
  if (typeof module !== "undefined" && module.exports) module.exports = factory();
  else root.Packshots = factory();
})(typeof self !== "undefined" ? self : this, function () {
  let uidSeq = 0;
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

  function mix(hex, target, amt) {
    const n = parseInt(hex.replace("#", ""), 16), t = parseInt(target.replace("#", ""), 16);
    const c = (a, b) => Math.round(a + (b - a) * amt);
    const r = c(n >> 16, t >> 16), g = c((n >> 8) & 255, (t >> 8) & 255), b = c(n & 255, t & 255);
    return "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
  }
  const dark = (h, a) => mix(h, "#000000", a), light = (h, a) => mix(h, "#FFFFFF", a);
  const lum = h => { const n = parseInt(h.replace("#", ""), 16); return (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255; };

  function wrap(text, max) {
    const words = String(text).split(" "), lines = [];
    let cur = "";
    for (const w of words) { if ((cur + " " + w).trim().length > max && cur) { lines.push(cur); cur = w; } else cur = (cur + " " + w).trim(); }
    if (cur) lines.push(cur);
    return lines.slice(0, 3);
  }

  /* أبعاد كل شكل داخل مربع 100×160 (القاعدة عند y=150) */
  const SHAPES = {
    pump:    { body: [27, 52, 46, 98, 9],  neck: [42, 42, 16, 11], top: "pump",    label: [31, 78, 38, 50] },
    bottle:  { body: [25, 56, 50, 94, 11], neck: [39, 46, 22, 11], top: "cap",     cap: [36, 24, 28, 23], label: [29, 82, 42, 46] },
    slim:    { body: [35, 44, 30, 106, 7], neck: [43, 38, 14, 7],  top: "cap",     cap: [37, 16, 26, 23], label: [37, 74, 26, 50] },
    dropper: { body: [31, 84, 38, 66, 7],  neck: [43, 78, 14, 7],  top: "dropper", cap: [37, 60, 26, 20], label: [34, 100, 32, 34] },
    tube:    { top: "tube",                label: [31, 48, 38, 56] },
    tub:     { body: [13, 100, 74, 50, 7], top: "lid", cap: [11, 84, 78, 20], label: [17, 108, 66, 36] },
    jar:     { body: [23, 104, 54, 46, 9], top: "lid", cap: [21, 88, 58, 19], label: [27, 110, 46, 34] },
    box:     { body: [21, 66, 58, 84, 3],  top: "box",                         label: [25, 84, 50, 52] },
    spray:   { body: [32, 58, 36, 92, 10], neck: [40, 48, 20, 11], top: "spray",   label: [35, 82, 30, 50] }
  };

  /* يرجع { defs, g } لرسم منتج في مربع 100×160 */
  function draw(p) {
    const k = p.pack || { shape: "bottle", body: "#FFFFFF", cap: "#DDDDDD", accent: "#333333" };
    const S = SHAPES[k.shape] || SHAPES.bottle, id = "ps" + (++uidSeq);
    const body = k.body, cap = k.cap || body, accent = k.accent || "#333333";
    const clear = !!k.clear, frosted = !!k.frosted;
    const defs = `
      <linearGradient id="${id}b" x1="0" x2="1">
        <stop offset="0" stop-color="${dark(body, .16)}"/><stop offset=".16" stop-color="${body}"/>
        <stop offset=".38" stop-color="${light(body, .35)}"/><stop offset=".62" stop-color="${body}"/>
        <stop offset="1" stop-color="${dark(body, .22)}"/></linearGradient>
      <linearGradient id="${id}c" x1="0" x2="1">
        <stop offset="0" stop-color="${dark(cap, .25)}"/><stop offset=".35" stop-color="${light(cap, .3)}"/>
        <stop offset=".7" stop-color="${cap}"/><stop offset="1" stop-color="${dark(cap, .3)}"/></linearGradient>
      <radialGradient id="${id}s" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#000" stop-opacity=".22"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>`;
    let g = `<ellipse cx="50" cy="151" rx="${k.shape === "tub" ? 44 : 30}" ry="5" fill="url(#${id}s)"/>`;
    const bodyFill = clear ? light(body, .25) : `url(#${id}b)`;
    const bodyOpacity = clear ? .55 : frosted ? .92 : 1;
    const rect = (x, y, w, h, r, fill, extra = "") => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" ${extra}/>`;

    if (k.shape === "tube") {
      // أنبوب واقف على غطائه
      g += `<path d="M22 16 H78 L77 26 C76 60 72 100 70 128 H30 C28 100 24 60 23 26 Z" fill="url(#${id}b)"/>`;
      g += `<path d="M22 16 H78 V22 H22 Z" fill="${dark(body, .12)}"/>`;
      for (let x = 25; x < 76; x += 4) g += `<line x1="${x}" y1="17" x2="${x}" y2="21" stroke="${dark(body, .25)}" stroke-width=".6"/>`;
      g += rect(30, 126, 40, 25, 5, `url(#${id}c)`);
      g += `<path d="M30 28 C31 60 34 100 35 124" stroke="#fff" stroke-opacity=".45" stroke-width="3" fill="none"/>`;
    } else {
      const [bx, by, bw, bh, br] = S.body;
      if (S.neck) g += rect(S.neck[0], S.neck[1], S.neck[2], S.neck[3] + 3, 2, clear ? light(body, .1) : `url(#${id}b)`, `opacity="${bodyOpacity}"`);
      g += rect(bx, by, bw, bh, br, bodyFill, `opacity="${bodyOpacity}"`);
      if (clear) {
        const lt = by + bh * .14;
        g += rect(bx + 2, lt, bw - 4, by + bh - lt - 2, Math.max(2, br - 2), body, `opacity=".9"`);
        g += rect(bx + 2, lt, bw - 4, 3, 1.5, light(body, .4), `opacity=".8"`);
        if (k.sediment) g += rect(bx + 2, by + bh - 20, bw - 4, 18, Math.max(2, br - 2), k.sediment);
        g += rect(bx, by, bw, bh, br, "none", `stroke="${dark(body, .25)}" stroke-opacity=".35" stroke-width="1"`);
      }
      if (frosted) g += rect(bx, by, bw, bh, br, "#fff", `opacity=".18"`);
      g += rect(bx + bw * .12, by + 6, 3.5, bh - 14, 1.75, "#fff", `opacity="${clear ? .55 : .4}"`);

      if (S.top === "pump") {
        g += rect(41, 34, 18, 12, 2, `url(#${id}c)`);
        g += rect(47, 22, 6, 13, 1, `url(#${id}c)`);
        g += `<path d="M44 16 H62 a3 3 0 0 1 3 3 v3 H44 Z" fill="url(#${id}c)"/>` + rect(63, 18, 14, 3.5, 1.5, `url(#${id}c)`);
      } else if (S.top === "cap") {
        const [cx, cy, cw, ch] = S.cap; g += rect(cx, cy, cw, ch, 3, `url(#${id}c)`);
        g += rect(cx + 3, cy + 2, 2.5, ch - 4, 1.2, "#fff", `opacity=".35"`);
      } else if (S.top === "dropper") {
        const [cx, cy, cw, ch] = S.cap; g += rect(cx, cy, cw, ch, 3, `url(#${id}c)`);
        g += `<path d="M42 61 C40 44 41 34 50 32 C59 34 60 44 58 61 Z" fill="${dark(cap === "#FFFFFF" ? "#EDEDED" : cap, .05)}"/>`;
        g += `<path d="M45 58 C44 46 45 38 49 36" stroke="#fff" stroke-opacity=".5" stroke-width="2" fill="none"/>`;
      } else if (S.top === "lid") {
        const [cx, cy, cw, ch] = S.cap; g += rect(cx, cy, cw, ch, 5, `url(#${id}c)`);
        for (let x = cx + 4; x < cx + cw - 2; x += 3) g += `<line x1="${x}" y1="${cy + 3}" x2="${x}" y2="${cy + ch - 3}" stroke="${dark(cap, .2)}" stroke-opacity=".35" stroke-width=".6"/>`;
      } else if (S.top === "box") {
        g += `<path d="M21 66 L29 58 H71 L79 66 Z" fill="${dark(body, .08)}"/>`;
        g += rect(25, 128, 50, 14, 2, accent, `opacity=".9"`);
      } else if (S.top === "spray") {
        g += rect(38, 34, 24, 15, 3, `url(#${id}c)`);
        g += `<path d="M40 34 V24 a4 4 0 0 1 4 -4 H66 v8 H56 v6 Z" fill="url(#${id}c)"/>`;
        g += `<path d="M58 32 C64 40 66 50 63 58" stroke="${dark(cap, .3)}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
      }
    }

    // الملصق: اسم البراند + اسم المنتج
    const [lx, ly, lw, lh] = S.label;
    const darkBody = !clear && lum(body) < .45;
    const panel = clear || frosted;
    if (panel) g += rect(lx, ly, lw, lh, 2, "#fff", `opacity="${frosted ? .9 : .72}"`);
    const ink = panel ? (lum(accent) > .7 ? "#222" : accent) : (darkBody ? accent : accent);
    const brandSize = Math.min(7.2, (lw - 4) / Math.max(4, p.brand.length * .62));
    const lines = wrap(p.nameEn || p.name, Math.max(9, Math.round(lw / 3.1)));
    const cx = lx + lw / 2;
    let y = ly + Math.max(10, lh * .26);
    g += `<text x="${cx}" y="${y}" text-anchor="middle" font-family="'Helvetica Neue',Arial,sans-serif" font-weight="700" font-size="${brandSize.toFixed(2)}" letter-spacing=".3" fill="${ink}" direction="ltr">${esc(p.brand)}</text>`;
    g += `<line x1="${cx - lw * .22}" x2="${cx + lw * .22}" y1="${y + 3}" y2="${y + 3}" stroke="${ink}" stroke-opacity=".35" stroke-width=".5"/>`;
    y += 8.5;
    for (const ln of lines) { g += `<text x="${cx}" y="${y}" text-anchor="middle" font-family="'Helvetica Neue',Arial,sans-serif" font-size="3.9" fill="${ink}" fill-opacity=".85" direction="ltr">${esc(ln)}</text>`; y += 5; }
    if (p.size && lh > 40) g += `<text x="${cx}" y="${ly + lh - 3}" text-anchor="middle" font-family="Arial,sans-serif" font-size="3.2" fill="${ink}" fill-opacity=".6" direction="ltr">${esc(p.size.replace("مل", "ml").replace("غ", "g").replace("لصقة", "patches"))}</text>`;
    return { defs, g };
  }

  /* صورة منتج واحد */
  function product(p, opts = {}) {
    const { defs, g } = draw(p);
    return `<svg viewBox="0 0 100 160" role="img" aria-label="${esc(p.brand + " " + (p.nameEn || p.name))}" ${opts.cls ? `class="${opts.cls}"` : ""}><defs>${defs}</defs>${g}</svg>`;
  }

  /* صورة كيت: المنتجات مصفوفة جنب بعض مثل صور المتاجر */
  function kit(products, opts = {}) {
    const list = products.slice(0, opts.max || 6), n = list.length || 1;
    const scale = 1;
    const step = 100 * (n <= 2 ? .95 : n === 3 ? .8 : n === 4 ? .66 : .56), W = step * (n - 1) + 100 * scale, H = 160 * scale;
    let defs = "", g = "";
    // الأطول في الخلف، والترتيب من الوسط
    list.forEach((p, i) => {
      const d = draw(p); defs += d.defs;
      const x = i * step, y = (i % 2 ? 6 : 0) * scale;
      g += `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${scale})">${d.g}</g>`;
    });
    return `<svg viewBox="0 8 ${W.toFixed(1)} ${(H - 2).toFixed(1)}" preserveAspectRatio="xMidYMax meet" role="img" aria-label="${esc(list.map(p => p.brand).join("، "))}"><defs>${defs}</defs>${g}</svg>`;
  }

  return { product, kit };
});
