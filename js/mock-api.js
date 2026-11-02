/* =========================================================
   رينورا — نسخة العرض بدون خادم
   يعترض كل طلبات /api/* وينفذها داخل المتصفح بنفس منطق server.js،
   والبيانات تنحفظ في localStorage. تُستخدم فقط في النسخة المنشورة كرابط
   (scripts/build-static.js)، أما المشروع الأصلي فيستخدم الخادم الحقيقي.
   ========================================================= */
(function () {
  const KEY = "inayati_demo_db_v5", SESS = "inayati_demo_session_v1";
  const now = () => new Date().toISOString().slice(0, 19).replace("T", " ");
  const addMonth = (d = new Date()) => { const x = new Date(d); x.setMonth(x.getMonth() + 1); return x.toISOString().slice(0, 10); };
  const today = () => new Date().toISOString().slice(0, 10);
  const clone = o => JSON.parse(JSON.stringify(o));
  const STATUS_AR = { pending_cod: "بانتظار الدفع عند الاستلام", paid: "تم الدفع", preparing: "قيد التجهيز", shipped: "تم الشحن", delivered: "تم التوصيل", cancelled: "ملغي" };
  const ORDER_FLOW = ["paid", "preparing", "shipped", "delivered"];

  async function hash(s) {
    try {
      const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode("inayati:" + s));
      return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
    } catch { return "plain:" + s; }
  }

  /* ---------- التخزين ---------- */
  let mem = null;
  function seed() {
    return {
      seq: { users: 2, orders: 0, items: 0, events: 0, subs: 0, quiz: 0, consults: 0 },
      users: [{ id: 1, name: "إدارة رينورا", email: "admin@renaura.sa", phone: null, city: null, role: "admin", created_at: now(), pass: null },
              { id: 2, name: "إدارة رينورا", email: "admin@inayati.sa", phone: null, city: null, role: "admin", created_at: now(), pass: null }],
      products: PRODUCTS.map(p => ({ ...clone(p), stock: 100, active: true })),
      kits: KITS.map(k => ({ ...clone(k), active: true })),
      quiz: [], orders: [], items: [], events: [], subs: [], consults: []
    };
  }
  function load() {
    if (mem) return mem;
    try { mem = JSON.parse(localStorage.getItem(KEY)); } catch {}
    if (!mem) mem = seed();
    else {
      // تحديث بيانات قديمة محفوظة في المتصفح: نضيف المنتجات الجديدة، ونطبق وسوم/أقسام جديدة مرة وحدة
      const have = new Set(mem.products.map(p => p.id));
      PRODUCTS.forEach(p => { if (!have.has(p.id)) mem.products.push({ ...clone(p), stock: 100, active: true }); });
      if (!mem.m2026_11) {
        const byId = Object.fromEntries(PRODUCTS.map(p => [p.id, p]));
        mem.products.forEach(p => { const s = byId[p.id]; if (!s) return;
          if (p.category === "curly" && s.category === "mousse") p.category = "mousse";
          if ((s.goodFor || []).includes("dandruff") && !(p.goodFor || []).includes("dandruff")) p.goodFor = [...(p.goodFor || []), "dandruff"]; });
        mem.m2026_11 = true;
      }
      save();
    }
    return mem;
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(mem)); } catch {} }
  const sessGet = () => { try { return JSON.parse(sessionStorage.getItem(SESS) || localStorage.getItem(SESS)) || {}; } catch { return {}; } };
  const sessSet = s => { try { localStorage.setItem(SESS, JSON.stringify(s)); } catch {} };

  /* ---------- أدوات ---------- */
  class HttpError extends Error { constructor(msg, code = 400) { super(msg); this.code = code; } }
  const bad = (m, c) => { throw new HttpError(m, c); };
  const pub = u => u && { id: u.id, name: u.name, email: u.email, phone: u.phone, city: u.city, role: u.role, created_at: u.created_at };
  const me = () => { const s = sessGet(); return s.userId ? load().users.find(u => u.id === s.userId) || null : null; };
  const needUser = () => me() || bad("سجلي دخولك أولاً", 401);
  const needAdmin = () => { const u = me(); if (!u || u.role !== "admin") bad("غير مصرح", 403); return u; };
  const catalog = (all) => { const d = load(); return { products: d.products.filter(p => all || p.active), kits: d.kits.filter(k => all || k.active) }; };
  function addEvent(orderId, status, note) { const d = load(); d.events.push({ id: ++d.seq.events, order_id: orderId, status, note: note || STATUS_AR[status] || status, created_at: now() }); }
  function orderFull(o) {
    const d = load();
    return { ...clone(o), status_ar: STATUS_AR[o.status], items: clone(d.items.filter(i => i.order_id === o.id)), events: clone(d.events.filter(e => e.order_id === o.id)) };
  }
  function chargeCard(payment) {
    const num = String((payment && payment.cardNumber) || "").replace(/\D/g, "");
    const [mm, yy] = String((payment && payment.expiry) || "").split("/").map(s => parseInt(s, 10));
    if (num.length < 13 || num.length > 19 || !luhn(num)) bad("رقم البطاقة غير صحيح");
    if (!mm || mm > 12 || new Date(2000 + (yy || 0), mm || 0, 1) <= new Date()) bad("تاريخ الانتهاء غير صحيح");
    if (!/^\d{3,4}$/.test(String((payment && payment.cvv) || ""))) bad("رمز CVV غير صحيح");
    if (num === "4000000000000002") bad("رفض البنك العملية (بطاقة اختبار مرفوضة)", 402);
    return { method: num.startsWith("4") ? "visa" : num.startsWith("5") ? "mastercard" : "mada",
      ref: "DEMO-" + Math.random().toString(16).slice(2, 10).toUpperCase() + "-" + num.slice(-4) };
  }
  const consultFull = c => ({ ...clone(c), doctor: DOCTORS.find(d => d.id === c.doctor_id) || null, type_ar: (CONSULT_TYPES[c.type] || {}).name });
  /* تحليل الصورة عبر قدرة "اسألي Claude" في الرابط المنشور (يستخدم حساب Claude الخاص بالزائرة بعد موافقتها) */
  async function analyzeWithSample(b) {
    const sample = window.claude && typeof window.claude.use === "function" ? await window.claude.use("sample") : null;
    if (!sample) bad("التحليل الذكي غير متاح في هذا العرض. جربيه من الرابط المنشور داخل Claude أو من النسخة الكاملة، أو احجزي استشارة مع الطبيبة.", 503);
    const caps = await sample.limits().catch(() => null);
    if (!caps || !caps.images) bad("هذا العرض ما يقدر يرسل الصور لـ Claude. احجزي استشارة مع الطبيبة بدلاً منه.", 503);
    const bytes = Uint8Array.from(atob(b.image), c => c.charCodeAt(0));
    const blob = new Blob([bytes], { type: b.mediaType });
    try {
      return await sample.json(Engine.ANALYSIS_PROMPT, { images: blob, modelTier: "default", cache: false });
    } catch (e) {
      const code = e && e.code;
      if (code === "not_granted" || code === "sampling_disabled") bad("ما تم السماح باستخدام Claude لهذه الصفحة، فما نقدر نحلل الصورة.", 403);
      if (code === "rate_limited") bad("وصلتي للحد المسموح الآن، جربي بعد شوي.", 429);
      if (code === "refused" || code === "image_rejected") bad("ما قدرنا نحلل هذي الصورة. جربي صورة ثانية للوجه بإضاءة طبيعية.", 422);
      if (code === "invalid_json") bad("صار خطأ في قراءة النتيجة، جربي مرة ثانية.", 502);
      bad("خدمة التحليل غير متاحة الآن، جربي بعد شوي.", 502);
    }
  }
  function luhn(n) { let s = 0, a = false; for (let i = n.length - 1; i >= 0; i--) { let x = +n[i]; if (a) { x *= 2; if (x > 9) x -= 9; } s += x; a = !a; } return s % 10 === 0; }
  function login(userId) {
    const s = sessGet(), d = load();
    if (s.pendingQuiz) d.quiz.push({ id: ++d.seq.quiz, user_id: userId, answers: s.pendingQuiz.answers, result: s.pendingQuiz.result, created_at: now() });
    sessSet({ userId }); save();
    return { user: pub(d.users.find(u => u.id === userId)) };
  }
  function priceCart(items, delivery, city) {
    const { products, kits } = catalog();
    const pMap = Object.fromEntries(products.map(p => [p.id, p])), kMap = Object.fromEntries(kits.map(k => [k.id, k]));
    const lines = items.map(it => {
      if (it.productId) {
        const p = pMap[it.productId] || bad("منتج غير متوفر");
        return { product: p, kit: null, tier: "single", productIds: [p.id], qty: Math.min(10, Math.max(1, parseInt(it.qty, 10) || 1)), purchaseType: "once", unitPrice: p.price };
      }
      const kit = kMap[it.kitId] || bad("كيت غير متوفر");
      if (!Engine.TIERS.includes(it.tier)) bad("مستوى غير صحيح");
      const qty = Math.min(10, Math.max(1, parseInt(it.qty, 10) || 1));
      const purchaseType = it.purchaseType === "subscription" ? "subscription" : "once";
      const productIds = Array.isArray(it.productIds) && it.productIds.length ? it.productIds : kit.tiers[it.tier];
      if (productIds.some(id => !pMap[id] || pMap[id].cat !== kit.cat)) bad("منتجات غير صحيحة في الكيت");
      return { kit, tier: it.tier, productIds, qty, purchaseType, unitPrice: Engine.kitPrice(productIds, pMap, purchaseType) };
    });
    const subtotal = lines.reduce((s, l) => s + l.unitPrice * l.qty, 0), shipping = Engine.shippingFor(subtotal, delivery, city);
    return { lines, subtotal, shipping, total: subtotal + shipping };
  }
  function runRenewals(force) {
    const d = load(), created = [];
    for (const s of d.subs.filter(s => s.status === "active" && (force || s.next_renewal <= today()))) {
      const kit = d.kits.find(k => k.id === s.kit_id), shipping = Engine.shippingFor(s.price);
      const o = { id: ++d.seq.orders, user_id: s.user_id, status: "paid", subtotal: s.price, shipping, total: s.price + shipping, payment_method: "saved_card",
        payment_ref: "DEMO-RENEW-" + Math.random().toString(16).slice(2, 8).toUpperCase(), address: s.address || {}, source: "renewal", subscription_id: s.id, created_at: now() };
      d.orders.push(o);
      d.items.push({ id: ++d.seq.items, order_id: o.id, kit_id: s.kit_id, kit_name: kit.name, tier: s.tier, product_ids: clone(s.product_ids), purchase_type: "subscription", qty: 1, unit_price: s.price });
      addEvent(o.id, "created", "تجديد شهري تلقائي للاشتراك #" + s.id);
      addEvent(o.id, "paid", "تم خصم المبلغ من البطاقة المحفوظة (تجريبي)");
      s.next_renewal = addMonth(); created.push(o.id);
    }
    save(); return created;
  }

  /* ---------- المسارات ---------- */
  const routes = [
    ["GET", /^\/api\/catalog$/, () => clone(catalog())],
    ["POST", /^\/api\/auth\/register$/, async (b) => {
      const { name, email, password, phone, city } = b || {}, d = load();
      if (!name || !email || !password) bad("الاسم والبريد وكلمة المرور مطلوبة");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) bad("البريد الإلكتروني غير صحيح");
      if (password.length < 8) bad("كلمة المرور لازم تكون 8 أحرف على الأقل");
      const e = email.toLowerCase().trim();
      if (d.users.find(u => u.email === e)) bad("البريد مسجل مسبقاً");
      const u = { id: ++d.seq.users, name: name.trim(), email: e, phone: phone || null, city: city || null, role: "customer", created_at: now(), pass: await hash(password) };
      d.users.push(u); return login(u.id);
    }],
    ["POST", /^\/api\/auth\/login$/, async (b) => {
      const d = load(), e = String((b && b.email) || "").toLowerCase().trim(), u = d.users.find(x => x.email === e);
      if (u && u.pass === null && u.role === "admin") u.pass = await hash("Admin@123");
      if (!u || u.pass !== await hash(String((b && b.password) || ""))) bad("البريد أو كلمة المرور غير صحيحة", 401);
      return login(u.id);
    }],
    ["POST", /^\/api\/auth\/logout$/, () => { sessSet({}); return { ok: true }; }],
    ["GET", /^\/api\/auth\/me$/, () => ({ user: pub(me()) })],
    ["PATCH", /^\/api\/auth\/me$/, (b) => { const u = needUser(); if (b.name) u.name = b.name; u.phone = b.phone || null; u.city = b.city || null; save(); return { user: pub(u) }; }],
    ["POST", /^\/api\/recommend$/, (b) => {
      const a = b && b.answers; if (!a || !a.focus || !a.budget) bad("إجابات ناقصة");
      const result = Engine.recommend(a, catalog()), u = me(), d = load();
      if (u) { d.quiz.push({ id: ++d.seq.quiz, user_id: u.id, answers: a, result, created_at: now() }); save(); }
      else sessSet({ ...sessGet(), pendingQuiz: { answers: a, result } });
      return result;
    }],
    ["GET", /^\/api\/quiz-results$/, () => { const u = needUser(); return clone(load().quiz.filter(q => q.user_id === u.id).reverse().slice(0, 10)); }],
    ["POST", /^\/api\/cart\/quote$/, (b) => { const q = priceCart((b && b.items) || [], b && b.delivery, b && b.city); return { subtotal: q.subtotal, shipping: q.shipping, total: q.total, lines: q.lines.map(l => ({ kitId: l.kit ? l.kit.id : null, productId: l.product ? l.product.id : null, unitPrice: l.unitPrice })) }; }],
    ["POST", /^\/api\/orders$/, (b) => {
      const u = needUser(), { items, address, payment } = b || {}, d = load();
      if (!Array.isArray(items) || !items.length) bad("السلة فاضية");
      if (!address || !address.name || !address.phone || !address.city || !address.street) bad("أكملي بيانات التوصيل");
      const delivery = (b || {}).delivery === "express" ? "express" : "standard";
      if (delivery === "express" && !Engine.EXPRESS_CITIES.includes(address.city)) bad("التوصيل السريع متاح في الرياض وجدة والدمام بس");
      address.delivery = delivery;
      const q = priceCart(items, delivery, address.city), hasSub = q.lines.some(l => l.purchaseType === "subscription");
      let method, ref = null, status;
      if (payment && payment.method === "cod") { if (hasSub) bad("الاشتراك الشهري يحتاج دفع بالبطاقة"); method = "cod"; status = "pending_cod"; }
      else {
        const num = String((payment && payment.cardNumber) || "").replace(/\D/g, "");
        const [mm, yy] = String((payment && payment.expiry) || "").split("/").map(s => parseInt(s, 10));
        if (num.length < 13 || num.length > 19 || !luhn(num)) bad("رقم البطاقة غير صحيح");
        if (!mm || mm > 12 || new Date(2000 + (yy || 0), mm || 0, 1) <= new Date()) bad("تاريخ الانتهاء غير صحيح");
        if (!/^\d{3,4}$/.test(String(payment.cvv || ""))) bad("رمز CVV غير صحيح");
        if (num === "4000000000000002") bad("رفض البنك العملية (بطاقة اختبار مرفوضة)", 402);
        method = num.startsWith("4") ? "visa" : num.startsWith("5") ? "mastercard" : "mada";
        ref = "DEMO-" + Math.random().toString(16).slice(2, 10).toUpperCase() + "-" + num.slice(-4); status = "paid";
      }
      const o = { id: ++d.seq.orders, user_id: u.id, status, subtotal: q.subtotal, shipping: q.shipping, total: q.total, payment_method: method, payment_ref: ref, address, source: "checkout", subscription_id: null, created_at: now() };
      d.orders.push(o);
      for (const l of q.lines) {
        d.items.push({ id: ++d.seq.items, order_id: o.id, kit_id: l.kit ? l.kit.id : null, kit_name: l.kit ? l.kit.name : `${l.product.brand} — ${l.product.name}`, tier: l.tier, product_ids: l.productIds, purchase_type: l.purchaseType, qty: l.qty, unit_price: l.unitPrice });
        if (l.purchaseType === "subscription") for (let i = 0; i < l.qty; i++)
          d.subs.push({ id: ++d.seq.subs, user_id: u.id, kit_id: l.kit.id, tier: l.tier, product_ids: l.productIds, price: l.unitPrice, status: "active", next_renewal: addMonth(), address, origin_order_id: o.id, created_at: now() });
      }
      addEvent(o.id, "created", "تم استلام الطلب");
      addEvent(o.id, status, method === "cod" ? "الدفع عند الاستلام" : `تم الدفع بنجاح (${ref})`);
      save(); return { order: orderFull(o) };
    }],
    ["GET", /^\/api\/orders$/, () => { const u = needUser(); return load().orders.filter(o => o.user_id === u.id).slice().reverse().map(orderFull); }],
    ["GET", /^\/api\/orders\/(\d+)$/, (b, m) => { const u = needUser(), o = load().orders.find(x => x.id === +m[1]); if (!o || (o.user_id !== u.id && u.role !== "admin")) bad("الطلب غير موجود", 404); return orderFull(o); }],
    ["POST", /^\/api\/orders\/(\d+)\/cancel$/, (b, m) => {
      const u = needUser(), d = load(), o = d.orders.find(x => x.id === +m[1] && x.user_id === u.id);
      if (!o) bad("الطلب غير موجود", 404);
      if (!["paid", "pending_cod"].includes(o.status)) bad("ما يمكن إلغاء الطلب بعد بدء تجهيزه");
      o.status = "cancelled"; d.subs.filter(s => s.origin_order_id === o.id).forEach(s => s.status = "cancelled");
      addEvent(o.id, "cancelled", "ألغت العميلة الطلب" + (o.payment_method !== "cod" ? " — تم استرجاع المبلغ (تجريبي)" : ""));
      save(); return orderFull(o);
    }],
    ["GET", /^\/api\/subscriptions$/, () => { const u = needUser(); return clone(load().subs.filter(s => s.user_id === u.id).reverse()); }],
    ["PATCH", /^\/api\/subscriptions\/(\d+)$/, (b, m) => {
      const u = needUser(), s = load().subs.find(x => x.id === +m[1] && x.user_id === u.id);
      if (!s) bad("الاشتراك غير موجود", 404); if (s.status === "cancelled") bad("الاشتراك ملغي");
      const { action, kitId, tier, productIds } = b || {};
      if (action === "pause") s.status = "paused";
      else if (action === "resume") { s.status = "active"; if (s.next_renewal < today()) s.next_renewal = today(); }
      else if (action === "cancel") s.status = "cancelled";
      else if (action === "skip") s.next_renewal = addMonth(new Date(s.next_renewal));
      else if (action === "update") {
        const l = priceCart([{ kitId: kitId || s.kit_id, tier: tier || s.tier, productIds: kitId || productIds ? productIds : null, qty: 1, purchaseType: "subscription" }]).lines[0];
        Object.assign(s, { kit_id: l.kit.id, tier: l.tier, product_ids: l.productIds, price: l.unitPrice });
      } else bad("إجراء غير معروف");
      save(); return clone(s);
    }],
    ["GET", /^\/api\/analyze\/status$/, async () => {
      const sample = window.claude && typeof window.claude.use === "function" ? await window.claude.use("sample") : null;
      const caps = sample ? await sample.limits().catch(() => null) : null;
      return { available: !!(caps && caps.images) };
    }],
    ["POST", /^\/api\/analyze$/, async (b) => {
      if (!b.image || !/^image\/(jpeg|png|webp)$/.test(b.mediaType || "")) bad("أرفقي صورة واضحة للوجه (JPG أو PNG)");
      const ai = await analyzeWithSample(b);
      if (!ai || typeof ai !== "object") bad("صار خطأ في قراءة النتيجة، جربي مرة ثانية.", 502);
      const answers = Engine.analysisToAnswers(ai, { budget: b.budget, allergies: b.allergies });
      const recommendation = Engine.recommend(answers, catalog()), u = me(), d = load();
      if (u) { d.quiz.push({ id: ++d.seq.quiz, user_id: u.id, answers, result: recommendation, created_at: now() }); save(); }
      return { analysis: ai, answers, recommendation };
    }],
    ["GET", /^\/api\/doctors$/, () => ({ doctors: DOCTORS, types: CONSULT_TYPES, times: CONSULT_TIMES })],
    ["GET", /^\/api\/consultations\/booked$/, (b, m, q) => load().consults.filter(c => c.type === "video" && c.status !== "cancelled" && c.doctor_id === q.get("doctor") && c.date === q.get("date")).map(c => c.time)],
    ["POST", /^\/api\/consultations$/, (b) => {
      const u = needUser(), d = load(), { doctorId, type, date, time, concern, notes, analysis, payment } = b || {};
      const t = CONSULT_TYPES[type];
      if (!DOCTORS.find(x => x.id === doctorId) || !t) bad("اختاري الطبيبة ونوع الاستشارة");
      if (!concern || String(concern).trim().length < 5) bad("اكتبي وش تبين تستشيرين فيه (5 أحرف على الأقل)");
      if (type === "video") {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date || "") || !CONSULT_TIMES.includes(time)) bad("اختاري اليوم والوقت");
        if (new Date(date + "T" + time + ":00") < new Date()) bad("هذا الموعد فات، اختاري موعد ثاني");
        if (d.consults.some(c => c.type === "video" && c.status !== "cancelled" && c.doctor_id === doctorId && c.date === date && c.time === time)) bad("هذا الموعد انحجز، اختاري وقت ثاني", 409);
      }
      const card = chargeCard(payment);
      const c = { id: ++d.seq.consults, user_id: u.id, doctor_id: doctorId, type, date: type === "video" ? date : null, time: type === "video" ? time : null,
        concern: String(concern).slice(0, 1000), notes: String(notes || "").slice(0, 1000), analysis: analysis || null, price: t.price, payment_ref: card.ref,
        status: "confirmed", doctor_note: null, recommended_kit: null, created_at: now() };
      d.consults.push(c); save(); return consultFull(c);
    }],
    ["GET", /^\/api\/consultations$/, () => { const u = needUser(); return load().consults.filter(c => c.user_id === u.id).slice().reverse().map(consultFull); }],
    ["POST", /^\/api\/consultations\/(\d+)\/cancel$/, (b, m) => {
      const u = needUser(), c = load().consults.find(x => x.id === +m[1] && x.user_id === u.id) || bad("الاستشارة غير موجودة", 404);
      if (c.status !== "confirmed") bad("ما يمكن إلغاء هذه الاستشارة");
      c.status = "cancelled"; save(); return consultFull(c);
    }],
    ["GET", /^\/api\/admin\/consultations$/, () => { needAdmin(); const d = load(); return d.consults.slice().reverse().map(c => ({ ...consultFull(c), customer: (d.users.find(u => u.id === c.user_id) || {}).name })); }],
    ["POST", /^\/api\/admin\/consultations\/(\d+)$/, (b, m) => {
      needAdmin(); const d = load(), c = d.consults.find(x => x.id === +m[1]) || bad("الاستشارة غير موجودة", 404);
      if (!["confirmed", "completed", "cancelled"].includes(b.status)) bad("حالة غير صحيحة");
      if (b.recommendedKit && !d.kits.some(k => k.id === b.recommendedKit)) bad("كيت غير موجود");
      Object.assign(c, { status: b.status, doctor_note: b.doctorNote || null, recommended_kit: b.recommendedKit || null }); save(); return consultFull(c);
    }],
    /* ----- الإدارة ----- */
    ["GET", /^\/api\/admin\/stats$/, () => {
      needAdmin(); const d = load(), live = d.orders.filter(o => o.status !== "cancelled"), act = d.subs.filter(s => s.status === "active");
      const top = {}; d.items.forEach(i => top[i.kit_id] = { name: i.kit_name, n: ((top[i.kit_id] || {}).n || 0) + i.qty });
      return { revenue: live.reduce((s, o) => s + o.total, 0), orders: d.orders.length, customers: d.users.filter(u => u.role === "customer").length,
        activeSubs: act.length, mrr: act.reduce((s, x) => s + x.price, 0), quizzes: d.quiz.length,
        consultations: d.consults.filter(c => c.status !== "cancelled").length, consultRevenue: d.consults.filter(c => c.status !== "cancelled").reduce((s, c) => s + c.price, 0), topKits: Object.values(top).sort((a, b) => b.n - a.n).slice(0, 5) };
    }],
    ["GET", /^\/api\/admin\/catalog$/, () => { needAdmin(); return clone(catalog(true)); }],
    ["POST", /^\/api\/admin\/products$/, (p) => {
      needAdmin(); const d = load();
      if (!p.id || !p.name || !p.brand || !["skin", "hair"].includes(p.cat) || !p.step || !(p.price >= 0)) bad("بيانات المنتج ناقصة (الرمز، البراند، الاسم، السعر)");
      if (d.products.find(x => x.id === p.id)) bad("رمز المنتج مستخدم");
      d.products.push({ id: p.id, cat: p.cat, step: p.step, brand: p.brand, country: p.country || "", name: p.name, nameEn: p.nameEn || "", size: p.size || "", price: +p.price, desc: p.desc || "",
        suits: p.suits || [], contains: p.contains || [], pack: { shape: "bottle", body: "#FFFFFF", cap: "#DDDDDD", accent: "#333333" },
        tiktok: p.tiktok || "https://www.tiktok.com/search?q=" + encodeURIComponent(`${p.brand} ${p.nameEn || p.name} review`), stock: +p.stock || 0, active: p.active !== false,
        fungal: p.cat === "skin" && (p.fungal === true || p.fungal === false) ? p.fungal : null, goodFor: p.goodFor || [],
        category: CATEGORIES[p.cat] && CATEGORIES[p.cat][p.category] ? p.category : "treatment", kitEligible: false, demo: false });
      save(); return { ok: true };
    }],
    ["PUT", /^\/api\/admin\/products\/([\w-]+)$/, (p, m) => {
      needAdmin(); const x = load().products.find(q => q.id === m[1]) || bad("المنتج غير موجود", 404);
      Object.assign(x, { category: CATEGORIES[x.cat] && CATEGORIES[x.cat][p.category] ? p.category : x.category, fungal: x.cat === "skin" && (p.fungal === true || p.fungal === false) ? p.fungal : null, goodFor: p.goodFor || [], brand: p.brand || x.brand, country: p.country || x.country, nameEn: p.nameEn || x.nameEn, tiktok: p.tiktok || x.tiktok, name: p.name, step: p.step, size: p.size || "", price: +p.price, desc: p.desc || "", suits: p.suits || [], contains: p.contains || [], stock: +p.stock || 0, active: p.active !== false });
      save(); return { ok: true };
    }],
    ["POST", /^\/api\/admin\/kits$/, (k) => saveKit(k, true, k && k.id)],
    ["PUT", /^\/api\/admin\/kits\/([\w-]+)$/, (k, m) => saveKit(k, false, m[1])],
    ["GET", /^\/api\/admin\/orders$/, () => {
      needAdmin(); const d = load();
      return d.orders.slice().reverse().map(o => { const u = d.users.find(x => x.id === o.user_id) || {}; return { ...orderFull(o), customer: u.name, email: u.email }; });
    }],
    ["POST", /^\/api\/admin\/orders\/(\d+)\/status$/, (b, m) => {
      needAdmin(); const { status, note } = b || {};
      if (![...ORDER_FLOW, "cancelled"].includes(status)) bad("حالة غير صحيحة");
      const o = load().orders.find(x => x.id === +m[1]) || bad("الطلب غير موجود", 404);
      o.status = status; addEvent(o.id, status, note || (status === "shipped" ? "تم تسليم الطلب لشركة الشحن — رقم التتبع SMSA-" + (100000 + o.id) : undefined));
      save(); return orderFull(o);
    }],
    ["GET", /^\/api\/admin\/customers$/, () => {
      needAdmin(); const d = load();
      return d.users.filter(u => u.role === "customer").reverse().map(u => {
        const os = d.orders.filter(o => o.user_id === u.id);
        return { ...pub(u), orders: os.length, spent: os.filter(o => o.status !== "cancelled").reduce((s, o) => s + o.total, 0), subs: d.subs.filter(s => s.user_id === u.id && s.status === "active").length };
      });
    }],
    ["GET", /^\/api\/admin\/subscriptions$/, () => {
      needAdmin(); const d = load();
      return d.subs.slice().reverse().map(s => ({ ...clone(s), customer: (d.users.find(u => u.id === s.user_id) || {}).name, kit_name: (d.kits.find(k => k.id === s.kit_id) || {}).name }));
    }],
    ["POST", /^\/api\/admin\/renewals$/, (b) => { needAdmin(); return { created: runRenewals(!!(b && b.force)) }; }]
  ];
  function saveKit(k, isNew, id) {
    needAdmin(); const d = load();
    if (!id || !k.name || (isNew && !["skin", "hair"].includes(k.cat))) bad("بيانات الكيت ناقصة");
    for (const t of Engine.TIERS) if (!Array.isArray(k.tiers && k.tiers[t]) || !k.tiers[t].length) bad("كل مستوى يحتاج منتجاً واحداً على الأقل");
    const data = { name: k.name, for: k.for || "", tagline: k.tagline || "", color: k.color || "#EEE", routine: k.routine || { morning: [], evening: [], weekly: [] }, tiktok: k.tiktok || "", active: k.active !== false, tiers: k.tiers };
    if (isNew) { if (d.kits.find(x => x.id === id)) bad("رمز الكيت مستخدم"); d.kits.push({ id, cat: k.cat, ...data }); }
    else Object.assign(d.kits.find(x => x.id === id) || bad("الكيت غير موجود", 404), data);
    save(); return { ok: true };
  }

  /* ---------- اعتراض fetch ---------- */
  const realFetch = window.fetch.bind(window);
  window.fetch = async (input, opts = {}) => {
    const url = new URL(typeof input === "string" ? input : input.url, location.href);
    if (!url.pathname.includes("/api/")) return realFetch(input, opts);
    const path = url.pathname.slice(url.pathname.indexOf("/api/")), method = (opts.method || "GET").toUpperCase();
    let status = 200, body;
    try {
      const route = routes.find(([m, re]) => m === method && re.test(path));
      if (!route) bad("غير موجود", 404);
      body = await route[2](opts.body ? JSON.parse(opts.body) : {}, path.match(route[1]), url.searchParams);
    } catch (e) { status = e.code || 500; body = { error: e.message || "حدث خطأ" }; if (!e.code) console.error(e); }
    return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
  };

  /* نوافذ التأكيد لا تظهر داخل الرابط المنشور، فنعتبر الإجابة «نعم» */
  window.confirm = () => true;
})();
