/* =========================================================
   عنايتي — منطق مشترك لكل الصفحات
   (الهيدر، الفوتر، الاتصال بالخادم، السلة، رسومات الكيت)
   ========================================================= */
const App = (() => {
  const CUR = "ر.س";
  const fmt = n => `${Number(n).toLocaleString("ar-SA-u-nu-latn")} ${CUR}`;
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const qs = (s, el = document) => el.querySelector(s);
  const qsa = (s, el = document) => [...el.querySelectorAll(s)];
  const params = new URLSearchParams(location.search);

  /* ---------- الاتصال بالخادم ---------- */
  async function api(path, opts = {}) {
    const res = await fetch(path, {
      method: opts.method || (opts.body ? "POST" : "GET"),
      headers: opts.body ? { "Content-Type": "application/json" } : {},
      body: opts.body ? JSON.stringify(opts.body) : undefined,
      credentials: "same-origin"
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw Object.assign(new Error(data.error || "حدث خطأ"), { status: res.status });
    return data;
  }
  let catalogPromise, mePromise;
  const catalog = () => catalogPromise ||= api("/api/catalog").then(c => ({
    ...c, pMap: Object.fromEntries(c.products.map(p => [p.id, p])), kMap: Object.fromEntries(c.kits.map(k => [k.id, k]))
  }));
  const me = (refresh) => (refresh || !mePromise) ? (mePromise = api("/api/auth/me").then(r => r.user)) : mePromise;

  /* ---------- السلة (تُحفظ في المتصفح، والسعر النهائي يحسبه الخادم) ---------- */
  const CART_KEY = "inayati_cart_v1";
  const cart = {
    get() { try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch { return []; } },
    save(items) { try { localStorage.setItem(CART_KEY, JSON.stringify(items)); } catch {} updateBadge(); },
    add(item) {
      const items = cart.get();
      const key = i => [i.kitId, i.tier, i.purchaseType, (i.productIds || []).join(",")].join("|");
      const found = items.find(i => key(i) === key(item));
      if (found) found.qty = Math.min(10, found.qty + (item.qty || 1)); else items.push({ ...item, qty: item.qty || 1 });
      cart.save(items);
    },
    count() { return cart.get().reduce((s, i) => s + i.qty, 0); },
    clear() { cart.save([]); }
  };
  function updateBadge() { const b = qs("#cartBadge"); if (b) { const n = cart.count(); b.textContent = n; b.classList.toggle("hidden", !n); } }

  /* ---------- رسم الكيت (بديل الصور في الـ MVP) ---------- */
  function kitSVG(kit, n = 4) {
    const c = kit.color || "#EEE";
    const isHair = kit.cat === "hair";
    const shapes = [
      `<rect x="30" y="58" width="34" height="82" rx="10" fill="#fff"/><rect x="38" y="44" width="18" height="16" rx="4" fill="${shade(c)}"/>`,
      `<rect x="74" y="40" width="40" height="100" rx="12" fill="#fff"/><rect x="84" y="24" width="20" height="18" rx="5" fill="${shade(c)}"/><rect x="80" y="76" width="28" height="24" rx="4" fill="${c}"/>`,
      `<rect x="124" y="70" width="30" height="70" rx="8" fill="#fff"/><circle cx="139" cy="62" r="9" fill="${shade(c)}"/>`,
      `<rect x="160" y="96" width="44" height="44" rx="12" fill="#fff"/><rect x="160" y="88" width="44" height="12" rx="6" fill="${shade(c)}"/>`
    ].slice(0, Math.max(2, Math.min(4, n)));
    return `<svg viewBox="0 0 230 160" aria-hidden="true"><ellipse cx="115" cy="142" rx="100" ry="8" fill="rgba(0,0,0,.06)"/>${shapes.join("")}
      <text x="96" y="94" font-size="9" text-anchor="middle" fill="${shade(c, .45)}" font-family="El Messiri">${isHair ? "شعر" : "بشرة"}</text></svg>`;
  }
  function shade(hex, amt = .25) {
    const n = parseInt(hex.slice(1), 16); let r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    r = Math.round(r * (1 - amt)); g = Math.round(g * (1 - amt)); b = Math.round(b * (1 - amt));
    return `rgb(${r},${g},${b})`;
  }
  const productIcon = cat => cat === "hair"
    ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M9 3h6v3H9zM8 6h8l1 15H7z"/></svg>`
    : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M10 2h4v4h-4zM8 6h8v15a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1z"/><path d="M8 12h8"/></svg>`;

  function kitCard(kit, cat, tier = "full") {
    const ids = kit.tiers[tier];
    const price = Engine.kitPrice(ids, cat.pMap);
    const orig = Engine.sumProducts(ids, cat.pMap);
    return `<a class="card kit-card" href="kit.html?id=${kit.id}">
      <div class="kit-visual" style="background:${kit.color}">${kitSVG(kit, ids.length)}<span class="tag">${kit.cat === "hair" ? "شعر" : "بشرة"}</span></div>
      <div class="kit-body"><h3>${esc(kit.name)}</h3><span class="muted small">${esc(kit.for)} · ${ids.length} منتجات</span>
      <p class="small" style="margin:0">${esc(kit.tagline)}</p><div class="spacer"></div>
      <div class="price">يبدأ من ${fmt(Engine.kitPrice(kit.tiers.basic, cat.pMap))}</div>
      <span class="small muted">المتكامل ${fmt(price)} <s>${fmt(orig)}</s></span></div></a>`;
  }

  /* ---------- الهيدر والفوتر ---------- */
  const ICONS = {
    cart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 7h12l-1 13H7z"/><path d="M9 7a3 3 0 0 1 6 0"/></svg>`,
    user: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>`,
    menu: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 7h16M4 12h16M4 17h16"/></svg>`
  };
  function layout(active) {
    const links = [["index.html", "الرئيسية", "home"], ["quiz.html", "حددي روتينك", "quiz"], ["kits.html", "الكيتات", "kits"], ["account.html", "حسابي", "account"]];
    const header = document.createElement("header");
    header.className = "site-header";
    header.innerHTML = `<div class="container bar">
      <a class="brand" href="index.html"><img src="assets/logo.svg" alt="عنايتي"></a>
      <nav class="nav" id="nav">${links.map(([h, t, k]) => `<a href="${h}" class="${k === active ? "active" : ""}">${t}</a>`).join("")}<a href="admin.html" id="adminLink" class="hidden ${active === "admin" ? "active" : ""}">لوحة الإدارة</a></nav>
      <div class="spacer"></div>
      <a class="icon-btn" href="account.html" aria-label="حسابي">${ICONS.user}</a>
      <a class="icon-btn" href="cart.html" aria-label="السلة">${ICONS.cart}<span class="badge hidden" id="cartBadge">0</span></a>
      <button class="icon-btn menu-toggle" aria-label="القائمة" id="menuBtn">${ICONS.menu}</button></div>`;
    document.body.prepend(header);
    qs("#menuBtn").onclick = () => qs("#nav").classList.toggle("open");

    const footer = document.createElement("footer");
    footer.className = "site-footer";
    footer.innerHTML = `<div class="container"><div class="cols">
      <div><img src="assets/logo.svg" alt="عنايتي" style="height:44px"><p class="muted small" style="margin-top:10px">كيتات عناية شخصية جاهزة، مبنية على احتياجك ويتجدد روتينك كل شهر.</p></div>
      <div><h4>تسوقي</h4><a href="quiz.html">حددي روتينك</a><a href="kits.html?cat=skin">كيتات البشرة</a><a href="kits.html?cat=hair">كيتات الشعر</a></div>
      <div><h4>حسابي</h4><a href="account.html">طلباتي</a><a href="account.html#subs">اشتراكي</a><a href="cart.html">السلة</a></div>
      <div><h4>تابعينا</h4><a href="https://www.tiktok.com/@inayati.sa" target="_blank" rel="noopener">تيك توك</a><a href="#">انستقرام</a><a href="mailto:hello@inayati.sa">hello@inayati.sa</a></div>
      </div><p class="small muted center" style="margin-top:26px">© ${new Date().getFullYear()} عنايتي — مشروع IT473 أنظمة التجارة الإلكترونية · الدفع في هذا الموقع تجريبي</p></div>`;
    document.body.append(footer);
    updateBadge();
    me().then(u => { if (u && u.role === "admin") qs("#adminLink").classList.remove("hidden"); }).catch(() => {});
  }

  function toast(msg) {
    let t = qs(".toast"); if (!t) { t = document.createElement("div"); t.className = "toast"; document.body.append(t); }
    t.textContent = msg; t.classList.add("show"); clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove("show"), 2600);
  }
  const TIER_AR = { basic: "أساسي", full: "متكامل", plus: "فاخر" };
  const STEP_AR = { cleanser: "غسول", toner: "تونر", serum: "سيروم", moisturizer: "مرطب", spf: "واقي شمس", treatment: "علاج موضعي", exfoliant: "مقشر", shampoo: "شامبو", conditioner: "بلسم", mask: "ماسك", oil: "زيت/سيروم أطراف", styler: "تصفيف", scalp: "فروة الرأس", protect: "حماية حرارية" };
  const ALLERGEN_AR = { fragrance: "عطور", alcohol: "كحول", nuts: "زيوت مكسرات" };
  const dateAr = d => new Date(d.replace(" ", "T") + (d.length > 10 ? "Z" : "")).toLocaleDateString("ar-SA-u-nu-latn-ca-gregory", { year: "numeric", month: "long", day: "numeric" });

  return { api, catalog, me, cart, layout, toast, fmt, esc, qs, qsa, params, kitSVG, kitCard, productIcon, TIER_AR, STEP_AR, ALLERGEN_AR, dateAr };
})();
