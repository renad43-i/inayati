/* =========================================================
   رينورا — خادم المتجر (Express + SQLite)
   تشغيل: npm start  ثم افتحي http://localhost:3000
   ========================================================= */
const path = require("path");
const crypto = require("crypto");
const express = require("express");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const { db, getCatalog } = require("./lib/db");
const seed = require("./public/js/data.js");
const Engine = require("./public/js/engine.js");

const app = express();
// صور تحليل البشرة تُرسل مصغّرة من المتصفح، فنسمح بحجم أكبر لهذا المسار فقط
app.use("/api/analyze", express.json({ limit: "6mb" }));
app.use(express.json({ limit: "200kb" }));
app.use(session({
  secret: process.env.SESSION_SECRET || crypto.randomBytes(32).toString("hex"),
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: "lax", maxAge: 1000 * 60 * 60 * 24 * 7 }
}));
app.use(express.static(path.join(__dirname, "public"), { extensions: ["html"] }));

/* ---------- أدوات ---------- */
const STATUS_AR = { pending_cod: "بانتظار الدفع عند الاستلام", paid: "تم الدفع", preparing: "قيد التجهيز", shipped: "تم الشحن", delivered: "تم التوصيل", cancelled: "ملغي" };
const ORDER_FLOW = ["paid", "preparing", "shipped", "delivered"];
const bad = (res, msg, code = 400) => res.status(code).json({ error: msg });
const addMonth = (d = new Date()) => { const x = new Date(d); x.setMonth(x.getMonth() + 1); return x.toISOString().slice(0, 10); };
const publicUser = u => u && ({ id: u.id, name: u.name, email: u.email, phone: u.phone, city: u.city, role: u.role, created_at: u.created_at });
function currentUser(req) { return req.session.userId ? db.prepare("SELECT * FROM users WHERE id = ?").get(req.session.userId) : null; }
/* تجديد الجلسة عند الدخول (حماية من session fixation) مع الاحتفاظ بنتيجة الاختبار قبل التسجيل */
function login(req, res, userId) {
  const pending = req.session.pendingQuiz;
  req.session.regenerate(err => {
    if (err) return bad(res, "تعذر تسجيل الدخول", 500);
    req.session.userId = userId;
    if (pending) db.prepare("INSERT INTO quiz_results (user_id,answers,result) VALUES (?,?,?)").run(userId, JSON.stringify(pending.answers), JSON.stringify(pending.result));
    res.json({ user: publicUser(currentUser(req)) });
  });
}
function requireUser(req, res, next) { const u = currentUser(req); if (!u) return bad(res, "سجلي دخولك أولاً", 401); req.user = u; next(); }
function requireAdmin(req, res, next) { const u = currentUser(req); if (!u || u.role !== "admin") return bad(res, "غير مصرح", 403); req.user = u; next(); }
function addEvent(orderId, status, note) {
  db.prepare("INSERT INTO order_events (order_id,status,note) VALUES (?,?,?)").run(orderId, status, note || STATUS_AR[status] || status);
}
function luhn(num) {
  let sum = 0, alt = false;
  for (let i = num.length - 1; i >= 0; i--) { let n = +num[i]; if (alt) { n *= 2; if (n > 9) n -= 9; } sum += n; alt = !alt; }
  return sum % 10 === 0;
}
/* بوابة دفع تجريبية: تتحقق من البطاقة وترجع رقم عملية (تُستخدم للطلبات والاستشارات) */
function chargeCard(payment) {
  const num = String((payment && payment.cardNumber) || "").replace(/\D/g, "");
  const [mm, yy] = String((payment && payment.expiry) || "").split("/").map(s => parseInt(s, 10));
  const exp = new Date(2000 + (yy || 0), mm || 0, 1);
  if (num.length < 13 || num.length > 19 || !luhn(num)) return { error: "رقم البطاقة غير صحيح" };
  if (!mm || mm > 12 || exp <= new Date()) return { error: "تاريخ الانتهاء غير صحيح" };
  if (!/^\d{3,4}$/.test(String((payment && payment.cvv) || ""))) return { error: "رمز CVV غير صحيح" };
  if (num === "4000000000000002") return { error: "رفض البنك العملية (بطاقة اختبار مرفوضة)", code: 402 };
  return { method: num.startsWith("4") ? "visa" : num.startsWith("5") ? "mastercard" : "mada",
    ref: "DEMO-" + crypto.randomBytes(4).toString("hex").toUpperCase() + "-" + num.slice(-4) };
}
function orderWithItems(o) {
  if (!o) return null;
  return { ...o, address: JSON.parse(o.address), status_ar: STATUS_AR[o.status],
    items: db.prepare("SELECT * FROM order_items WHERE order_id = ?").all(o.id).map(i => ({ ...i, product_ids: JSON.parse(i.product_ids) })),
    events: db.prepare("SELECT * FROM order_events WHERE order_id = ? ORDER BY id").all(o.id) };
}

/* =================== الكتالوج =================== */
app.get("/api/catalog", (req, res) => res.json(getCatalog()));

/* =================== الحسابات =================== */
app.post("/api/auth/register", (req, res) => {
  const { name, email, password, phone, city } = req.body || {};
  if (!name || !email || !password) return bad(res, "الاسم والبريد وكلمة المرور مطلوبة");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return bad(res, "البريد الإلكتروني غير صحيح");
  if (password.length < 8) return bad(res, "كلمة المرور لازم تكون 8 أحرف على الأقل");
  if (db.prepare("SELECT id FROM users WHERE email = ?").get(email.toLowerCase())) return bad(res, "البريد مسجل مسبقاً");
  const r = db.prepare("INSERT INTO users (name,email,phone,city,password_hash) VALUES (?,?,?,?,?)")
    .run(name.trim(), email.toLowerCase().trim(), phone || null, city || null, bcrypt.hashSync(password, 10));
  login(req, res, Number(r.lastInsertRowid));
});
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body || {};
  const u = db.prepare("SELECT * FROM users WHERE email = ?").get(String(email || "").toLowerCase().trim());
  if (!u || !bcrypt.compareSync(String(password || ""), u.password_hash)) return bad(res, "البريد أو كلمة المرور غير صحيحة", 401);
  login(req, res, u.id);
});
app.post("/api/auth/logout", (req, res) => req.session.destroy(() => res.json({ ok: true })));
app.get("/api/auth/me", (req, res) => res.json({ user: publicUser(currentUser(req)) }));
app.patch("/api/auth/me", requireUser, (req, res) => {
  const { name, phone, city } = req.body || {};
  db.prepare("UPDATE users SET name = COALESCE(?,name), phone = ?, city = ? WHERE id = ?").run(name || null, phone || null, city || null, req.user.id);
  res.json({ user: publicUser(currentUser(req)) });
});

/* =================== الاختبار والتوصية =================== */
app.post("/api/recommend", (req, res) => {
  const answers = req.body && req.body.answers;
  if (!answers || !answers.focus || !answers.budget) return bad(res, "إجابات ناقصة");
  const result = Engine.recommend(answers, getCatalog());
  const u = currentUser(req);
  if (u) db.prepare("INSERT INTO quiz_results (user_id,answers,result) VALUES (?,?,?)").run(u.id, JSON.stringify(answers), JSON.stringify(result));
  else req.session.pendingQuiz = { answers, result }; // تُحفظ في الحساب بعد التسجيل
  res.json(result);
});
app.get("/api/quiz-results", requireUser, (req, res) => {
  res.json(db.prepare("SELECT * FROM quiz_results WHERE user_id = ? ORDER BY id DESC LIMIT 10").all(req.user.id)
    .map(r => ({ ...r, answers: JSON.parse(r.answers), result: JSON.parse(r.result) })));
});

/* =================== الطلبات والدفع التجريبي =================== */
function priceCart(items, delivery, city) {
  const { products, kits } = getCatalog();
  const pMap = Object.fromEntries(products.map(p => [p.id, p]));
  const kMap = Object.fromEntries(kits.map(k => [k.id, k]));
  const lines = [];
  for (const it of items) {
    if (it.productId) { // منتج منفرد من المتجر
      const p = pMap[it.productId];
      if (!p) throw new Error("منتج غير متوفر");
      const qty = Math.min(10, Math.max(1, parseInt(it.qty, 10) || 1));
      lines.push({ product: p, kit: null, tier: "single", productIds: [p.id], qty, purchaseType: "once", unitPrice: p.price });
      continue;
    }
    const kit = kMap[it.kitId];
    if (!kit) throw new Error("روتين غير متوفر");
    if (!Engine.TIERS.includes(it.tier)) throw new Error("مستوى غير صحيح");
    const qty = Math.min(10, Math.max(1, parseInt(it.qty, 10) || 1));
    const purchaseType = it.purchaseType === "subscription" ? "subscription" : "once";
    // المنتجات المخصصة (بعد استبدال مسببات الحساسية) يجب أن تكون منتجات فعّالة من نفس فئة الروتين
    let productIds = Array.isArray(it.productIds) && it.productIds.length ? it.productIds : kit.tiers[it.tier];
    if (productIds.length > 12 || productIds.some(id => !pMap[id] || pMap[id].cat !== kit.cat)) throw new Error("منتجات غير صحيحة في الروتين");
    lines.push({ kit, tier: it.tier, productIds, qty, purchaseType, unitPrice: Engine.kitPrice(productIds, pMap, purchaseType) });
  }
  const subtotal = lines.reduce((s, l) => s + l.unitPrice * l.qty, 0);
  const shipping = Engine.shippingFor(subtotal, delivery, city);
  return { lines, subtotal, shipping, total: subtotal + shipping };
}
app.post("/api/cart/quote", (req, res) => {
  try { const b = req.body || {}; const q = priceCart(b.items || [], b.delivery, b.city); res.json({ subtotal: q.subtotal, shipping: q.shipping, total: q.total, lines: q.lines.map(l => ({ kitId: l.kit ? l.kit.id : null, productId: l.product ? l.product.id : null, unitPrice: l.unitPrice })) }); }
  catch (e) { bad(res, e.message); }
});

app.post("/api/orders", requireUser, (req, res) => {
  const { items, address, payment } = req.body || {};
  if (!Array.isArray(items) || !items.length) return bad(res, "السلة فاضية");
  if (!address || !address.name || !address.phone || !address.city || !address.street) return bad(res, "أكملي بيانات التوصيل");
  const delivery = (req.body || {}).delivery === "express" ? "express" : "standard";
  if (delivery === "express" && !Engine.EXPRESS_CITIES.includes(address.city)) return bad(res, "التوصيل السريع متاح في الرياض وجدة والدمام بس");
  address.delivery = delivery;
  let q; try { q = priceCart(items, delivery, address.city); } catch (e) { return bad(res, e.message); }
  const hasSub = q.lines.some(l => l.purchaseType === "subscription");

  // ----- بوابة دفع تجريبية -----
  let method, ref = null, status;
  if (payment && payment.method === "cod") {
    if (hasSub) return bad(res, "الاشتراك الشهري يحتاج دفع بالبطاقة");
    method = "cod"; status = "pending_cod";
  } else {
    const card = chargeCard(payment);
    if (card.error) return bad(res, card.error, card.code);
    ({ method, ref } = card);
    status = "paid";
  }

  db.exec("BEGIN");
  try {
    const o = db.prepare("INSERT INTO orders (user_id,status,subtotal,shipping,total,payment_method,payment_ref,address) VALUES (?,?,?,?,?,?,?,?)")
      .run(req.user.id, status, q.subtotal, q.shipping, q.total, method, ref, JSON.stringify(address));
    const orderId = Number(o.lastInsertRowid);
    const insItem = db.prepare("INSERT INTO order_items (order_id,kit_id,kit_name,tier,product_ids,purchase_type,qty,unit_price) VALUES (?,?,?,?,?,?,?,?)");
    const insSub = db.prepare("INSERT INTO subscriptions (user_id,kit_id,tier,product_ids,price,next_renewal,address,origin_order_id) VALUES (?,?,?,?,?,?,?,?)");
    for (const l of q.lines) {
      insItem.run(orderId, l.kit ? l.kit.id : null, l.kit ? l.kit.name : `${l.product.brand} — ${l.product.name}`, l.tier, JSON.stringify(l.productIds), l.purchaseType, l.qty, l.unitPrice);
      if (l.purchaseType === "subscription")
        for (let i = 0; i < l.qty; i++) insSub.run(req.user.id, l.kit.id, l.tier, JSON.stringify(l.productIds), l.unitPrice, addMonth(), JSON.stringify(address), orderId);
    }
    addEvent(orderId, "created", "تم استلام الطلب");
    addEvent(orderId, status, method === "cod" ? "الدفع عند الاستلام" : `تم الدفع بنجاح (${ref})`);
    db.exec("COMMIT");
    res.json({ order: orderWithItems(db.prepare("SELECT * FROM orders WHERE id = ?").get(orderId)) });
  } catch (e) { db.exec("ROLLBACK"); console.error(e); bad(res, "تعذر إنشاء الطلب", 500); }
});
app.get("/api/orders", requireUser, (req, res) =>
  res.json(db.prepare("SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC").all(req.user.id).map(orderWithItems)));
app.get("/api/orders/:id", requireUser, (req, res) => {
  const o = db.prepare("SELECT * FROM orders WHERE id = ?").get(req.params.id);
  if (!o || (o.user_id !== req.user.id && req.user.role !== "admin")) return bad(res, "الطلب غير موجود", 404);
  res.json(orderWithItems(o));
});
app.post("/api/orders/:id/cancel", requireUser, (req, res) => {
  const o = db.prepare("SELECT * FROM orders WHERE id = ? AND user_id = ?").get(req.params.id, req.user.id);
  if (!o) return bad(res, "الطلب غير موجود", 404);
  if (!["paid", "pending_cod"].includes(o.status)) return bad(res, "ما يمكن إلغاء الطلب بعد بدء تجهيزه");
  db.prepare("UPDATE orders SET status = 'cancelled' WHERE id = ?").run(o.id);
  db.prepare("UPDATE subscriptions SET status = 'cancelled' WHERE origin_order_id = ?").run(o.id);
  addEvent(o.id, "cancelled", "ألغت العميلة الطلب" + (o.payment_method !== "cod" ? " — تم استرجاع المبلغ (تجريبي)" : ""));
  res.json(orderWithItems(db.prepare("SELECT * FROM orders WHERE id = ?").get(o.id)));
});

/* =================== الاشتراك الشهري =================== */
const subRow = s => s && ({ ...s, product_ids: JSON.parse(s.product_ids), address: s.address ? JSON.parse(s.address) : null });
app.get("/api/subscriptions", requireUser, (req, res) =>
  res.json(db.prepare("SELECT * FROM subscriptions WHERE user_id = ? ORDER BY id DESC").all(req.user.id).map(subRow)));
app.patch("/api/subscriptions/:id", requireUser, (req, res) => {
  const s = db.prepare("SELECT * FROM subscriptions WHERE id = ? AND user_id = ?").get(req.params.id, req.user.id);
  if (!s) return bad(res, "الاشتراك غير موجود", 404);
  if (s.status === "cancelled") return bad(res, "الاشتراك ملغي");
  const { action, kitId, tier, productIds } = req.body || {};
  if (action === "pause") db.prepare("UPDATE subscriptions SET status='paused' WHERE id=?").run(s.id);
  else if (action === "resume") db.prepare("UPDATE subscriptions SET status='active', next_renewal = MAX(next_renewal, date('now')) WHERE id=?").run(s.id);
  else if (action === "cancel") db.prepare("UPDATE subscriptions SET status='cancelled' WHERE id=?").run(s.id);
  else if (action === "skip") db.prepare("UPDATE subscriptions SET next_renewal=? WHERE id=?").run(addMonth(new Date(s.next_renewal)), s.id);
  else if (action === "update") {
    // تحديث الروتين حسب احتياج هذا الشهر (بعد إعادة الاختبار)
    let q; try { q = priceCart([{ kitId: kitId || s.kit_id, tier: tier || s.tier, productIds, qty: 1, purchaseType: "subscription" }]); } catch (e) { return bad(res, e.message); }
    const l = q.lines[0];
    db.prepare("UPDATE subscriptions SET kit_id=?, tier=?, product_ids=?, price=? WHERE id=?").run(l.kit.id, l.tier, JSON.stringify(l.productIds), l.unitPrice, s.id);
  } else return bad(res, "إجراء غير معروف");
  res.json(subRow(db.prepare("SELECT * FROM subscriptions WHERE id = ?").get(s.id)));
});

/* تجديد الاشتراكات المستحقة: ينشئ طلباً جديداً لكل اشتراك فعّال حان موعده.
   في الإنتاج تُشغَّل يومياً (cron) — هنا تُشغَّل من لوحة الإدارة للعرض. */
function runRenewals(force) {
  const due = db.prepare(`SELECT * FROM subscriptions WHERE status='active' ${force ? "" : "AND next_renewal <= date('now')"}`).all();
  const created = [];
  for (const s of due) {
    const kit = db.prepare("SELECT name FROM kits WHERE id = ?").get(s.kit_id);
    const shipping = Engine.shippingFor(s.price);
    const o = db.prepare("INSERT INTO orders (user_id,status,subtotal,shipping,total,payment_method,payment_ref,address,source,subscription_id) VALUES (?,?,?,?,?,?,?,?,'renewal',?)")
      .run(s.user_id, "paid", s.price, shipping, s.price + shipping, "saved_card", "DEMO-RENEW-" + crypto.randomBytes(3).toString("hex").toUpperCase(), s.address || "{}", s.id);
    const oid = Number(o.lastInsertRowid);
    db.prepare("INSERT INTO order_items (order_id,kit_id,kit_name,tier,product_ids,purchase_type,qty,unit_price) VALUES (?,?,?,?,?,'subscription',1,?)")
      .run(oid, s.kit_id, kit.name, s.tier, s.product_ids, s.price);
    addEvent(oid, "created", "تجديد شهري تلقائي للاشتراك #" + s.id);
    addEvent(oid, "paid", "تم خصم المبلغ من البطاقة المحفوظة (تجريبي)");
    db.prepare("UPDATE subscriptions SET next_renewal=? WHERE id=?").run(addMonth(), s.id);
    created.push(oid);
  }
  return created;
}

/* =================== تحليل البشرة بالذكاء الاصطناعي ===================
   يستخدم Anthropic API (يحتاج ANTHROPIC_API_KEY في بيئة الخادم).
   الصورة لا تُحفظ في الخادم؛ نحفظ النتيجة فقط في حساب العميلة. */
let anthropicClient = null;
function getAnthropic() {
  if (anthropicClient) return anthropicClient;
  try {
    const mod = require("@anthropic-ai/sdk");
    const Anthropic = mod.default || mod;
    anthropicClient = { Anthropic, client: new Anthropic() };
  } catch { anthropicClient = null; }
  return anthropicClient;
}
const aiConfigured = () => !!(process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN);
app.get("/api/analyze/status", (req, res) => res.json({ available: aiConfigured() && !!getAnthropic() }));
app.post("/api/analyze", async (req, res) => {
  const { image, mediaType, budget, allergies } = req.body || {};
  if (!image || !/^image\/(jpeg|png|webp)$/.test(mediaType || "")) return bad(res, "أرفقي صورة واضحة للوجه (JPG أو PNG)");
  if (!aiConfigured()) return bad(res, "التحليل الذكي غير مفعّل في هذا الخادم: أضيفي مفتاح ANTHROPIC_API_KEY ثم أعيدي التشغيل.", 503);
  const ai = getAnthropic();
  if (!ai) return bad(res, "مكتبة Anthropic غير مثبتة: شغلي npm install", 503);
  const { Anthropic, client } = ai;
  try {
    const msg = await client.beta.messages.create({
      model: "claude-opus-5-5",
      max_tokens: 16000,
      // نموذج احتياطي تلقائي إذا رفض النموذج الطلب
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: { effort: "medium" },
      messages: [{ role: "user", content: [
        { type: "image", source: { type: "base64", media_type: mediaType, data: image } },
        { type: "text", text: Engine.ANALYSIS_PROMPT }
      ] }]
    });
    if (msg.stop_reason === "refusal") return bad(res, "ما قدرنا نحلل هذي الصورة. جربي صورة ثانية للوجه بإضاءة طبيعية، أو احجزي استشارة.", 422);
    const text = msg.content.filter(b => b.type === "text").map(b => b.text).join("\n");
    const result = Engine.parseJSONLoose(text);
    if (!result || typeof result !== "object") return bad(res, "صار خطأ في قراءة نتيجة التحليل، جربي مرة ثانية.", 502);
    return res.json(finishAnalysis(req, result, { budget, allergies }));
  } catch (e) {
    if (e instanceof Anthropic.AuthenticationError) return bad(res, "مفتاح Anthropic غير صالح.", 503);
    if (e instanceof Anthropic.RateLimitError) return bad(res, "ضغط على خدمة التحليل، جربي بعد شوي.", 429);
    if (e instanceof Anthropic.APIError) { console.error("Anthropic API", e.status, e.message); return bad(res, "خدمة التحليل غير متاحة الآن، جربي بعد شوي.", 502); }
    console.error(e); return bad(res, "تعذر التحليل", 500);
  }
});
/* تحويل نتيجة التحليل لتوصية روتين + حفظها في الحساب */
function finishAnalysis(req, ai, extra) {
  const answers = Engine.analysisToAnswers(ai, extra);
  const recommendation = Engine.recommend(answers, getCatalog());
  const u = currentUser(req);
  if (u) db.prepare("INSERT INTO quiz_results (user_id,answers,result) VALUES (?,?,?)").run(u.id, JSON.stringify(answers), JSON.stringify(recommendation));
  return { analysis: ai, answers, recommendation };
}

/* =================== الاستشارات مع الطبيبات =================== */
const consultRow = c => c && ({ ...c, analysis: c.analysis ? JSON.parse(c.analysis) : null,
  doctor: seed.DOCTORS.find(d => d.id === c.doctor_id) || null, type_ar: (seed.CONSULT_TYPES[c.type] || {}).name });
app.get("/api/doctors", (req, res) => res.json({ doctors: seed.DOCTORS, types: seed.CONSULT_TYPES, times: seed.CONSULT_TIMES }));
app.get("/api/consultations/booked", (req, res) => {
  const { doctor, date } = req.query;
  res.json(db.prepare("SELECT time FROM consultations WHERE doctor_id=? AND date=? AND type='video' AND status!='cancelled'").all(String(doctor || ""), String(date || "")).map(r => r.time));
});
app.post("/api/consultations", requireUser, (req, res) => {
  const { doctorId, type, date, time, concern, notes, analysis, payment } = req.body || {};
  const doc = seed.DOCTORS.find(d => d.id === doctorId), t = seed.CONSULT_TYPES[type];
  if (!doc || !t) return bad(res, "اختاري الطبيبة ونوع الاستشارة");
  if (!concern || String(concern).trim().length < 5) return bad(res, "اكتبي وش تبين تستشيرين فيه (5 أحرف على الأقل)");
  if (type === "video") {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date || "") || !seed.CONSULT_TIMES.includes(time)) return bad(res, "اختاري اليوم والوقت");
    if (new Date(date + "T" + time + ":00") < new Date()) return bad(res, "هذا الموعد فات، اختاري موعد ثاني");
    if (db.prepare("SELECT 1 FROM consultations WHERE doctor_id=? AND date=? AND time=? AND type='video' AND status!='cancelled'").get(doctorId, date, time))
      return bad(res, "هذا الموعد انحجز، اختاري وقت ثاني", 409);
  }
  const card = chargeCard(payment);
  if (card.error) return bad(res, card.error, card.code);
  try {
    const r = db.prepare("INSERT INTO consultations (user_id,doctor_id,type,date,time,concern,notes,analysis,price,payment_ref) VALUES (?,?,?,?,?,?,?,?,?,?)")
      .run(req.user.id, doctorId, type, type === "video" ? date : null, type === "video" ? time : null, String(concern).slice(0, 1000), String(notes || "").slice(0, 1000),
        analysis ? JSON.stringify(analysis).slice(0, 8000) : null, t.price, card.ref);
    res.json(consultRow(db.prepare("SELECT * FROM consultations WHERE id=?").get(Number(r.lastInsertRowid))));
  } catch (e) { if (String(e.message).includes("UNIQUE")) return bad(res, "هذا الموعد انحجز، اختاري وقت ثاني", 409); throw e; }
});
app.get("/api/consultations", requireUser, (req, res) =>
  res.json(db.prepare("SELECT * FROM consultations WHERE user_id=? ORDER BY id DESC").all(req.user.id).map(consultRow)));
app.post("/api/consultations/:id/cancel", requireUser, (req, res) => {
  const c = db.prepare("SELECT * FROM consultations WHERE id=? AND user_id=?").get(req.params.id, req.user.id);
  if (!c) return bad(res, "الاستشارة غير موجودة", 404);
  if (c.status !== "confirmed") return bad(res, "ما يمكن إلغاء هذه الاستشارة");
  db.prepare("UPDATE consultations SET status='cancelled' WHERE id=?").run(c.id);
  res.json(consultRow(db.prepare("SELECT * FROM consultations WHERE id=?").get(c.id)));
});

/* =================== لوحة الإدارة =================== */
app.get("/api/admin/consultations", requireAdmin, (req, res) =>
  res.json(db.prepare("SELECT c.*, u.name customer FROM consultations c JOIN users u ON u.id=c.user_id ORDER BY c.id DESC").all().map(consultRow)));
app.post("/api/admin/consultations/:id", requireAdmin, (req, res) => {
  const { status, doctorNote, recommendedKit } = req.body || {};
  if (!["confirmed", "completed", "cancelled"].includes(status)) return bad(res, "حالة غير صحيحة");
  if (recommendedKit && !getCatalog().kits.some(k => k.id === recommendedKit)) return bad(res, "روتين غير موجود");
  const r = db.prepare("UPDATE consultations SET status=?, doctor_note=?, recommended_kit=? WHERE id=?").run(status, doctorNote || null, recommendedKit || null, req.params.id);
  if (!r.changes) return bad(res, "الاستشارة غير موجودة", 404);
  res.json(consultRow(db.prepare("SELECT * FROM consultations WHERE id=?").get(req.params.id)));
});
app.get("/api/admin/stats", requireAdmin, (req, res) => {
  const one = sql => db.prepare(sql).get();
  res.json({
    revenue: one("SELECT COALESCE(SUM(total),0) v FROM orders WHERE status NOT IN ('cancelled')").v,
    orders: one("SELECT COUNT(*) v FROM orders").v,
    customers: one("SELECT COUNT(*) v FROM users WHERE role='customer'").v,
    activeSubs: one("SELECT COUNT(*) v FROM subscriptions WHERE status='active'").v,
    mrr: one("SELECT COALESCE(SUM(price),0) v FROM subscriptions WHERE status='active'").v,
    quizzes: one("SELECT COUNT(*) v FROM quiz_results").v,
    consultations: one("SELECT COUNT(*) v FROM consultations WHERE status!='cancelled'").v,
    consultRevenue: one("SELECT COALESCE(SUM(price),0) v FROM consultations WHERE status!='cancelled'").v,
    topKits: db.prepare("SELECT kit_name name, SUM(qty) n FROM order_items GROUP BY kit_id ORDER BY n DESC LIMIT 5").all()
  });
});
app.get("/api/admin/catalog", requireAdmin, (req, res) => res.json(getCatalog({ includeInactive: true })));

const tagsJSON = (p, old = {}) => JSON.stringify({ ...old, fungal: p.fungal === true || p.fungal === false ? p.fungal : null, goodFor: Array.isArray(p.goodFor) ? p.goodFor.filter(k => seed.CONCERN_TAGS[k]) : [],
  category: seed.CATEGORIES[p.cat || old.cat] && seed.CATEGORIES[p.cat || old.cat][p.category] ? p.category : (old.category || "treatment"),
  kitEligible: old.kitEligible !== undefined ? old.kitEligible : false, image: safeImage(p.image) });
// رابط صورة المنتج: https أو ملف داخل assets فقط
function safeImage(u) { u = String(u || "").trim(); return /^https:\/\/[^\s"'<>]+$/i.test(u) || /^assets\/[\w\-./]+$/.test(u) ? u.slice(0, 500) : ""; }
app.post("/api/admin/products", requireAdmin, (req, res) => {
  const p = req.body || {};
  if (!p.id || !p.name || !p.brand || !["skin", "hair"].includes(p.cat) || !p.step || !(p.price >= 0)) return bad(res, "بيانات المنتج ناقصة (الرمز، البراند، الاسم، السعر)");
  if (db.prepare("SELECT id FROM products WHERE id=?").get(p.id)) return bad(res, "رمز المنتج مستخدم");
  const tiktok = p.tiktok || "https://www.tiktok.com/search?q=" + encodeURIComponent(`${p.brand} ${p.nameEn || p.name} review`);
  db.prepare("INSERT INTO products (id,cat,step,brand,country,name,name_en,size,price,description,suits,contains,pack,tiktok,tags,stock,active) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)")
    .run(p.id, p.cat, p.step, p.brand, p.country || "", p.name, p.nameEn || "", p.size || "", +p.price, p.desc || "", JSON.stringify(p.suits || []), JSON.stringify(p.contains || []),
      JSON.stringify(p.pack || { shape: "bottle", body: "#FFFFFF", cap: "#DDDDDD", accent: "#333333" }), tiktok, tagsJSON(p), +p.stock || 0, p.active === false ? 0 : 1);
  res.json({ ok: true });
});
app.put("/api/admin/products/:id", requireAdmin, (req, res) => {
  const p = req.body || {};
  const r = db.prepare("UPDATE products SET tags=?, brand=COALESCE(?,brand), country=COALESCE(?,country), name=?, name_en=COALESCE(?,name_en), tiktok=COALESCE(?,tiktok), step=?, size=?, price=?, description=?, suits=?, contains=?, stock=?, active=? WHERE id=?")
    .run(tagsJSON(p, (() => { const r = db.prepare("SELECT cat, tags FROM products WHERE id=?").get(req.params.id); return r ? { ...JSON.parse(r.tags || "{}"), cat: r.cat } : {}; })()), p.brand || null, p.country || null, p.name, p.nameEn || null, p.tiktok || null, p.step, p.size || "", +p.price, p.desc || "", JSON.stringify(p.suits || []), JSON.stringify(p.contains || []), +p.stock || 0, p.active === false ? 0 : 1, req.params.id);
  if (!r.changes) return bad(res, "المنتج غير موجود", 404);
  res.json({ ok: true });
});
app.post("/api/admin/kits", requireAdmin, (req, res) => saveKit(req, res, true));
app.put("/api/admin/kits/:id", requireAdmin, (req, res) => saveKit(req, res, false));
function saveKit(req, res, isNew) {
  const k = req.body || {}; const id = isNew ? k.id : req.params.id;
  if (!id || !k.name || !["skin", "hair"].includes(k.cat)) return bad(res, "بيانات الروتين ناقصة");
  const tiers = k.tiers || {};
  for (const t of Engine.TIERS) if (!Array.isArray(tiers[t]) || !tiers[t].length) return bad(res, "كل مستوى يحتاج منتجاً واحداً على الأقل");
  db.exec("BEGIN");
  try {
    if (isNew) db.prepare("INSERT INTO kits (id,cat,name,for_label,tagline,color,routine,tiktok,active) VALUES (?,?,?,?,?,?,?,?,?)")
      .run(id, k.cat, k.name, k.for || "", k.tagline || "", k.color || "#EEE", JSON.stringify(k.routine || { morning: [], evening: [], weekly: [] }), k.tiktok || "", k.active === false ? 0 : 1);
    else db.prepare("UPDATE kits SET name=?, for_label=?, tagline=?, color=?, routine=?, tiktok=?, active=? WHERE id=?")
      .run(k.name, k.for || "", k.tagline || "", k.color || "#EEE", JSON.stringify(k.routine || {}), k.tiktok || "", k.active === false ? 0 : 1, id);
    db.prepare("DELETE FROM kit_items WHERE kit_id=?").run(id);
    const ins = db.prepare("INSERT INTO kit_items (kit_id,tier,product_id,position) VALUES (?,?,?,?)");
    for (const t of Engine.TIERS) tiers[t].forEach((pid, i) => ins.run(id, t, pid, i));
    db.exec("COMMIT"); res.json({ ok: true });
  } catch (e) { db.exec("ROLLBACK"); bad(res, "تعذر حفظ الروتين: " + e.message); }
}
app.get("/api/admin/orders", requireAdmin, (req, res) =>
  res.json(db.prepare("SELECT o.*, u.name customer, u.email FROM orders o JOIN users u ON u.id=o.user_id ORDER BY o.id DESC").all().map(orderWithItems)));
app.post("/api/admin/orders/:id/status", requireAdmin, (req, res) => {
  const { status, note } = req.body || {};
  if (![...ORDER_FLOW, "cancelled"].includes(status)) return bad(res, "حالة غير صحيحة");
  const o = db.prepare("SELECT * FROM orders WHERE id=?").get(req.params.id);
  if (!o) return bad(res, "الطلب غير موجود", 404);
  db.prepare("UPDATE orders SET status=? WHERE id=?").run(status, o.id);
  addEvent(o.id, status, note || (status === "shipped" ? "تم تسليم الطلب لشركة الشحن — رقم التتبع SMSA-" + (100000 + o.id) : undefined));
  res.json(orderWithItems(db.prepare("SELECT * FROM orders WHERE id=?").get(o.id)));
});
app.get("/api/admin/customers", requireAdmin, (req, res) =>
  res.json(db.prepare(`SELECT u.id,u.name,u.email,u.phone,u.city,u.created_at,
    (SELECT COUNT(*) FROM orders o WHERE o.user_id=u.id) orders,
    (SELECT COALESCE(SUM(total),0) FROM orders o WHERE o.user_id=u.id AND o.status!='cancelled') spent,
    (SELECT COUNT(*) FROM subscriptions s WHERE s.user_id=u.id AND s.status='active') subs
    FROM users u WHERE role='customer' ORDER BY u.id DESC`).all()));
app.get("/api/admin/subscriptions", requireAdmin, (req, res) =>
  res.json(db.prepare("SELECT s.*, u.name customer, k.name kit_name FROM subscriptions s JOIN users u ON u.id=s.user_id JOIN kits k ON k.id=s.kit_id ORDER BY s.id DESC").all().map(subRow)));
app.post("/api/admin/renewals", requireAdmin, (req, res) => res.json({ created: runRenewals(!!(req.body && req.body.force)) }));

/* تجديد تلقائي يومي أثناء تشغيل الخادم */
setInterval(() => { try { runRenewals(false); } catch (e) { console.error(e); } }, 1000 * 60 * 60 * 6).unref();

const PORT = process.env.PORT || 3000;
if (require.main === module) app.listen(PORT, () => console.log(`رينورا تعمل على http://localhost:${PORT}`));
module.exports = app;
