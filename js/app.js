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
  const catalog = () => catalogPromise ||= api("/api/catalog").then(c => {
    const pMap = Object.fromEntries(c.products.map(p => [p.id, p]));
    pMapCache = pMap;
    return { ...c, pMap, kMap: Object.fromEntries(c.kits.map(k => [k.id, k])) };
  });
  const me = (refresh) => (refresh || !mePromise) ? (mePromise = api("/api/auth/me").then(r => r.user)) : mePromise;

  /* ---------- السلة (تُحفظ في المتصفح، والسعر النهائي يحسبه الخادم) ---------- */
  const CART_KEY = "inayati_cart_v2";
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

  /* ---------- صور المنتجات والكيتات (packshots.js) ---------- */
  let pMapCache = {};
  const ids2products = ids => ids.map(id => pMapCache[id]).filter(Boolean);
  function kitSVG(kit, ids) {
    if (!Array.isArray(ids)) ids = kit.tiers.full;
    return Packshots.kit(ids2products(ids));
  }
  const productImg = p => Packshots.product(p);
  const tiktokIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.6 2h-3.3v13.2a2.9 2.9 0 1 1-2-2.8V9a6.3 6.3 0 1 0 5.3 6.2V8.6a7.9 7.9 0 0 0 4.4 1.4V6.7a4.5 4.5 0 0 1-4.4-4.7z"/></svg>`;

  function kitCard(kit, cat, tier = "full") {
    const ids = kit.tiers[tier];
    const price = Engine.kitPrice(ids, cat.pMap);
    const orig = Engine.sumProducts(ids, cat.pMap);
    return `<a class="card kit-card" href="kit.html?id=${kit.id}">
      <div class="kit-visual" style="background:${kit.color}">${kitSVG(kit, ids)}<span class="tag">${kit.cat === "hair" ? "شعر" : "بشرة"}</span></div>
      <div class="kit-body"><h3>${esc(kit.name)}</h3><span class="muted small">${esc(kit.for)} · ${ids.length} منتجات</span>
      <p class="small" style="margin:0">${esc(kit.tagline)}</p>
      <span class="brands-line">${[...new Set(ids.map(id => cat.pMap[id] && cat.pMap[id].brand))].filter(Boolean).join(" · ")}</span><div class="spacer"></div>
      <div class="price">يبدأ من ${fmt(Engine.kitPrice(kit.tiers.basic, cat.pMap))}</div>
      <span class="small muted">المتكامل ${fmt(price)} <s>${fmt(orig)}</s></span></div></a>`;
  }

  /* ---------- الهيدر والفوتر ---------- */
  const ICONS = {
    cart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 7h12l-1 13H7z"/><path d="M9 7a3 3 0 0 1 6 0"/></svg>`,
    user: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>`,
    menu: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 7h16M4 12h16M4 17h16"/></svg>`
  };
  /* أي خطأ غير متوقع يظهر كرسالة واضحة بدل صفحة فاضية */
  function showFatal(msg) {
    if (document.getElementById("fatalBox")) return;
    const box = document.createElement("div");
    box.id = "fatalBox"; box.className = "container";
    box.innerHTML = `<div class="alert error" style="margin:16px auto">صار خطأ في عرض الصفحة. <button class="link-btn" id="fatalReset">اضغطي هنا لتنظيف بيانات الموقع وإعادة المحاولة</button><div class="small" style="direction:ltr;text-align:left;opacity:.7;margin-top:6px">${esc(msg).slice(0, 200)}</div></div>`;
    (document.querySelector("main") || document.body).prepend(box);
    document.getElementById("fatalReset").onclick = () => {
      try { sessionStorage.clear(); ["inayati_cart_v1", "inayati_cart_v2"].forEach(k => localStorage.removeItem(k)); } catch {}
      location.reload();
    };
  }
  window.addEventListener("error", e => showFatal(e.message || "error"));
  window.addEventListener("unhandledrejection", e => { const m = e.reason && (e.reason.message || String(e.reason)); if (!(e.reason && e.reason.status)) showFatal(m || "error"); });

  function layout(active) {
    const links = [["home.html", "الرئيسية", "home"], ["shop.html", "المتجر", "shop"], ["quiz.html", "حددي روتينك", "quiz"], ["kits.html", "الكيتات", "kits"], ["analysis.html", "تحليل البشرة", "analysis"], ["consult.html", "استشارة طبيبة", "consult"], ["account.html", "حسابي", "account"]];
    const header = document.createElement("header");
    header.className = "site-header";
    header.innerHTML = `<div class="container bar">
      <a class="brand" href="home.html"><img src="assets/logo.svg" alt="عنايتي"></a>
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
      <div><h4>تسوقي</h4><a href="shop.html">المتجر: حلول لكل مشكلة</a><a href="quiz.html">حددي روتينك</a><a href="analysis.html">تحليل البشرة بالذكاء الاصطناعي</a><a href="consult.html">استشارة طبيبة جلدية</a><a href="kits.html?cat=skin">كيتات البشرة</a><a href="kits.html?cat=hair">كيتات الشعر</a></div>
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
  const TIER_AR = { basic: "أساسي", full: "متكامل", plus: "فاخر", single: "منتج منفرد" };
  const STEP_AR = { cleanser: "غسول", toner: "تونر", serum: "سيروم", moisturizer: "مرطب", spf: "واقي شمس", treatment: "علاج موضعي", exfoliant: "مقشر", shampoo: "شامبو", conditioner: "بلسم", mask: "ماسك", oil: "زيت/سيروم أطراف", styler: "تصفيف", scalp: "فروة الرأس", protect: "حماية حرارية" };
  const ALLERGEN_AR = { fragrance: "عطور", alcohol: "كحول", nuts: "زيوت مكسرات" };
  const dateAr = d => new Date(d.replace(" ", "T") + (d.length > 10 ? "Z" : "")).toLocaleDateString("ar-SA-u-nu-latn-ca-gregory", { year: "numeric", month: "long", day: "numeric" });

  /* "مناسب لـ" لكل منتج */
  function suitabilityHTML(p) {
    const tags = (typeof CONCERN_TAGS !== "undefined" ? CONCERN_TAGS : {});
    const chips = (p.goodFor || []).map(k => tags[k] ? `<span class="tag ${k === "hormonal" || k === "fungal" ? "blush" : "sage"}">${esc(tags[k])}</span>` : "").join(" ");
    let fungal = "";
    if (p.cat === "skin") fungal = p.fungal === true ? `<div class="fungal ok">✓ مناسب للحبوب الفطرية غالباً (بدون زيوت واسترات تغذي الفطريات)</div>`
      : p.fungal === false ? `<div class="fungal no">✗ غير مناسب للحبوب الفطرية: فيه مكونات ممكن تغذي الفطريات</div>`
      : `<div class="fungal unk">؟ الحبوب الفطرية: غير مؤكد، اسألي الطبيبة قبل الاستخدام</div>`;
    return (chips ? `<div class="suit"><span class="small muted">مناسب لـ:</span> ${chips}</div>` : "") + fungal;
  }
  /* تصغير الصورة في المتصفح قبل إرسالها (أسرع وأخف وما نرسل الصورة الأصلية) */
  function downscaleImage(file, max = 1024) {
    return new Promise((resolve, reject) => {
      const img = new Image(), url = URL.createObjectURL(file);
      img.onload = () => {
        const k = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement("canvas"); c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height); URL.revokeObjectURL(url);
        const dataUrl = c.toDataURL("image/jpeg", 0.85);
        resolve({ dataUrl, base64: dataUrl.split(",")[1], mediaType: "image/jpeg" });
      };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("ما قدرنا نقرأ الصورة، جربي صورة JPG أو PNG")); };
      img.src = url;
    });
  }
  const cardFieldsHTML = (prefix = "c") => `
    <div class="test-cards">🔒 <b>دفع تجريبي</b> — لا يتم خصم أي مبلغ. بطاقة ناجحة: <code>4242 4242 4242 4242</code> · مرفوضة: <code>4000 0000 0000 0002</code></div>
    <div class="field"><label for="${prefix}Num">رقم البطاقة</label><input id="${prefix}Num" class="ltr" inputmode="numeric" autocomplete="cc-number" placeholder="0000 0000 0000 0000"></div>
    <div class="grid-2"><div class="field"><label for="${prefix}Exp">تاريخ الانتهاء</label><input id="${prefix}Exp" class="ltr" placeholder="MM/YY" autocomplete="cc-exp"></div>
    <div class="field"><label for="${prefix}Cvv">CVV</label><input id="${prefix}Cvv" class="ltr" inputmode="numeric" maxlength="4" autocomplete="cc-csc"></div></div>`;
  function wireCardFields(prefix = "c") {
    qs(`#${prefix}Num`).oninput = e => { e.target.value = e.target.value.replace(/\D/g, "").slice(0, 19).replace(/(.{4})/g, "$1 ").trim(); };
    qs(`#${prefix}Exp`).oninput = e => { let v = e.target.value.replace(/\D/g, "").slice(0, 4); if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2); e.target.value = v; };
    return () => ({ method: "card", cardNumber: qs(`#${prefix}Num`).value, expiry: qs(`#${prefix}Exp`).value, cvv: qs(`#${prefix}Cvv`).value });
  }

  /* روابط ريفيوهات تيك توك: تطبيق تيك توك في الجوال ما يفتح روابط البحث (يروح للصفحة الرئيسية)،
     فنفتح في الجوال بحث Google عن فيديوهات تيك توك لنفس المنتج، وكل فيديو ينفتح في التطبيق مباشرة.
     في الكمبيوتر يبقى بحث تيك توك نفسه. روابط الفيديو المحددة من لوحة الإدارة ما تتغير. */
  const isMobile = () => /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) || (window.matchMedia && matchMedia("(pointer: coarse)").matches && innerWidth < 900);
  function ttHref(url) {
    try {
      const u = new URL(url);
      if (!isMobile() || !/tiktok\.com$/.test(u.hostname) || !u.pathname.startsWith("/search")) return url;
      const q = u.searchParams.get("q") || "";
      return "https://www.google.com/search?q=" + encodeURIComponent(q + " site:tiktok.com") + "&tbm=vid";
    } catch { return url; }
  }

  /* بطاقة الاستشارة: متاحة لكل مشكلة. strong = حالات تحتاج طبيبة أكثر */
  function consultCTA(strong, why, problemName) {
    const title = strong ? "ننصحك باستشارة طبيبة جلدية" : "تبين رأي طبيبة؟";
    const text = why || (problemName
      ? `إذا ${problemName} مستمر أو زاد رغم الروتين، أو صار تقشير أو احمرار أو حكة، الطبيبة تعرف السبب وتختار لك العلاج المناسب.`
      : "إذا المشكلة مستمرة أو زادت، أو صار تقشير أو احمرار أو حكة من أي منتج، الطبيبة تعرف السبب وتختار لك العلاج المناسب.");
    return `<div class="consult-cta ${strong ? "" : "soft"}"><div><b>${title}</b><div class="small">${esc(text)}</div></div><a class="btn ${strong ? "dark" : "outline"}" href="consult.html">احجزي استشارة</a></div>`;
  }

  return { api, catalog, ttHref, consultCTA, suitabilityHTML, downscaleImage, cardFieldsHTML, wireCardFields, me, cart, layout, toast, fmt, esc, qs, qsa, params, kitSVG, kitCard, productImg, tiktokIcon, TIER_AR, STEP_AR, ALLERGEN_AR, dateAr };
})();
