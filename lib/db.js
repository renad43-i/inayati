/* =========================================================
   عنايتي — قاعدة البيانات (SQLite)
   ========================================================= */
const path = require("path");
const fs = require("fs");
const { DatabaseSync } = require("node:sqlite");
const bcrypt = require("bcryptjs");
const seed = require("../public/js/data.js");

const DB_PATH = process.env.DB_PATH || path.join(__dirname, "..", "data", "inayati.db");
fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
const db = new DatabaseSync(DB_PATH);
db.exec("PRAGMA foreign_keys = ON; PRAGMA journal_mode = WAL;");

/* ترقية: قاعدة بيانات من النسخة القديمة (منتجات بدون براند) تُعاد من الصفر */
const oldCols = db.prepare("PRAGMA table_info(products)").all().map(c => c.name);
if (oldCols.length && !oldCols.includes("brand")) {
  console.log("تحديث قاعدة البيانات للكتالوج الجديد (البراندات العالمية)…");
  db.exec("PRAGMA foreign_keys = OFF");
  for (const t of ["order_events", "order_items", "orders", "subscriptions", "quiz_results", "kit_items", "kits", "products", "users"]) db.exec(`DROP TABLE IF EXISTS ${t}`);
  db.exec("PRAGMA foreign_keys = ON");
}

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  city TEXT,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer','admin')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  cat TEXT NOT NULL CHECK (cat IN ('skin','hair')),
  step TEXT NOT NULL,
  brand TEXT NOT NULL DEFAULT '',
  country TEXT,
  name TEXT NOT NULL,
  name_en TEXT,
  size TEXT,
  price REAL NOT NULL CHECK (price >= 0),
  description TEXT,
  suits TEXT NOT NULL DEFAULT '[]',      -- JSON: أنواع البشرة/الشعر المناسبة
  contains TEXT NOT NULL DEFAULT '[]',   -- JSON: مسببات الحساسية
  pack TEXT NOT NULL DEFAULT '{}',       -- JSON: شكل العبوة وألوانها (لرسم الصورة)
  tags TEXT NOT NULL DEFAULT '{}',       -- JSON: {fungal: true|false|null, goodFor: [...]} — مناسب لـ
  tiktok TEXT,                           -- رابط ريفيوهات تيك توك
  stock INTEGER NOT NULL DEFAULT 100,
  active INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS kits (
  id TEXT PRIMARY KEY,
  cat TEXT NOT NULL CHECK (cat IN ('skin','hair')),
  name TEXT NOT NULL,
  for_label TEXT,
  tagline TEXT,
  color TEXT,
  routine TEXT NOT NULL DEFAULT '{}',    -- JSON: صباح/مساء/أسبوعي
  tiktok TEXT,
  active INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS kit_items (
  kit_id TEXT NOT NULL REFERENCES kits(id) ON DELETE CASCADE,
  tier TEXT NOT NULL CHECK (tier IN ('basic','full','plus')),
  product_id TEXT NOT NULL REFERENCES products(id),
  position INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (kit_id, tier, product_id)
);
CREATE TABLE IF NOT EXISTS quiz_results (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  answers TEXT NOT NULL,
  result TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS subscriptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  kit_id TEXT NOT NULL REFERENCES kits(id),
  tier TEXT NOT NULL,
  product_ids TEXT NOT NULL,
  price REAL NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','paused','cancelled')),
  next_renewal TEXT NOT NULL,
  address TEXT,
  origin_order_id INTEGER,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'paid',
  subtotal REAL NOT NULL,
  shipping REAL NOT NULL,
  total REAL NOT NULL,
  payment_method TEXT NOT NULL,
  payment_ref TEXT,
  address TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'checkout' CHECK (source IN ('checkout','renewal')),
  subscription_id INTEGER REFERENCES subscriptions(id),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  kit_id TEXT NOT NULL REFERENCES kits(id),
  kit_name TEXT NOT NULL,
  tier TEXT NOT NULL,
  product_ids TEXT NOT NULL,
  purchase_type TEXT NOT NULL CHECK (purchase_type IN ('once','subscription')),
  qty INTEGER NOT NULL CHECK (qty > 0),
  unit_price REAL NOT NULL
);
CREATE TABLE IF NOT EXISTS consultations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  doctor_id TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('chat','video')),
  date TEXT,                              -- للفيديو: YYYY-MM-DD
  time TEXT,                              -- للفيديو: HH:MM
  concern TEXT NOT NULL,
  notes TEXT,
  analysis TEXT,                          -- JSON: نتيجة تحليل AI إذا أرفقتها العميلة
  price REAL NOT NULL,
  payment_ref TEXT,
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed','completed','cancelled')),
  doctor_note TEXT,
  recommended_kit TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE UNIQUE INDEX IF NOT EXISTS consult_slot ON consultations(doctor_id, date, time) WHERE type = 'video' AND status != 'cancelled';
CREATE TABLE IF NOT EXISTS order_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  note TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
`);

/* ---------- البيانات الأولية ---------- */
function seedIfEmpty() {
  const count = db.prepare("SELECT COUNT(*) AS n FROM products").get().n;
  if (count > 0) return;
  const insP = db.prepare(`INSERT INTO products (id,cat,step,brand,country,name,name_en,size,price,description,suits,contains,pack,tiktok,tags) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`);
  const insK = db.prepare(`INSERT INTO kits (id,cat,name,for_label,tagline,color,routine,tiktok) VALUES (?,?,?,?,?,?,?,?)`);
  const insI = db.prepare(`INSERT INTO kit_items (kit_id,tier,product_id,position) VALUES (?,?,?,?)`);
  db.exec("BEGIN");
  for (const p of seed.PRODUCTS) insP.run(p.id, p.cat, p.step, p.brand, p.country, p.name, p.nameEn, p.size, p.price, p.desc, JSON.stringify(p.suits), JSON.stringify(p.contains), JSON.stringify(p.pack || {}), p.tiktok, JSON.stringify({ fungal: p.fungal ?? null, goodFor: p.goodFor || [] }));
  for (const k of seed.KITS) {
    insK.run(k.id, k.cat, k.name, k.for, k.tagline, k.color, JSON.stringify(k.routine), k.tiktok);
    for (const [tier, ids] of Object.entries(k.tiers)) ids.forEach((pid, i) => insI.run(k.id, tier, pid, i));
  }
  db.exec("COMMIT");
}
function seedAdmin() {
  const email = process.env.ADMIN_EMAIL || "admin@inayati.sa";
  if (db.prepare("SELECT id FROM users WHERE email = ?").get(email)) return;
  const pass = process.env.ADMIN_PASSWORD || "Admin@123";
  db.prepare("INSERT INTO users (name,email,password_hash,role) VALUES (?,?,?,'admin')")
    .run("إدارة عنايتي", email, bcrypt.hashSync(pass, 10));
}
seedIfEmpty();

/* ترقية: إضافة عمود "مناسب لـ" لقاعدة بيانات موجودة وتعبئته من المحتوى */
if (!db.prepare("PRAGMA table_info(products)").all().some(c => c.name === "tags")) {
  db.exec("ALTER TABLE products ADD COLUMN tags TEXT NOT NULL DEFAULT '{}'");
}
{
  const upd = db.prepare("UPDATE products SET tags = ? WHERE id = ? AND tags = '{}'");
  for (const p of seed.PRODUCTS) upd.run(JSON.stringify({ fungal: p.fungal ?? null, goodFor: p.goodFor || [] }), p.id);
}
seedAdmin();

/* ---------- قراءة الكتالوج ---------- */
function rowToProduct(r) {
  return { id: r.id, cat: r.cat, step: r.step, brand: r.brand, country: r.country, name: r.name, nameEn: r.name_en, size: r.size, price: r.price, desc: r.description,
    suits: JSON.parse(r.suits), contains: JSON.parse(r.contains), pack: JSON.parse(r.pack || "{}"), tiktok: r.tiktok, stock: r.stock, active: !!r.active,
    ...(() => { const t = JSON.parse(r.tags || "{}"); return { fungal: r.cat === "skin" ? (t.fungal ?? null) : null, goodFor: t.goodFor || [] }; })() };
}
function getCatalog({ includeInactive = false } = {}) {
  const products = db.prepare(`SELECT * FROM products ${includeInactive ? "" : "WHERE active = 1"} ORDER BY id`).all().map(rowToProduct);
  const items = db.prepare("SELECT * FROM kit_items ORDER BY kit_id, tier, position").all();
  const kits = db.prepare(`SELECT * FROM kits ${includeInactive ? "" : "WHERE active = 1"} ORDER BY rowid`).all().map(k => {
    const tiers = { basic: [], full: [], plus: [] };
    items.filter(i => i.kit_id === k.id).forEach(i => tiers[i.tier].push(i.product_id));
    return { id: k.id, cat: k.cat, name: k.name, for: k.for_label, tagline: k.tagline, color: k.color,
      routine: JSON.parse(k.routine), tiktok: k.tiktok, active: !!k.active, tiers };
  });
  return { products, kits };
}

module.exports = { db, getCatalog, rowToProduct };
