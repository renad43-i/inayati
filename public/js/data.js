/* =========================================================
   رينورا — بيانات المحتوى (ريناد)
   هذا الملف هو "مصدر الحقيقة" للمحتوى في مرحلة الواجهات.
   ريفال: كل مصفوفة هنا تقابل جدولاً في قاعدة البيانات
   (products, kits, kit_items, kit_steps, skin_types, hair_types).
   ========================================================= */

const BRAND = {
  name: "رينورا",
  nameEn: "Renaura",
  slogan: "روتينك، مصمَّم لكِ",
  tiktok: "https://www.tiktok.com/@renaura.sa", // حساب المتجر (فيديوهات الروتين)
  currency: "ر.س",
  freeShippingFrom: 200,
  shippingFee: 25,
  kitDiscount: 0.15,          // خصم الروتين مقارنة بشراء المنتجات منفردة (يُطبَّق في engine.js)
  subscriptionDiscount: 0.10  // خصم إضافي للاشتراك الشهري (يُطبَّق في engine.js)
};

/* ---------- أنواع البشرة ---------- */
const SKIN_TYPES = {
  dry:       { name: "جافة",   desc: "تشعرين بشد بعد الغسيل، وقد تظهر قشور أو خشونة.", needs: "ترطيب عميق وحماية حاجز البشرة بالسيراميد والهيالورونيك." },
  oily:      { name: "دهنية",  desc: "لمعان على كامل الوجه ومسام واضحة خلال ساعات.", needs: "تنظيف منظم للدهون، ترطيب خفيف خالٍ من الزيوت، والنياسيناميد." },
  combo:     { name: "مختلطة", desc: "لمعان في منطقة T (الجبهة والأنف) وجفاف في الخدين.", needs: "توازن: ترطيب للخدين وتنظيم للدهون في منطقة T." },
  normal:    { name: "عادية",  desc: "متوازنة ومريحة معظم الوقت دون مشاكل واضحة.", needs: "روتين أساسي للمحافظة: تنظيف، ترطيب، وحماية من الشمس." },
  sensitive: { name: "حساسة",  desc: "تحمر وتتهيج بسهولة من المنتجات أو الجو.", needs: "مكونات قليلة ومهدئة (سنتيلا)، بدون عطور، وواقي شمس معدني." }
};

/* ---------- مشاكل البشرة ---------- */
const SKIN_CONCERNS = {
  acne:     { name: "حبوب ورؤوس سوداء", solution: "حمض الساليسيليك + النياسيناميد + علاج موضعي." },
  pigment:  { name: "تصبغات وبهتان",    solution: "فيتامين C صباحاً + تقشير لطيف AHA + واقي شمس يومي." },
  dryness:  { name: "جفاف وخشونة",      solution: "هيالورونيك + سيراميد + تقليل الغسولات القوية." },
  pores:    { name: "مسام واسعة ولمعان", solution: "نياسيناميد 10% + جل مرطب خفيف." },
  hormonal: { name: "حبوب هرمونية", solution: "حبوب عميقة حول الذقن والفك وتزيد مع الدورة: روتين صفاء كعناية مساندة + استشارة طبيبة للعلاج الأساسي." },
  fungal:   { name: "حبوب فطرية", solution: "حبوب صغيرة متشابهة تحك (غالباً على الجبهة): منتجات خالية من الزيوت والاسترات اللي تغذي الفطريات + استشارة طبيبة." },
  none:     { name: "لا شيء محدد",       solution: "روتين أساسي متوازن." }
};

/* ---------- أنواع الشعر ---------- */
const HAIR_TYPES = {
  dry:     { name: "جاف وخشن",            needs: "ترطيب مكثف وزيوت للأطراف." },
  oily:    { name: "دهني من الجذور",      needs: "تنظيف لطيف لفروة الرأس وبلسم على الأطراف فقط." },
  curly:   { name: "مجعد / كيرلي",        needs: "ترطيب ومنتج تعريف للتموجات بدون كبريتات." },
  damaged: { name: "مصبوغ أو تالف بالحرارة", needs: "إصلاح بالكيراتين وحماية من الحرارة." },
  normal:  { name: "عادي",                needs: "روتين أساسي للنظافة واللمعان." }
};

/* ---------- مسببات الحساسية (لفلترة المنتجات) ---------- */
const ALLERGENS = {
  fragrance: "العطور",
  alcohol:   "الكحول",
  nuts:      "زيوت المكسرات"
};

/* ---------- المنتجات ----------
   منتجات حقيقية من علامات عالمية (كورية، فرنسية، يابانية، أمريكية…) مثل ما تبيعه سيفورا.
   step: خطوة الروتين (تُستخدم في استبدال المنتج عند وجود حساسية)
   contains: مسببات الحساسية في المنتج — معلومات تقريبية للعرض، والمرجع هو قائمة المكونات على العبوة
   suits: أنواع البشرة/الشعر المناسبة
   pack: شكل العبوة وألوانها لرسم صورة المنتج
   price: سعر تقريبي بالريال لأغراض المشروع */
const PRODUCTS = [
  // ===== البشرة: الغسول =====
  { id: "s01", cat: "skin", step: "cleanser", brand: "CeraVe", country: "🇺🇸 أمريكا", nameEn: "Hydrating Facial Cleanser", name: "غسول سيرافي المرطب", size: "236 مل", price: 65,
    suits: ["dry","sensitive","normal"], contains: [], desc: "غسول كريمي بالسيراميد وحمض الهيالورونيك، ينظف بدون ما يشد البشرة.",
    pack: { shape: "pump", body: "#FFFFFF", cap: "#FFFFFF", accent: "#1F5DA8" } },
  { id: "s03", cat: "skin", step: "cleanser", brand: "ROUND LAB", country: "🇰🇷 كوريا", nameEn: "1025 Dokdo Cleanser", name: "غسول راوند لاب دوكدو", size: "150 مل", price: 65,
    suits: ["combo","normal","oily"], contains: [], desc: "غسول رغوي لطيف بمياه البحر العميقة، ينظف الزيوت ويحافظ على رطوبة البشرة.",
    pack: { shape: "tube", body: "#F4F8FB", cap: "#FFFFFF", accent: "#2E6FB7" } },
  { id: "s04", cat: "skin", step: "cleanser", brand: "COSRX", country: "🇰🇷 كوريا", nameEn: "Low pH Good Morning Gel Cleanser", name: "جل كوسركس الصباحي", size: "150 مل", price: 55,
    suits: ["oily","combo","normal"], contains: [], desc: "جل منظف بحموضة منخفضة مع BHA وزيت شجرة الشاي، مناسب للبشرة الدهنية والمعرضة للحبوب.",
    pack: { shape: "tube", body: "#FFFFFF", cap: "#FFFFFF", accent: "#3BA88F" } },
  { id: "s27", cat: "skin", step: "cleanser", brand: "BIODERMA", country: "🇫🇷 فرنسا", nameEn: "Sensibio H2O Micellar Water", name: "ماء ميسيلار بيوديرما سينسيبيو", size: "250 مل", price: 69,
    suits: ["sensitive","dry","normal","combo"], contains: [], desc: "ماء ميسيلار شهير ينظف ويزيل المكياج بدون فرك، مصمم للبشرة الحساسة.",
    pack: { shape: "bottle", body: "#EEF6FA", cap: "#E86A8C", accent: "#E86A8C", clear: true } },

  // ===== البشرة: التونر =====
  { id: "s05", cat: "skin", step: "toner", brand: "ANUA", country: "🇰🇷 كوريا", nameEn: "Heartleaf 77% Soothing Toner", name: "تونر أنوا هارتليف المهدئ", size: "250 مل", price: 99,
    suits: ["sensitive","oily","combo","normal"], contains: [], desc: "تونر بخلاصة الهارتليف 77% يهدئ الاحمرار ويوازن البشرة، من أشهر منتجات تيك توك.",
    pack: { shape: "bottle", body: "#EAF3E6", cap: "#FFFFFF", accent: "#5E8F5A", clear: true } },
  { id: "s06", cat: "skin", step: "toner", brand: "HADA LABO", country: "🇯🇵 اليابان", nameEn: "Gokujyun Premium Lotion", name: "لوشن هادا لابو غوكوجيون", size: "170 مل", price: 75,
    suits: ["dry","normal","sensitive"], contains: [], desc: "لوشن ياباني بسبعة أنواع من حمض الهيالورونيك، ترطيب عميق بدون عطور.",
    pack: { shape: "bottle", body: "#FFFFFF", cap: "#E9EEF5", accent: "#1C3F94" } },
  { id: "s07", cat: "skin", step: "toner", brand: "SOME BY MI", country: "🇰🇷 كوريا", nameEn: "AHA BHA PHA 30 Days Miracle Toner", name: "تونر سم باي مي ميراكل", size: "150 مل", price: 75,
    suits: ["oily","combo"], contains: [], desc: "تونر بالأحماض الثلاثة وشجرة الشاي، يقلل الحبوب والرؤوس السوداء خلال 30 يوم.",
    pack: { shape: "bottle", body: "#E3F1E4", cap: "#7DBE8A", accent: "#2F7A45", clear: true } },

  // ===== البشرة: السيروم =====
  { id: "s09", cat: "skin", step: "serum", brand: "COSRX", country: "🇰🇷 كوريا", nameEn: "Advanced Snail 96 Mucin Power Essence", name: "إسنس كوسركس بالحلزون 96", size: "100 مل", price: 89,
    suits: ["dry","normal","combo","sensitive"], contains: [], desc: "إسنس بخلاصة الحلزون 96% يرطب ويرمم البشرة ويعطيها نضارة، الأشهر عالمياً.",
    pack: { shape: "pump", body: "#F3E6CF", cap: "#FFFFFF", accent: "#222222", clear: true } },
  { id: "s10", cat: "skin", step: "serum", brand: "THE ORDINARY", country: "🇨🇦 كندا", nameEn: "Niacinamide 10% + Zinc 1%", name: "سيروم ذا أوردينري نياسيناميد", size: "30 مل", price: 45,
    suits: ["oily","combo"], contains: [], desc: "سيروم النياسيناميد والزنك ينظم الدهون ويقلل مظهر المسام والحبوب.",
    pack: { shape: "dropper", body: "#E9ECEE", cap: "#111111", accent: "#111111", frosted: true } },
  { id: "s11", cat: "skin", step: "serum", brand: "THE ORDINARY", country: "🇨🇦 كندا", nameEn: "Hyaluronic Acid 2% + B5", name: "سيروم ذا أوردينري هيالورونيك", size: "30 مل", price: 45,
    suits: ["dry","normal","combo","sensitive"], contains: [], desc: "سيروم ترطيب بحمض الهيالورونيك وفيتامين B5 يمنح البشرة امتلاء ونعومة.",
    pack: { shape: "dropper", body: "#E9ECEE", cap: "#111111", accent: "#111111", frosted: true } },
  { id: "s12", cat: "skin", step: "serum", brand: "MELANO CC", country: "🇯🇵 اليابان", nameEn: "Intensive Anti-Spot Essence", name: "إسنس ميلانو سي سي المركّز للبقع", size: "20 مل", price: 65,
    suits: ["normal","combo","oily","dry"], contains: ["alcohol"], desc: "إسنس ياباني بفيتامين C النقي لتفتيح التصبغات وآثار الحبوب.",
    pack: { shape: "slim", body: "#FFFFFF", cap: "#F2A33A", accent: "#E8742B" } },
  { id: "s13", cat: "skin", step: "serum", brand: "SKIN1004", country: "🇰🇷 كوريا", nameEn: "Madagascar Centella Ampoule", name: "أمبول سكن1004 سنتيلا", size: "55 مل", price: 79,
    suits: ["sensitive","dry","normal","oily","combo"], contains: [], desc: "أمبول بخلاصة السنتيلا 100% يهدئ الاحمرار ويقوي حاجز البشرة الحساسة.",
    pack: { shape: "dropper", body: "#F5EFE3", cap: "#FFFFFF", accent: "#8B6B3E", clear: true } },
  { id: "s14", cat: "skin", step: "serum", brand: "KLAIRS", country: "🇰🇷 كوريا", nameEn: "Freshly Juiced Vitamin Drop", name: "قطرات كليرز بفيتامين C", size: "35 مل", price: 89,
    suits: ["normal","dry","sensitive","combo"], contains: [], desc: "سيروم فيتامين C لطيف 5% للبشرة الحساسة، يوحد اللون ويمنح إشراقة.",
    pack: { shape: "dropper", body: "#F2B33D", cap: "#FFFFFF", accent: "#B26B00", clear: true } },

  // ===== البشرة: المرطب =====
  { id: "s15", cat: "skin", step: "moisturizer", brand: "CeraVe", country: "🇺🇸 أمريكا", nameEn: "Moisturizing Cream", name: "كريم سيرافي المرطب", size: "340 غ", price: 89,
    suits: ["dry","sensitive","normal"], contains: [], desc: "كريم غني بثلاثة أنواع من السيراميد يرمم حاجز البشرة ويرطب 24 ساعة.",
    pack: { shape: "tub", body: "#FFFFFF", cap: "#FFFFFF", accent: "#1F5DA8" } },
  { id: "s16", cat: "skin", step: "moisturizer", brand: "LA ROCHE-POSAY", country: "🇫🇷 فرنسا", nameEn: "Toleriane Double Repair Moisturizer", name: "مرطب لاروش بوزيه توليريان", size: "75 مل", price: 95,
    suits: ["sensitive","normal","combo","dry"], contains: [], desc: "مرطب بالسيراميد والنياسيناميد وماء لاروش بوزيه الحراري، خفيف ومناسب للحساسة.",
    pack: { shape: "tube", body: "#FFFFFF", cap: "#FFFFFF", accent: "#2B6CB0" } },
  { id: "s17", cat: "skin", step: "moisturizer", brand: "NEUTROGENA", country: "🇺🇸 أمريكا", nameEn: "Hydro Boost Water Gel", name: "جل نيوتروجينا هايدرو بوست", size: "50 مل", price: 69,
    suits: ["oily","combo","normal"], contains: ["fragrance"], desc: "جل مائي بالهيالورونيك يرطب بسرعة ولا يسد المسام.",
    pack: { shape: "jar", body: "#3D7FD1", cap: "#2A64B0", accent: "#FFFFFF" } },
  { id: "s18", cat: "skin", step: "moisturizer", brand: "COSRX", country: "🇰🇷 كوريا", nameEn: "Oil-Free Ultra-Moisturizing Lotion", name: "لوشن كوسركس الخالي من الزيوت", size: "100 مل", price: 75,
    suits: ["oily","combo","normal"], contains: [], desc: "لوشن خفيف بعصارة البتولا، ترطيب بدون لمعان للبشرة الدهنية.",
    pack: { shape: "pump", body: "#FFFFFF", cap: "#FFFFFF", accent: "#222222" } },

  // ===== البشرة: واقي الشمس =====
  { id: "s20", cat: "skin", step: "spf", brand: "BEAUTY OF JOSEON", country: "🇰🇷 كوريا", nameEn: "Relief Sun: Rice + Probiotics SPF50+", name: "واقي بيوتي أوف جوسون ريليف صن", size: "50 مل", price: 79,
    suits: ["dry","normal","combo","oily","sensitive"], contains: [], desc: "واقي شمس كوري خفيف بخلاصة الأرز، بدون أثر أبيض، الأشهر على تيك توك.",
    pack: { shape: "tube", body: "#FBF6EC", cap: "#FBF6EC", accent: "#4F7A4C" } },
  { id: "s21", cat: "skin", step: "spf", brand: "BIORÉ", country: "🇯🇵 اليابان", nameEn: "UV Aqua Rich Watery Essence SPF50+", name: "واقي بيوريه يو في أكوا ريتش", size: "50 غ", price: 59,
    suits: ["oily","combo","normal"], contains: ["alcohol"], desc: "واقي ياباني مائي القوام يمتص فوراً، مثالي للبشرة الدهنية والجو الحار.",
    pack: { shape: "tube", body: "#2F86DE", cap: "#1F6BC0", accent: "#FFFFFF" } },
  { id: "s22", cat: "skin", step: "spf", brand: "ANESSA", country: "🇯🇵 اليابان", nameEn: "Perfect UV Sunscreen Milk SPF50+", name: "واقي أنيسا بيرفكت يو في", size: "60 مل", price: 139,
    suits: ["oily","combo","normal"], contains: ["alcohol"], desc: "واقي ياباني مقاوم للماء والعرق من شيسيدو، حماية قوية للأيام الطويلة.",
    pack: { shape: "slim", body: "#C9A24B", cap: "#B08A36", accent: "#FFFFFF" } },

  // ===== البشرة: علاج ومقشر =====
  { id: "s23", cat: "skin", step: "treatment", brand: "LA ROCHE-POSAY", country: "🇫🇷 فرنسا", nameEn: "Effaclar Duo+", name: "كريم لاروش بوزيه إيفاكلار دوو+", size: "40 مل", price: 95,
    suits: ["oily","combo"], contains: [], desc: "كريم علاجي للحبوب والآثار، يقلل الالتهاب ويمنع ظهور حبوب جديدة.",
    pack: { shape: "tube", body: "#FFFFFF", cap: "#FFFFFF", accent: "#1D6FB8" } },
  { id: "s24", cat: "skin", step: "treatment", brand: "MARIO BADESCU", country: "🇺🇸 أمريكا", nameEn: "Drying Lotion", name: "لوشن ماريو باديسكو المجفف", size: "29 مل", price: 85,
    suits: ["oily","combo","normal"], contains: ["alcohol"], desc: "علاج ليلي موضعي بالكبريت وحمض الساليسيليك، يجفف الحبة خلال ليلة.",
    pack: { shape: "bottle", body: "#F3E9E6", cap: "#FFFFFF", accent: "#C96E83", clear: true, sediment: "#E8A5B4" } },
  { id: "s25", cat: "skin", step: "treatment", brand: "COSRX", country: "🇰🇷 كوريا", nameEn: "Acne Pimple Master Patch", name: "لصقات كوسركس للحبوب", size: "24 لصقة", price: 29,
    suits: ["oily","combo","normal","dry","sensitive"], contains: [], desc: "لصقات هيدروكولويد تمتص الحبة وتحميها من اللمس، بدون أي مكونات مهيجة.",
    pack: { shape: "box", body: "#FFFFFF", cap: "#FFFFFF", accent: "#3A8DCC" } },
  { id: "s08", cat: "skin", step: "exfoliant", brand: "THE ORDINARY", country: "🇨🇦 كندا", nameEn: "Glycolic Acid 7% Toning Solution", name: "تونر ذا أوردينري جلايكوليك 7%", size: "240 مل", price: 59,
    suits: ["normal","combo","oily","dry"], contains: [], desc: "مقشر لطيف بحمض الجلايكوليك يوحد لون البشرة ويخفف التصبغات (مساءً، 2–3 مرات أسبوعياً).",
    pack: { shape: "bottle", body: "#F1F3F4", cap: "#FFFFFF", accent: "#111111", clear: true } },
  { id: "s26", cat: "skin", step: "exfoliant", brand: "PAULA'S CHOICE", country: "🇺🇸 أمريكا", nameEn: "Skin Perfecting 2% BHA Liquid Exfoliant", name: "مقشر بولاز تشويس 2% BHA", size: "118 مل", price: 175,
    suits: ["oily","combo","normal"], contains: [], desc: "مقشر سائل أيقوني بحمض الساليسيليك ينظف المسام من الداخل ويقلل الرؤوس السوداء.",
    pack: { shape: "bottle", body: "#FFFFFF", cap: "#3C9DBB", accent: "#3C9DBB" } },
  { id: "s19", cat: "skin", step: "mask", brand: "LANEIGE", country: "🇰🇷 كوريا", nameEn: "Water Sleeping Mask", name: "ماسك لانيج النومي المائي", size: "70 مل", price: 115,
    suits: ["dry","normal","combo"], contains: ["fragrance"], desc: "ماسك ليلي جل يرطب البشرة أثناء النوم وتصحين ببشرة ممتلئة ونضرة.",
    pack: { shape: "jar", body: "#8EBEE8", cap: "#6FA6DA", accent: "#FFFFFF" } },

  // ===== الشعر =====
  { id: "h01", cat: "hair", step: "shampoo", brand: "TSUBAKI", country: "🇯🇵 اليابان", nameEn: "Premium Moist Shampoo", name: "شامبو تسوباكي بريميوم مويست", size: "490 مل", price: 69,
    suits: ["dry","damaged","normal","curly"], contains: ["fragrance"], desc: "شامبو ياباني من شيسيدو بزيت الكاميليا، ينعم الشعر الجاف ويعطيه لمعة.",
    pack: { shape: "pump", body: "#C8283A", cap: "#B7202F", accent: "#E8C77A" } },
  { id: "h02", cat: "hair", step: "shampoo", brand: "BRIOGEO", country: "🇺🇸 أمريكا", nameEn: "Scalp Revival Charcoal Shampoo", name: "شامبو بريوجيو بالفحم للفروة", size: "236 مل", price: 149,
    suits: ["oily","normal"], contains: [], desc: "شامبو بالفحم والبيوتين ينظف الفروة الدهنية بعمق ويزيل التراكمات.",
    pack: { shape: "bottle", body: "#1E1E1E", cap: "#1E1E1E", accent: "#FFFFFF" } },
  { id: "h03", cat: "hair", step: "shampoo", brand: "VANICREAM", country: "🇺🇸 أمريكا", nameEn: "Free & Clear Shampoo", name: "شامبو فانيكريم الخالي", size: "355 مل", price: 69,
    suits: ["dry","oily","curly","damaged","normal"], contains: [], desc: "شامبو بدون عطور ولا صبغات ولا كبريتات، مناسب للفروة الحساسة.",
    pack: { shape: "bottle", body: "#FFFFFF", cap: "#FFFFFF", accent: "#1A4E9A" } },
  { id: "h04", cat: "hair", step: "shampoo", brand: "SHEAMOISTURE", country: "🇺🇸 أمريكا", nameEn: "Coconut & Hibiscus Curl & Shine Shampoo", name: "شامبو شيا مويستشر للكيرلي", size: "384 مل", price: 59,
    suits: ["curly","dry"], contains: ["fragrance"], desc: "شامبو بزبدة الشيا وجوز الهند يرطب التموجات ويقلل الهيشان.",
    pack: { shape: "bottle", body: "#6B3A2A", cap: "#F2E6D0", accent: "#F2E6D0" } },
  { id: "h05", cat: "hair", step: "conditioner", brand: "TSUBAKI", country: "🇯🇵 اليابان", nameEn: "Premium Moist Conditioner", name: "بلسم تسوباكي بريميوم مويست", size: "490 مل", price: 69,
    suits: ["dry","damaged","normal","curly","oily"], contains: ["fragrance"], desc: "بلسم ياباني يغلف الشعرة ويسهل التسريح ويقلل التقصف.",
    pack: { shape: "pump", body: "#C8283A", cap: "#B7202F", accent: "#E8C77A" } },
  { id: "h06", cat: "hair", step: "conditioner", brand: "VANICREAM", country: "🇺🇸 أمريكا", nameEn: "Free & Clear Conditioner", name: "بلسم فانيكريم الخالي", size: "355 مل", price: 69,
    suits: ["dry","oily","curly","damaged","normal"], contains: [], desc: "بلسم خفيف بدون عطور، يرطب الأطراف بدون ما يثقل الجذور.",
    pack: { shape: "bottle", body: "#FFFFFF", cap: "#FFFFFF", accent: "#1A4E9A" } },
  { id: "h07", cat: "hair", step: "mask", brand: "FINO", country: "🇯🇵 اليابان", nameEn: "Premium Touch Hair Mask", name: "ماسك فينو بريميوم تاتش", size: "230 غ", price: 59,
    suits: ["damaged","dry","curly","normal"], contains: ["fragrance"], desc: "ماسك ياباني من شيسيدو ترند تيك توك، يصلح الشعر التالف من أول استخدام.",
    pack: { shape: "jar", body: "#D9A7A0", cap: "#C79089", accent: "#FFFFFF" } },
  { id: "h08", cat: "hair", step: "mask", brand: "OLAPLEX", country: "🇺🇸 أمريكا", nameEn: "No.3 Hair Perfector", name: "أولابلكس رقم 3", size: "100 مل", price: 129,
    suits: ["damaged","dry","curly"], contains: ["fragrance"], desc: "علاج قبل الشامبو يعيد بناء روابط الشعرة المتضررة من الصبغة والحرارة.",
    pack: { shape: "bottle", body: "#FFFFFF", cap: "#111111", accent: "#111111" } },
  { id: "h09", cat: "hair", step: "oil", brand: "MISE EN SCÈNE", country: "🇰🇷 كوريا", nameEn: "Perfect Serum Original", name: "سيروم ميزنسين بيرفكت", size: "80 مل", price: 49,
    suits: ["dry","damaged","curly","normal"], contains: ["fragrance","nuts"], desc: "سيروم كوري بسبعة زيوت منها الأرغان، يعطي لمعة ونعومة فورية.",
    pack: { shape: "pump", body: "#D8A445", cap: "#B88A2E", accent: "#FFFFFF", clear: true } },
  { id: "h13", cat: "hair", step: "oil", brand: "THE ORDINARY", country: "🇨🇦 كندا", nameEn: "100% Plant-Derived Squalane", name: "سكوالين ذا أوردينري النباتي", size: "30 مل", price: 39,
    suits: ["dry","damaged","curly","normal"], contains: [], desc: "زيت خفيف بدون عطر ولا زيوت مكسرات، قطرتين على الأطراف بعد التجفيف.",
    pack: { shape: "dropper", body: "#F1F3F4", cap: "#FFFFFF", accent: "#111111", clear: true } },
  { id: "h14", cat: "hair", step: "oil", brand: "KÉRASTASE", country: "🇫🇷 فرنسا", nameEn: "Elixir Ultime L'Huile Originale", name: "زيت كيراستاس إليكسير ألتيم", size: "100 مل", price: 199,
    suits: ["dry","damaged","curly","normal"], contains: ["fragrance","nuts"], desc: "زيت فاخر بالأرغان والكاميليا، يغذي الشعر ويحميه من الحرارة.",
    pack: { shape: "pump", body: "#C9963A", cap: "#2B2B2B", accent: "#FFFFFF", clear: true } },
  { id: "h10", cat: "hair", step: "scalp", brand: "MIELLE", country: "🇺🇸 أمريكا", nameEn: "Rosemary Mint Scalp & Hair Strengthening Oil", name: "زيت ميلي بالروزماري والنعناع", size: "59 مل", price: 59,
    suits: ["oily","normal","dry","curly"], contains: [], desc: "زيت فروة بالروزماري ترند تيك توك، يدعم كثافة الشعر ويقلل التساقط.",
    pack: { shape: "slim", body: "#E7F0E2", cap: "#1F4D2B", accent: "#1F4D2B", clear: true } },
  { id: "h11", cat: "hair", step: "styler", brand: "SHEAMOISTURE", country: "🇺🇸 أمريكا", nameEn: "Coconut & Hibiscus Curl Enhancing Smoothie", name: "كريم شيا مويستشر لتعريف الكيرلي", size: "340 غ", price: 69,
    suits: ["curly"], contains: ["fragrance"], desc: "كريم تعريف للتموجات بزبدة الشيا، يقلل الهيشان ويثبت الكيرلي.",
    pack: { shape: "tub", body: "#6B3A2A", cap: "#F2E6D0", accent: "#F2E6D0" } },
  { id: "h12", cat: "hair", step: "protect", brand: "TRESEMMÉ", country: "🇺🇸 أمريكا", nameEn: "Keratin Smooth Heat Protection Spray", name: "بخاخ تريسيمي للحماية من الحرارة", size: "200 مل", price: 39,
    suits: ["damaged","normal","curly","dry"], contains: [], desc: "بخاخ يحمي الشعر من حرارة الاستشوار والمكواة ويقلل الهيشان.",
    pack: { shape: "spray", body: "#1E1E1E", cap: "#D4AF37", accent: "#D4AF37" } }
];

/* ---------- الروتينات ----------
   tiers.basic = المنتجات الأساسية | tiers.full = الروتين الكامل | tiers.plus = الكامل + إضافة متقدمة
   routine: طريقة الاستخدام (صباح / مساء / أسبوعي) */
const KITS = [
  {
    id: "k-dry", cat: "skin", name: "روتين الترطيب العميق", for: "للبشرة الجافة", color: "#EFE3D3",
    tagline: "سيرافي + هادا لابو + حلزون كوسركس: وداعاً للشد.",
    tiers: { basic: ["s01","s15","s20"], full: ["s01","s06","s09","s15","s20"], plus: ["s01","s06","s09","s15","s20","s19"] },
    routine: {
      morning: ["غسول سيرافي بماء فاتر", "لوشن هادا لابو: ربتي منه على الوجه بكفوفك", "إسنس الحلزون من كوسركس على بشرة رطبة", "كريم سيرافي المرطب", "واقي بيوتي أوف جوسون كآخر خطوة"],
      evening: ["غسول سيرافي", "لوشن هادا لابو (طبقتين لو بشرتك جافة جداً)", "إسنس الحلزون", "طبقة أسمك من كريم سيرافي، أو ماسك لانيج النومي في الروتين الفاخر"],
      weekly: []
    }
  },
  {
    id: "k-oily", cat: "skin", name: "روتين التوازن والنقاء", for: "للبشرة الدهنية", color: "#DDEBE0",
    tagline: "كوسركس + أنوا + ذا أوردينري: لمعان أقل ومسام أنقى.",
    tiers: { basic: ["s04","s18","s21"], full: ["s04","s05","s10","s18","s21"], plus: ["s04","s05","s10","s18","s21","s26"] },
    routine: {
      morning: ["جل كوسركس الصباحي 30 ثانية", "تونر أنوا", "سيروم النياسيناميد", "لوشن كوسركس الخالي من الزيوت", "واقي بيوريه"],
      evening: ["جل كوسركس", "تونر أنوا", "سيروم النياسيناميد", "لوشن كوسركس"],
      weekly: ["مقشر بولاز تشويس BHA مساءً 2–3 مرات أسبوعياً بدل التونر (الروتين الفاخر)"]
    }
  },
  {
    id: "k-combo", cat: "skin", name: "روتين التوازن الذكي", for: "للبشرة المختلطة", color: "#E4E0EF",
    tagline: "راوند لاب + أنوا: كل منطقة تأخذ اللي تحتاجه.",
    tiers: { basic: ["s03","s18","s20"], full: ["s03","s05","s11","s18","s20"], plus: ["s03","s05","s11","s10","s18","s20"] },
    routine: {
      morning: ["غسول راوند لاب", "تونر أنوا", "الهيالورونيك على الخدين (والنياسيناميد على منطقة T في الفاخر)", "لوشن كوسركس", "واقي بيوتي أوف جوسون"],
      evening: ["غسول راوند لاب", "تونر أنوا", "الهيالورونيك على كامل الوجه", "لوشن كوسركس"],
      weekly: []
    }
  },
  {
    id: "k-glow", cat: "skin", name: "روتين النضارة والترطيب", for: "للبشرة الباهتة والعطشانة", color: "#F6E7D8",
    tagline: "هادا لابو + فيتامين C من كليرز + حلزون كوسركس: رطوبة على طبقات وإشراقة.",
    tiers: { basic: ["s03","s14","s20"], full: ["s03","s06","s14","s16","s20"], plus: ["s03","s06","s14","s09","s16","s20"] },
    routine: {
      morning: ["غسول راوند لاب اللطيف", "لوشن هادا لابو: طبقتين أو ثلاث على بشرة رطبة", "قطرات فيتامين C من كليرز للإشراقة", "مرطب لاروش بوزيه", "واقي بيوتي أوف جوسون (فيتامين C بدون واقي ما يفيد)"],
      evening: ["غسول راوند لاب", "لوشن هادا لابو", "إسنس الحلزون من كوسركس للترطيب والترميم (الروتين الفاخر)", "مرطب لاروش بوزيه"],
      weekly: ["قناع مرطب أو مقشر لطيف مرة بالأسبوع إذا البشرة متحملة"]
    }
  },
  {
    id: "k-age", cat: "skin", name: "روتين الشباب والتجديد", for: "للتجاعيد وعلامات التقدم بالعمر", color: "#E9E1EC",
    tagline: "ببتيدات ذا أوردينري + ريتينول بالليل + واقي يومي: الثلاثي الأهم ضد الخطوط.",
    tiers: { basic: ["s01","x213","s20"], full: ["s01","x261","x213","s16","s20"], plus: ["s01","x261","x213","x270","s16","s20"] },
    routine: {
      morning: ["غسول سيرافي المرطب", "سيروم البافيه بالببتيدات", "مرطب لاروش بوزيه", "واقي بيوتي أوف جوسون: أهم خطوة ضد التجاعيد"],
      evening: ["غسول سيرافي", "ريتينول ذا أوردينري 0.5%: ابدئي ليلتين بالأسبوع وزيدي تدريجياً", "سيروم العين بالريتينال تحت العين (الروتين الفاخر)", "مرطب لاروش بوزيه"],
      weekly: ["لا تجمعين الريتينول مع الأحماض بنفس الليلة", "الريتينول ممنوع للحامل والمرضع، ونستبدله تلقائياً لو اخترتي إنك حامل"]
    }
  },
  {
    id: "k-teen", cat: "skin", name: "روتين المراهقات", for: "للبشرة الشابة من 13 إلى 17 سنة", color: "#F3E4E4",
    tagline: "كوسركس + أنوا + واقي: بسيط ولطيف وبسعر مناسب.",
    tiers: { basic: ["s04","s18","s20"], full: ["s04","s05","s18","s20","s25"], plus: ["s04","s05","s10","s18","s20","s25"] },
    routine: {
      morning: ["جل كوسركس الصباحي اللطيف", "تونر أنوا المهدئ (الروتين المتكامل)", "لوشن كوسركس الخفيف", "واقي بيوتي أوف جوسون كل يوم حتى بالمدرسة"],
      evening: ["جل كوسركس", "سيروم النياسيناميد على الحبوب والمسام (الروتين الفاخر)", "لوشن كوسركس", "لصقة كوسركس على الحبة بدل ما تعصرينها"],
      weekly: ["لا تفركين البشرة ولا تجربين منتجات كثيرة مرة وحدة", "إذا الحبوب كثيرة أو مؤلمة، استشيري الطبيبة"]
    }
  },
  {
    id: "k-normal", cat: "skin", name: "روتين الأساسيات", for: "للبشرة العادية", color: "#F4E4DC",
    tagline: "روتين بسيط من فرنسا واليابان وكوريا.",
    tiers: { basic: ["s03","s16","s20"], full: ["s03","s06","s09","s16","s20"], plus: ["s03","s06","s09","s14","s16","s20"] },
    routine: {
      morning: ["غسول راوند لاب", "لوشن هادا لابو", "إسنس الحلزون (أو فيتامين C من كليرز في الفاخر)", "مرطب لاروش بوزيه", "واقي بيوتي أوف جوسون"],
      evening: ["غسول راوند لاب", "لوشن هادا لابو", "إسنس الحلزون", "مرطب لاروش بوزيه"],
      weekly: []
    }
  },
  {
    id: "k-sensitive", cat: "skin", name: "روتين التهدئة", for: "للبشرة الحساسة", color: "#DCEAF0",
    tagline: "بيوديرما + سكن1004 + لاروش بوزيه: مكونات أقل، راحة أكثر.",
    tiers: { basic: ["s27","s16","s20"], full: ["s27","s05","s13","s16","s20"], plus: ["s27","s05","s13","s11","s16","s20"] },
    routine: {
      morning: ["ماء بيوديرما على قطنة بدون فرك", "تونر أنوا المهدئ", "أمبول السنتيلا", "مرطب لاروش بوزيه توليريان", "واقي بيوتي أوف جوسون"],
      evening: ["ماء بيوديرما", "أمبول السنتيلا", "مرطب لاروش بوزيه"],
      weekly: ["جربي أي منتج جديد خلف الأذن 24 ساعة قبل استخدامه"]
    }
  },
  {
    id: "k-acne", cat: "skin", name: "روتين صفاء", for: "للبشرة المعرضة للحبوب", color: "#E6EED8",
    tagline: "كوسركس + ذا أوردينري + ماريو باديسكو: خطة واضحة ضد الحبوب.",
    tiers: { basic: ["s04","s18","s25"], full: ["s04","s10","s18","s24","s21"], plus: ["s04","s07","s10","s18","s24","s21"] },
    routine: {
      morning: ["جل كوسركس الصباحي", "سيروم النياسيناميد", "لوشن كوسركس", "واقي بيوريه"],
      evening: ["جل كوسركس", "تونر سم باي مي (الروتين الفاخر)", "سيروم النياسيناميد", "لوشن كوسركس", "ماريو باديسكو على الحبة بعود قطن بدون رج، أو لصقة كوسركس"],
      weekly: ["لا تفركين الحبوب، والنتائج تبان عادة بعد 4–6 أسابيع"]
    }
  },
  {
    id: "k-bright", cat: "skin", name: "روتين الإشراقة", for: "للتصبغات والبهتان", color: "#F8E8C8",
    tagline: "ميلانو سي سي الياباني + ذا أوردينري: لون موحد وإشراقة.",
    tiers: { basic: ["s03","s12","s20"], full: ["s03","s12","s11","s18","s20"], plus: ["s03","s12","s11","s18","s20","s08"] },
    routine: {
      morning: ["غسول راوند لاب", "ميلانو سي سي: قطرتين على البقع والوجه", "سيروم الهيالورونيك", "لوشن كوسركس", "واقي بيوتي أوف جوسون (أهم خطوة لعلاج التصبغات)"],
      evening: ["غسول راوند لاب", "سيروم الهيالورونيك", "لوشن كوسركس"],
      weekly: ["تونر الجلايكوليك مساءً 2–3 مرات أسبوعياً (الروتين الفاخر)، ولا تستخدمينه مع فيتامين C بنفس الليلة"]
    }
  },

  // ===== روتينات الشعر =====
  {
    id: "h-dry", cat: "hair", name: "روتين ترطيب الشعر", for: "للشعر الجاف", color: "#F0E2D0",
    tagline: "تسوباكي الياباني + ميزنسين الكوري: نعومة ولمعة.",
    tiers: { basic: ["h01","h05"], full: ["h01","h05","h09"], plus: ["h01","h05","h09","h07"] },
    routine: {
      morning: ["2–3 بمبات من سيروم ميزنسين على الأطراف بعد التسريح"],
      evening: [],
      weekly: ["شامبو تسوباكي 2–3 مرات أسبوعياً على الفروة", "بلسم تسوباكي على الأطراف 3 دقائق", "ماسك فينو مرة أسبوعياً 5–10 دقائق (الروتين الفاخر)"]
    }
  },
  {
    id: "h-oily", cat: "hair", name: "روتين انتعاش الفروة", for: "للشعر الدهني", color: "#DCE9DF",
    tagline: "بريوجيو + زيت ميلي بالروزماري: جذور منتعشة.",
    tiers: { basic: ["h02","h06"], full: ["h02","h06","h10"], plus: ["h02","h06","h10","h12"] },
    routine: {
      morning: [],
      evening: ["زيت ميلي على الفروة 3 مرات أسبوعياً مع تدليك 5 دقائق"],
      weekly: ["شامبو بريوجيو يوم بعد يوم", "بلسم فانيكريم على الأطراف فقط"]
    }
  },
  {
    id: "h-curly", cat: "hair", name: "روتين تعريف الكيرلي", for: "للشعر المجعد", color: "#EBDDE8",
    tagline: "شيا مويستشر + أولابلكس: تموجات واضحة بدون هيشان.",
    tiers: { basic: ["h04","h11"], full: ["h04","h05","h11"], plus: ["h04","h05","h11","h08"] },
    routine: {
      morning: ["رطبي الشعر بالماء وأعيدي توزيع كريم شيا مويستشر عند الحاجة"],
      evening: ["نامي على كيس مخدة حرير عشان تحافظين على التموجات"],
      weekly: ["شامبو شيا مويستشر مرتين أسبوعياً", "بلسم بكمية كبيرة", "كريم التعريف على شعر مبلل ثم تجفيف بتيشيرت قطني", "أولابلكس رقم 3 قبل الشامبو مرة أسبوعياً (الروتين الفاخر)"]
    }
  },
  {
    id: "h-damaged", cat: "hair", name: "روتين الإصلاح", for: "للشعر المصبوغ والتالف", color: "#F3E1D2",
    tagline: "أولابلكس + فينو + كيراستاس: استرجعي قوة شعرك.",
    tiers: { basic: ["h01","h07"], full: ["h01","h05","h08","h12"], plus: ["h01","h05","h08","h12","h14"] },
    routine: {
      morning: ["بخاخ تريسيمي قبل أي استشوار أو مكواة"],
      evening: [],
      weekly: ["أولابلكس رقم 3 على شعر مبلل 10 دقائق قبل الشامبو، مرة أسبوعياً", "شامبو تسوباكي 2–3 مرات أسبوعياً", "ماسك فينو أو البلسم بعد كل غسلة", "قطرات زيت كيراستاس على الأطراف (الروتين الفاخر)"]
    }
  },
  {
    id: "h-normal", cat: "hair", name: "روتين الشعر الأساسي", for: "للشعر العادي", color: "#E8E5D8",
    tagline: "روتين ياباني بسيط للنظافة واللمعة.",
    tiers: { basic: ["h01","h05"], full: ["h01","h05","h13"], plus: ["h01","h05","h13","h12"] },
    routine: {
      morning: [],
      evening: [],
      weekly: ["شامبو تسوباكي 3 مرات أسبوعياً", "البلسم على الأطراف", "قطرتين سكوالين على الأطراف بعد التجفيف"]
    }
  }
];

/* رابط ريفيوهات تيك توك الحقيقية لكل منتج (بحث بالاسم الإنجليزي للمنتج) */
const tiktokReviews = p => "https://www.tiktok.com/search?q=" + encodeURIComponent(`${p.brand} ${p.nameEn} review`);
PRODUCTS.forEach(p => { p.tiktok = tiktokReviews(p); });
/* زر تيك توك في صفحة الروتين يفتح ريفيوهات المنتج الأبرز فيه (أول سيروم/علاج، أو أول منتج) */
KITS.forEach(k => {
  const ids = k.tiers.full, pick = ids.find(id => /^s(09|10|12|13|05)$|^h(07|08|10|11)$/.test(id)) || ids[0];
  k.tiktok = PRODUCTS.find(p => p.id === pick).tiktok;
});


/* ---------- مناسب لـ (وصف ملاءمة كل منتج) ----------
   fungal: الحبوب الفطرية (Malassezia) — true: آمن غالباً (بدون زيوت/استرات تغذي الفطريات)،
           false: يحتوي مكونات قد تغذي الفطريات، null: غير مؤكد (تُراجع مع الطبيبة)
   goodFor: المشاكل اللي يساعد فيها المنتج
   ملاحظة: تصنيف تقريبي للعرض مبني على المكونات المعروفة للمنتج، وليس تشخيصاً طبياً. */
const CONCERN_TAGS = {
  acne: "الحبوب العادية", hormonal: "الحبوب الهرمونية (عناية مساندة)", fungal: "الحبوب الفطرية",
  marks: "آثار الحبوب", pigment: "التصبغات والكلف", dryness: "الجفاف", oil: "الدهون واللمعان",
  pores: "المسام الواسعة", redness: "الاحمرار والتحسس", barrier: "ضعف حاجز البشرة", glow: "البهتان ونقص النضارة", aging: "التجاعيد وعلامات التقدم بالعمر", eyes: "الهالات وتحت العين", splitEnds: "الأطراف المتقصفة", dandruff: "القشرة وحكة الفروة",
  shine: "لمعان الشعر", frizz: "الهيشان", curls: "تعريف الكيرلي", damage: "الشعر التالف والمصبوغ",
  heat: "الحماية من الحرارة", oilyScalp: "الفروة الدهنية", hairfall: "تساقط الشعر", sensitiveScalp: "الفروة الحساسة"
};
const PRODUCT_TAGS = {
  s01: [null,  ["dryness","barrier","redness"]],
  s03: [false, ["pores","oil"]],
  s04: [true,  ["acne","fungal","pores","oil"]],
  s27: [false, ["redness","barrier"]],
  s05: [true,  ["redness","acne","oil"]],
  s06: [true,  ["dryness","barrier","glow"]],
  s07: [null,  ["acne","pores","oil"]],
  s09: [true,  ["dryness","barrier","marks","glow"]],
  s10: [true,  ["acne","hormonal","pores","oil","marks"]],
  s11: [true,  ["dryness","glow"]],
  s12: [null,  ["pigment","marks","glow"]],
  s13: [true,  ["redness","barrier","acne"]],
  s14: [null,  ["pigment","marks","glow"]],
  s15: [false, ["dryness","barrier"]],
  s16: [null,  ["redness","barrier","dryness"]],
  s17: [null,  ["dryness","oil"]],
  s18: [null,  ["oil","acne"]],
  s20: [null,  ["pigment","redness"]],
  s21: [null,  ["oil","pigment"]],
  s22: [null,  ["pigment"]],
  s23: [null,  ["acne","hormonal","marks"]],
  s24: [true,  ["acne","hormonal","fungal"]],
  s25: [true,  ["acne","hormonal"]],
  s08: [true,  ["pigment","marks","pores"]],
  s26: [true,  ["acne","hormonal","pores","oil"]],
  s19: [false, ["dryness"]],
  h01: [null, ["dryness","shine"]],        h02: [null, ["oilyScalp"]],
  h03: [null, ["sensitiveScalp"]],         h04: [null, ["curls","frizz"]],
  h05: [null, ["dryness","shine"]],        h06: [null, ["sensitiveScalp"]],
  h07: [null, ["damage","dryness"]],       h08: [null, ["damage"]],
  h09: [null, ["frizz","shine","splitEnds"]],          h13: [null, ["frizz","shine"]],
  h14: [null, ["shine","dryness","heat","splitEnds"]], h10: [null, ["hairfall","oilyScalp"]],
  h11: [null, ["curls","frizz"]],          h12: [null, ["heat","frizz"]]
};
PRODUCTS.forEach(p => { const t = PRODUCT_TAGS[p.id] || [null, []]; p.fungal = p.cat === "skin" ? t[0] : null; p.goodFor = t[1]; });

/* =========================================================
   المتجر: منتجات منفردة من براندات كل الدول (مثل سيفورا)
   كل سطر: [البراند، القسم، الاسم الإنجليزي، الاسم العربي، الحجم، السعر، شكل العبوة، "مناسب لـ"، ألوان خاصة؟]
   - منتجات المتجر تُباع منفردة، ولا تدخل في استبدالات الروتينات (kitEligible: false)
     لأن معلومات مكوناتها الحساسة غير مراجعة بعد.
   - demo: منتج بإسم عام لبراند محلي (ما نعرف اسم المنتج الدقيق) — يُعدَّل من لوحة الإدارة.
   - الأسعار تقريبية بالريال لأغراض المشروع.
   ========================================================= */
const COUNTRIES = {
  US: "🇺🇸 أمريكا", CA: "🇨🇦 كندا", UK: "🇬🇧 بريطانيا", BR: "🇧🇷 البرازيل", FR: "🇫🇷 فرنسا", JP: "🇯🇵 اليابان",
  KR: "🇰🇷 كوريا", AU: "🇦🇺 أستراليا", TH: "🇹🇭 تايلند", SA: "🇸🇦 السعودية", EG: "🇪🇬 مصر", CH: "🇨🇭 سويسرا",
  NL: "🇬🇧🇳🇱 بريطانيا وهولندا", DE: "🇩🇪 ألمانيا", BE: "🇧🇪 بلجيكا"
};
const CATEGORIES = {
  hair: { shampoo: "شامبو", conditioner: "بلسم", mask: "ماسكات", hairserum: "سيروم الشعر", oil: "زيوت", treatment: "علاجات", styling: "تصفيف", mousse: "موس", heat: "حماية من الحرارة", curly: "كيرلي وكِنكي" },
  skin: { cleanser: "غسول", moisturizer: "مرطبات", serum: "سيرومات", eye: "العناية بالعين", spf: "واقي شمس", treatment: "علاجات العناية بالوجه" }
};
/* البراند: [البلد، لون العبوة، لون الغطاء، لون الكتابة] */
const SHOP_BRANDS = {
  "K18": ["US", "#FFFFFF", "#1B1B1B", "#00A3AD"], "COLOR WOW": ["US", "#F1ECF7", "#6B3FA0", "#6B3FA0"], "OLAPLEX": ["US", "#FFFFFF", "#111111", "#111111"],
  "AMIKA": ["US", "#F7C6D9", "#E2196E", "#E2196E"], "BRIOGEO": ["US", "#FFFFFF", "#1E1E1E", "#1E1E1E"], "GIOVANNI": ["US", "#FFFFFF", "#2E7D32", "#2E7D32"],
  "KINKY-CURLY": ["US", "#FFFFFF", "#2E7D32", "#2E7D32"], "CURLSMITH": ["US", "#FFFFFF", "#F26B21", "#F26B21"], "REDKEN": ["US", "#5B2A86", "#3E1C5E", "#FFFFFF"],
  "MATRIX": ["US", "#1F4FA3", "#163A7A", "#FFFFFF"], "PAUL MITCHELL": ["US", "#3A8F3A", "#2E6F2E", "#FFFFFF"], "LIVING PROOF": ["US", "#FFFFFF", "#FFFFFF", "#222222"],
  "OUAI": ["US", "#F6EDEA", "#3A3A3A", "#3A3A3A"], "SHEAMOISTURE": ["US", "#6B3A2A", "#F2E6D0", "#F2E6D0"], "CANTU": ["US", "#FFFFFF", "#00838F", "#00838F"],
  "PATTERN": ["US", "#F4E3B2", "#1E1E1E", "#1E1E1E"], "TGIN": ["US", "#FFFFFF", "#7B2D8E", "#7B2D8E"], "IT'S A 10": ["US", "#FFFFFF", "#1E1E1E", "#1E1E1E"],
  "AS I AM": ["US", "#EDE1F2", "#6A1B9A", "#6A1B9A"], "NOT YOUR MOTHER'S": ["US", "#7E57C2", "#5E35B1", "#FFFFFF"],
  "TRESEMMÉ": ["US", "#1E1E1E", "#D4AF37", "#D4AF37"], "HEAD & SHOULDERS": ["US", "#FFFFFF", "#1565C0", "#1565C0"], "HERBAL ESSENCES": ["US", "#E1BEE7", "#8E24AA", "#4A148C"],
  "OGX": ["US", "#B87333", "#8D5524", "#FFFFFF"],
  "CERAVE": ["US", "#FFFFFF", "#FFFFFF", "#1F5DA8"], "PAULA'S CHOICE": ["US", "#FFFFFF", "#3C9DBB", "#3C9DBB"], "DRUNK ELEPHANT": ["US", "#FFFFFF", "#FF6F61", "#FF6F61"],
  "CLINIQUE": ["US", "#F6C9D4", "#F6C9D4", "#333333"], "ESTÉE LAUDER": ["US", "#4A2C1F", "#C9A24B", "#E8C77A"], "NEUTROGENA": ["US", "#3D7FD1", "#2A64B0", "#FFFFFF"],
  "GLOW RECIPE": ["US", "#F78DA7", "#3BB273", "#FFFFFF"], "YOUTH TO THE PEOPLE": ["US", "#CFE3C4", "#1B5E20", "#1B5E20"], "SUMMER FRIDAYS": ["US", "#8FB8DE", "#6E9CCB", "#FFFFFF"],
  "AVEENO": ["US", "#FFFFFF", "#00704A", "#00704A"], "OLAY": ["US", "#B0123C", "#8E0E30", "#FFFFFF"], "CETAPHIL": ["US", "#FFFFFF", "#0072CE", "#0072CE"], "VASELINE": ["US", "#EAF2FB", "#1E5AA8", "#1E5AA8"],
  "THE ORDINARY": ["CA", "#F1F3F4", "#FFFFFF", "#111111"],
  "UMBERTO GIANNINI": ["UK", "#FFFFFF", "#111111", "#111111"], "ONLY CURLS": ["UK", "#FFFFFF", "#E85C9C", "#E85C9C"], "BOUCLÈME": ["UK", "#F7EFE6", "#C17F59", "#8D5A3B"],
  "ELEMIS": ["UK", "#FFFFFF", "#1E1E1E", "#1E1E1E"], "BYOMA": ["UK", "#FFD3E0", "#111111", "#111111"], "SIMPLE": ["UK", "#FFFFFF", "#2E7D32", "#2E7D32"], "NO7": ["UK", "#FFFFFF", "#0D2C6C", "#0D2C6C"],
  "TIGI": ["UK", "#D32F2F", "#B71C1C", "#FFFFFF"],
  "SKALA": ["BR", "#F5D3E8", "#9C27B0", "#9C27B0"], "LOLA COSMETICS": ["BR", "#FFC2A8", "#E64A19", "#E64A19"], "SALON LINE": ["BR", "#E9D5F2", "#8E24AA", "#8E24AA"],
  "KÉRASTASE": ["FR", "#C9963A", "#2B2B2B", "#FFFFFF"], "L'ORÉAL PROFESSIONNEL": ["FR", "#C9A24B", "#1E1E1E", "#1E1E1E"], "L'ORÉAL PARIS ELVIVE": ["FR", "#F3C3D3", "#C2185B", "#7B1F45"],
  "GARNIER": ["FR", "#7AC143", "#4E8A26", "#FFFFFF"], "L'ORÉAL PARIS": ["FR", "#DDEFFB", "#1F4E79", "#1F4E79"],
  "LA ROCHE-POSAY": ["FR", "#FFFFFF", "#FFFFFF", "#2B6CB0"], "AVÈNE": ["FR", "#FFFFFF", "#FFFFFF", "#2B7BB9"], "BIODERMA": ["FR", "#EEF6FA", "#E86A8C", "#E86A8C"],
  "VICHY": ["FR", "#FFFFFF", "#2E5AAC", "#2E5AAC"], "CAUDALIE": ["FR", "#FFFFFF", "#8B1E3F", "#8B1E3F"], "NUXE": ["FR", "#E8C27A", "#C9A24B", "#5D4037"],
  "EMBRYOLISSE": ["FR", "#FFFFFF", "#1E5AA8", "#1E5AA8"], "SVR": ["FR", "#FFFFFF", "#2E8B57", "#2E8B57"], "URIAGE": ["FR", "#FFFFFF", "#00A0DC", "#00A0DC"],
  "FILORGA": ["FR", "#EEF1F6", "#3B4A6B", "#3B4A6B"], "CLARINS": ["FR", "#F4E7D3", "#B71C1C", "#B71C1C"],
  "TSUBAKI": ["JP", "#C8283A", "#B7202F", "#E8C77A"], "&HONEY": ["JP", "#F6C343", "#222222", "#222222"], "FINO": ["JP", "#D9A7A0", "#C79089", "#FFFFFF"],
  "ORBIS": ["JP", "#FFFFFF", "#9E9E9E", "#555555"], "BIOLISS": ["JP", "#F1DDB3", "#8D6E63", "#5D4037"], "BIORÉ": ["JP", "#2F86DE", "#1F6BC0", "#FFFFFF"],
  "SKIN AQUA": ["JP", "#CDB4DB", "#B39BC8", "#4A2E66"], "MELANO CC": ["JP", "#FFFFFF", "#F2A33A", "#E8742B"], "SANA": ["JP", "#F3EBDD", "#9E8F5E", "#6D5F3A"],
  "MEISHOKU": ["JP", "#FFFFFF", "#C2185B", "#C2185B"], "ISHIZAWA LAB": ["JP", "#FFFFFF", "#333333", "#333333"], "PDC": ["JP", "#F2E8D5", "#8D6E63", "#5D4037"],
  "LION PAIR": ["JP", "#FFFFFF", "#D32F2F", "#D32F2F"], "NATURIE": ["JP", "#EAF5E3", "#43A047", "#2E7D32"], "HADA LABO": ["JP", "#FFFFFF", "#E9EEF5", "#1C3F94"],
  "KOSE SOFTYMO": ["JP", "#F6E7A1", "#C9A24B", "#5D4037"], "MUJI": ["JP", "#F7F7F7", "#FFFFFF", "#7B1F1F"], "SENKA": ["JP", "#F8D7DA", "#C62828", "#C62828"],
  "KUNDAL": ["KR", "#F6C343", "#8D6E63", "#5D4037"], "UNOVE": ["KR", "#FFFFFF", "#6A1B9A", "#6A1B9A"], "AROMATICA": ["KR", "#DDEFD9", "#1B5E20", "#1B5E20"],
  "TORRIDEN": ["KR", "#DDEFFB", "#FFFFFF", "#1F4E79"], "DR. ALTHEA": ["KR", "#FFFFFF", "#FFFFFF", "#333333"], "CENTELLIAN24": ["KR", "#FFFFFF", "#5D4037", "#5D4037"],
  "MEDICUBE": ["KR", "#F8BBD0", "#F48FB1", "#880E4F"], "PURITO SEOUL": ["KR", "#FFFFFF", "#2E7D32", "#2E7D32"], "ISNTREE": ["KR", "#D7F0FB", "#FFFFFF", "#0277BD"],
  "AXIS-Y": ["KR", "#FFE0B2", "#FFFFFF", "#E65100"], "ABIB": ["KR", "#DDEFD9", "#A5D6A7", "#1B5E20"], "HARUHARU WONDER": ["KR", "#3E3E3E", "#222222", "#FFFFFF"],
  "MIXSOON": ["KR", "#F5E6C8", "#FFFFFF", "#333333"], "NUMBUZIN": ["KR", "#E8D3C0", "#FFFFFF", "#5D4037"], "AESTURA": ["KR", "#FFFFFF", "#FFFFFF", "#1565C0"],
  "GOODAL": ["KR", "#FFE0B2", "#2E7D32", "#E65100"],
  "EPII": ["KR", "#FDE8EC", "#C8233C", "#8E1630"],
  "AESOP": ["AU", "#5D4037", "#1E1E1E", "#F5E6C8"],
  "LOLANE": ["TH", "#F8BBD0", "#C2185B", "#880E4F"], "CARING": ["TH", "#E1F5FE", "#0288D1", "#01579B"], "SRICHAND": ["TH", "#FFFFFF", "#C9A24B", "#5D4037"],
  "MIZUMI": ["TH", "#B3E5FC", "#0288D1", "#01579B"], "SMOOTH E": ["TH", "#FFFFFF", "#1E88E5", "#1E88E5"],
  "BLUE CURLS": ["SA", "#D6E9FF", "#1565C0", "#0D47A1"], "CLARA HAIR": ["SA", "#F3E5F5", "#8E24AA", "#6A1B9A"], "NGWAA": ["SA", "#FFF3E0", "#EF6C00", "#E65100"],
  "SEDRA CARE": ["SA", "#E8F5E9", "#388E3C", "#1B5E20"], "CURL IT": ["SA", "#FCE4EC", "#D81B60", "#AD1457"], "HENNA RAGHAD": ["SA", "#EFEBE9", "#6D4C41", "#4E342E"],
  "HENNA AFNAN": ["SA", "#F1F8E9", "#689F38", "#33691E"], "SMOOTH KSA": ["SA", "#FFFFFF", "#212121", "#212121"], "JH CARE": ["SA", "#E0F7FA", "#00838F", "#006064"],
  "EVA": ["EG", "#FFFFFF", "#AD1457", "#AD1457"], "BOBANA": ["EG", "#FFF8E1", "#F9A825", "#6D4C41"], "THE HAIR ADDICT": ["EG", "#212121", "#FFFFFF", "#FFFFFF"],
  "LES KARITES": ["EG", "#F5E6C8", "#8D6E63", "#5D4037"], "HERBAL SENSATION": ["EG", "#E8F5E9", "#2E7D32", "#1B5E20"], "DERMACY": ["EG", "#FFFFFF", "#00897B", "#00695C"],
  "NUT BOTANICALS": ["EG", "#EFEBE9", "#795548", "#4E342E"], "INFINITY": ["EG", "#EDE7F6", "#5E35B1", "#4527A0"],
  "PANTENE": ["CH", "#FFFFFF", "#C9A24B", "#7B5E1F"], "DOVE": ["NL", "#FFFFFF", "#1A237E", "#1A237E"], "SUNSILK": ["NL", "#F06292", "#D81B60", "#FFFFFF"],
  "SCHWARZKOPF GLISS": ["DE", "#2B2B2B", "#C9A24B", "#E8C77A"], "SYOSS": ["DE", "#FFFFFF", "#111111", "#111111"], "NIVEA": ["DE", "#0D47A1", "#0D47A1", "#FFFFFF"],
  "EUCERIN": ["DE", "#FFFFFF", "#C62828", "#1565C0"],
  "NIZORAL": ["BE", "#FFFFFF", "#C62828", "#C62828"], "DUCRAY": ["FR", "#FFFFFF", "#00838F", "#00838F"], "SEBAMED": ["DE", "#FFFFFF", "#1565C0", "#1565C0"], "SELSUN BLUE": ["US", "#1E88E5", "#0D47A1", "#FFFFFF"],
  "ANUA": ["KR", "#EAF3E6", "#FFFFFF", "#5E8F5A"],
  "BEAUTY OF JOSEON": ["KR", "#FBF6EC", "#FBF6EC", "#4F7A4C"],
  "COSRX": ["KR", "#FFFFFF", "#222222", "#222222"],
  "KLAIRS": ["KR", "#FFFFFF", "#FFFFFF", "#3A3A3A"],
  "LANEIGE": ["KR", "#DDEBFA", "#1F4E9C", "#1F4E9C"],
  "MIELLE": ["US", "#E9DDF2", "#5A2D82", "#5A2D82"],
  "PANOXYL": ["US", "#FFFFFF", "#C62828", "#C62828"],
  "ROUND LAB": ["KR", "#F4F8FB", "#FFFFFF", "#2E6FB7"],
  "SKIN1004": ["KR", "#F5EFE3", "#FFFFFF", "#8B6B3E"],
  "SOME BY MI": ["KR", "#E3F1E4", "#7DBE8A", "#2F7A45"],
  "WRD": ["SA", "#F7E6E6", "#B2475A", "#7A2F3D"],
  "رؤى الطبيعة": ["SA", "#F3EBDD", "#6D8F4E", "#4E6B33"],
  "IUNIK": ["KR", "#DCEBF4", "#C0C6CC", "#2E4A62"], "EQQUALBERRY": ["KR", "#F2F5F2", "#FFFFFF", "#2E7D4F"]
};
const SHOP_ROWS = [
  // ---------------- 🇺🇸 أمريكا — شعر ----------------
  ["K18", "treatment", "Leave-In Molecular Repair Hair Mask", "ماسك K18 للإصلاح الجزيئي (بدون شطف)", "50 مل", 299, "tube", ["damage"]],
  ["COLOR WOW", "styling", "Dream Coat Supernatural Spray", "بخاخ كلر واو دريم كوت ضد الرطوبة", "200 مل", 139, "spray", ["frizz", "shine"]],
  ["OLAPLEX", "shampoo", "No.4 Bond Maintenance Shampoo", "شامبو أولابلكس رقم 4", "250 مل", 129, "bottle", ["damage"]],
  ["OLAPLEX", "conditioner", "No.5 Bond Maintenance Conditioner", "بلسم أولابلكس رقم 5", "250 مل", 129, "bottle", ["damage"]],
  ["OLAPLEX", "oil", "No.7 Bonding Oil", "زيت أولابلكس رقم 7", "30 مل", 129, "dropper", ["shine", "heat", "splitEnds"]],
  ["AMIKA", "styling", "Perk Up Dry Shampoo", "شامبو جاف أميكا بيرك أب", "232 مل", 105, "spray", ["oilyScalp"]],
  ["AMIKA", "mask", "The Kure Bond Repair Mask", "ماسك أميكا ذا كيور للإصلاح", "250 مل", 159, "jar", ["damage"]],
  ["BRIOGEO", "mask", "Don't Despair, Repair! Deep Conditioning Mask", "ماسك بريوجيو دونت ديسبير ريبير", "236 مل", 159, "jar", ["damage", "dryness"]],
  ["GIOVANNI", "conditioner", "Direct Leave-In Weightless Moisture Conditioner", "بلسم جيوفاني دايركت بدون شطف", "250 مل", 59, "bottle", ["dryness", "curls"]],
  ["KINKY-CURLY", "curly", "Knot Today Leave-In Detangler", "كِنكي كيرلي نوت توداي لفك التشابك", "236 مل", 85, "bottle", ["curls", "dryness"]],
  ["KINKY-CURLY", "curly", "Curling Custard Gel", "جل كِنكي كيرلي كاستارد لتعريف الكيرلي", "236 مل", 95, "jar", ["curls"]],
  ["CURLSMITH", "curly", "Curl Quenching Conditioning Wash", "غسول كيرل سميث المرطب للكيرلي", "355 مل", 119, "bottle", ["curls", "dryness"]],
  ["CURLSMITH", "curly", "In Shower Style Fixer", "جل كيرل سميث للتصفيف في الشاور", "237 مل", 119, "tube", ["curls", "frizz"]],
  ["REDKEN", "treatment", "Acidic Bonding Concentrate Intensive Treatment", "علاج ريدكن أسيديك بوندينغ المركز", "150 مل", 139, "tube", ["damage"]],
  ["MATRIX", "shampoo", "Total Results Brass Off Shampoo", "شامبو ماتريكس براس أوف للأشقر", "300 مل", 79, "bottle", ["damage"]],
  ["PAUL MITCHELL", "shampoo", "Tea Tree Special Shampoo", "شامبو بول ميتشل بشجرة الشاي", "300 مل", 89, "bottle", ["oilyScalp", "dandruff"]],
  ["LIVING PROOF", "styling", "Perfect Hair Day Dry Shampoo", "شامبو جاف ليفنغ بروف", "198 مل", 129, "spray", ["oilyScalp"]],
  ["OUAI", "oil", "Hair Oil", "زيت الشعر من واي", "45 مل", 119, "dropper", ["shine", "frizz"]],
  ["OUAI", "shampoo", "Detox Shampoo", "شامبو واي ديتوكس", "300 مل", 129, "bottle", ["oilyScalp"]],
  ["SHEAMOISTURE", "mask", "Jamaican Black Castor Oil Strengthen & Restore Masque", "ماسك شيا مويستشر بزيت الخروع الأسود", "340 غ", 69, "tub", ["damage", "hairfall"]],
  ["CANTU", "curly", "Shea Butter Coconut Curling Cream", "كريم كانتو لتعريف الكيرلي بجوز الهند", "340 غ", 49, "tub", ["curls", "frizz"]],
  ["CANTU", "curly", "Shea Butter Leave-In Conditioning Repair Cream", "كريم كانتو الأصلي بدون شطف", "453 غ", 49, "tub", ["curls", "dryness"]],
  ["PATTERN", "curly", "Leave-In Conditioner", "بلسم باترن بيوتي بدون شطف", "296 مل", 109, "bottle", ["curls", "dryness"]],
  ["TGIN", "curly", "Twist & Define Cream", "كريم تي جن لتعريف التويست", "340 غ", 79, "jar", ["curls"]],
  ["IT'S A 10", "treatment", "Miracle Leave-In Product", "بخاخ إتس أ تن ميراكل بدون شطف", "120 مل", 99, "spray", ["frizz", "dryness"]],
  ["AS I AM", "curly", "Coconut CoWash Cleansing Conditioner", "غسول آز آي آم بجوز الهند للكيرلي", "454 غ", 69, "tub", ["curls", "dryness"]],
  ["NOT YOUR MOTHER'S", "curly", "Curl Talk Curl Cream", "كريم نوت يور ماذرز كيرل توك", "177 مل", 49, "tube", ["curls"]],
  ["HEAD & SHOULDERS", "shampoo", "Classic Clean Anti-Dandruff Shampoo", "شامبو هيد آند شولدرز الكلاسيكي ضد القشرة", "400 مل", 29, "bottle", ["dandruff", "oilyScalp"]],
  ["HERBAL ESSENCES", "shampoo", "Bio:Renew Argan Oil Repair Shampoo", "شامبو هيربال إيسنسز بزيت الأرغان", "400 مل", 35, "bottle", ["dryness", "shine"]],
  ["OGX", "shampoo", "Renewing Argan Oil of Morocco Shampoo", "شامبو أو جي إكس بزيت الأرغان المغربي", "385 مل", 45, "bottle", ["dryness", "shine"]],
  ["TRESEMMÉ", "conditioner", "Keratin Smooth Conditioner", "بلسم تريسيمي كيراتين سموث", "400 مل", 32, "bottle", ["frizz"]],
  // ---------------- 🇺🇸 أمريكا / 🇨🇦 كندا — بشرة ----------------
  ["CERAVE", "cleanser", "Foaming Facial Cleanser", "غسول سيرافي الرغوي", "236 مل", 65, "pump", ["oil", "acne"]],
  ["CERAVE", "eye", "Eye Repair Cream", "كريم سيرافي للعين", "14 مل", 69, "tube", ["eyes", "dryness"]],
  ["PAULA'S CHOICE", "serum", "10% Niacinamide Booster", "بوستر بولاز تشويس نياسيناميد 10%", "20 مل", 189, "dropper", ["pores", "oil", "marks"]],
  ["DRUNK ELEPHANT", "moisturizer", "Protini Polypeptide Cream", "كريم درنك إليفنت بروتيني", "50 مل", 259, "jar", ["dryness", "barrier"]],
  ["DRUNK ELEPHANT", "serum", "C-Firma Fresh Day Serum", "سيروم درنك إليفنت سي فيرما", "28 مل", 329, "pump", ["pigment", "marks"]],
  ["CLINIQUE", "moisturizer", "Moisture Surge 100H Auto-Replenishing Hydrator", "مرطب كلينيك مويستشر سيرج", "50 مل", 189, "jar", ["dryness"]],
  ["CLINIQUE", "moisturizer", "Dramatically Different Moisturizing Gel", "جل كلينيك دراماتيكلي ديفرنت", "125 مل", 169, "pump", ["oil", "dryness"]],
  ["ESTÉE LAUDER", "serum", "Advanced Night Repair Serum", "سيروم إستي لودر أدفانسد نايت ريبير", "50 مل", 459, "dropper", ["barrier", "dryness"]],
  ["NEUTROGENA", "cleanser", "Oil-Free Acne Wash", "غسول نيوتروجينا الخالي من الزيوت للحبوب", "269 مل", 49, "pump", ["acne", "oil"]],
  ["GLOW RECIPE", "serum", "Watermelon Glow Niacinamide Dew Drops", "قطرات جلو ريسبي بالبطيخ والنياسيناميد", "40 مل", 179, "dropper", ["pigment", "dryness"]],
  ["YOUTH TO THE PEOPLE", "cleanser", "Superfood Antioxidant Cleanser", "غسول يوث تو ذا بيبل سوبرفود", "237 مل", 159, "pump", ["oil", "pores"]],
  ["SUMMER FRIDAYS", "treatment", "Jet Lag Mask", "ماسك سمر فرايديز جت لاق", "64 غ", 189, "tube", ["dryness", "barrier"]],
  ["AVEENO", "moisturizer", "Daily Moisturizing Lotion", "لوشن أفينو المرطب اليومي", "354 مل", 59, "pump", ["dryness", "redness"]],
  ["OLAY", "moisturizer", "Regenerist Micro-Sculpting Cream", "كريم أولاي ريجنريست", "50 غ", 129, "jar", ["dryness"]],
  ["CETAPHIL", "cleanser", "Gentle Skin Cleanser", "غسول سيتافيل اللطيف", "236 مل", 55, "pump", ["redness", "dryness"]],
  ["CETAPHIL", "moisturizer", "Moisturizing Cream", "كريم سيتافيل المرطب", "453 غ", 79, "tub", ["dryness", "barrier"]],
  ["VASELINE", "treatment", "Original Healing Jelly", "فازلين الأصلي", "100 مل", 19, "jar", ["dryness", "barrier"]],
  ["THE ORDINARY", "treatment", "AHA 30% + BHA 2% Peeling Solution", "مقشر ذا أوردينري الأحمر AHA+BHA", "30 مل", 49, "dropper", ["pigment", "pores", "marks"]],
  ["THE ORDINARY", "moisturizer", "Natural Moisturizing Factors + HA", "مرطب ذا أوردينري NMF", "30 مل", 39, "tube", ["dryness", "barrier"]],
  // ---------------- 🇬🇧 بريطانيا ----------------
  ["UMBERTO GIANNINI", "shampoo", "Banana Butter Nourishing Shampoo", "شامبو أومبرتو جيانيني بزبدة الموز", "250 مل", 59, "bottle", ["dryness"], ["#FBE9A6", "#F2C230", "#5D4037"]],
  ["UMBERTO GIANNINI", "conditioner", "Banana Butter Nourishing Conditioner", "بلسم أومبرتو جيانيني بزبدة الموز", "250 مل", 59, "bottle", ["dryness"], ["#FBE9A6", "#F2C230", "#5D4037"]],
  ["UMBERTO GIANNINI", "mask", "Banana Butter Nourishing Super Mask", "ماسك أومبرتو جيانيني بزبدة الموز", "230 مل", 69, "jar", ["dryness", "damage"], ["#FBE9A6", "#F2C230", "#5D4037"]],
  ["UMBERTO GIANNINI", "curly", "Curl Jelly Curl Defining Gel", "جل أومبرتو جيانيني كيرل جيلي", "200 مل", 59, "tube", ["curls", "frizz"], ["#E1F5FE", "#0277BD", "#01579B"]],
  ["UMBERTO GIANNINI", "mousse", "Curl Whip Curl Defining Mousse", "موس أومبرتو جيانيني كيرل ويب", "200 مل", 59, "spray", ["curls"], ["#FCE4EC", "#D81B60", "#880E4F"]],
  ["UMBERTO GIANNINI", "curly", "Curl Leave-In Conditioner", "بلسم أومبرتو جيانيني للكيرلي بدون شطف", "200 مل", 59, "bottle", ["curls", "dryness"], ["#EDE7F6", "#5E35B1", "#311B92"]],
  ["UMBERTO GIANNINI", "shampoo", "Glossing Shampoo", "شامبو أومبرتو جيانيني للمعان", "250 مل", 55, "bottle", ["shine"], ["#F5F5F5", "#9E9E9E", "#424242"]],
  ["UMBERTO GIANNINI", "conditioner", "Glossing Conditioner", "بلسم أومبرتو جيانيني للمعان", "250 مل", 55, "bottle", ["shine"], ["#F5F5F5", "#9E9E9E", "#424242"]],
  ["UMBERTO GIANNINI", "oil", "Glossing Hair Oil", "زيت أومبرتو جيانيني للمعان", "100 مل", 65, "pump", ["shine", "frizz"], ["#F5F5F5", "#9E9E9E", "#424242"]],
  ["UMBERTO GIANNINI", "treatment", "Grow Like A Pro Scalp Serum", "سيروم أومبرتو جيانيني لفروة الرأس", "50 مل", 69, "dropper", ["hairfall"], ["#E8F5E9", "#2E7D32", "#1B5E20"]],
  ["UMBERTO GIANNINI", "heat", "Heat Protection Spray", "بخاخ أومبرتو جيانيني للحماية من الحرارة", "150 مل", 55, "spray", ["heat"]],
  ["ONLY CURLS", "curly", "Curl Defining Gel", "جل أونلي كيرلز لتعريف الكيرلي", "250 مل", 89, "tube", ["curls"]],
  ["BOUCLÈME", "curly", "Curl Cream", "كريم بوكليم للكيرلي", "250 مل", 119, "tube", ["curls", "dryness"]],
  ["ELEMIS", "cleanser", "Pro-Collagen Cleansing Balm", "بلسم إليمس برو كولاجين للتنظيف", "100 غ", 239, "jar", ["dryness"]],
  ["BYOMA", "moisturizer", "Moisturizing Gel Cream", "جل كريم بايوما المرطب", "50 مل", 79, "tube", ["barrier", "dryness"]],
  ["SIMPLE", "cleanser", "Kind to Skin Refreshing Facial Wash", "غسول سيمبل كايند تو سكن", "150 مل", 29, "tube", ["redness"]],
  ["NO7", "serum", "Protect & Perfect Intense Advanced Serum", "سيروم نمبر 7 بروتكت آند بيرفكت", "30 مل", 129, "pump", ["dryness"]],
  ["TIGI", "shampoo", "Bed Head Resurrection Shampoo", "شامبو تيجي بيد هيد ريزركشن", "400 مل", 59, "bottle", ["damage"]],
  // ---------------- 🇧🇷 البرازيل ----------------
  ["SKALA", "curly", "Mais Cachos Treatment Cream", "كريم سكالا مايس كاشوس للكيرلي", "1 كغ", 45, "tub", ["curls", "dryness"]],
  ["LOLA COSMETICS", "curly", "Meu Cacho Minha Vida Activator", "منشط لولا كوزمتكس للكيرلي", "500 مل", 79, "bottle", ["curls"]],
  ["SALON LINE", "curly", "#todecacho Curl Activator", "منشط سالون لاين للكيرلي", "300 مل", 49, "bottle", ["curls", "frizz"]],
  // ---------------- 🇫🇷 فرنسا ----------------
  ["KÉRASTASE", "shampoo", "Nutritive Bain Satin Shampoo", "شامبو كيراستاس نيوتريتيف", "250 مل", 159, "bottle", ["dryness"], ["#D9E8F5", "#1F4E79", "#1F4E79"]],
  ["KÉRASTASE", "mask", "Elixir Ultime Le Masque", "ماسك كيراستاس إليكسير ألتيم", "200 مل", 229, "jar", ["damage", "shine"]],
  ["L'ORÉAL PROFESSIONNEL", "mask", "Absolut Repair Mask", "ماسك لوريال بروفيشنال أبسوليوت ريبير", "250 مل", 119, "jar", ["damage"]],
  ["L'ORÉAL PROFESSIONNEL", "shampoo", "Metal Detox Shampoo", "شامبو لوريال بروفيشنال ميتال ديتوكس", "300 مل", 119, "bottle", ["damage"], ["#B0BEC5", "#455A64", "#263238"]],
  ["L'ORÉAL PARIS ELVIVE", "shampoo", "Dream Lengths Shampoo", "شامبو إلفيف دريم لينثس", "400 مل", 35, "bottle", ["damage"]],
  ["L'ORÉAL PARIS ELVIVE", "oil", "Extraordinary Oil", "زيت إلفيف الاستثنائي", "100 مل", 49, "pump", ["shine", "dryness", "splitEnds"], ["#E8C27A", "#C9A24B", "#5D4037"]],
  ["GARNIER", "mask", "Fructis Hair Food Banana Mask", "ماسك غارنييه فركتس هير فود بالموز", "390 مل", 39, "jar", ["dryness"], ["#FBE9A6", "#F2C230", "#5D4037"]],
  ["GARNIER", "cleanser", "SkinActive Micellar Cleansing Water", "ماء ميسيلار غارنييه", "400 مل", 35, "bottle", ["redness"], ["#F3F7FB", "#E86A8C", "#1F4E79"]],
  ["L'ORÉAL PARIS", "serum", "Revitalift 1.5% Hyaluronic Acid Serum", "سيروم لوريال ريفيتاليفت هيالورونيك", "30 مل", 89, "dropper", ["dryness"]],
  ["AVÈNE", "moisturizer", "Cicalfate+ Restorative Protective Cream", "كريم أفين سيكالفات+", "40 مل", 79, "tube", ["barrier", "redness"]],
  ["AVÈNE", "treatment", "Thermal Spring Water Spray", "بخاخ مياه أفين الحرارية", "150 مل", 55, "spray", ["redness"]],
  ["BIODERMA", "cleanser", "Sébium Foaming Gel", "جل بيوديرما سيبيوم الرغوي", "200 مل", 69, "tube", ["oil", "acne"], ["#EAF7EE", "#3BA86B", "#2E7D32"]],
  ["VICHY", "serum", "Minéral 89 Hyaluronic Acid Booster", "سيروم فيشي مينرال 89", "50 مل", 129, "dropper", ["dryness", "barrier"]],
  ["CAUDALIE", "serum", "Vinoperfect Radiance Serum", "سيروم كودالي فينوبيرفكت", "30 مل", 199, "dropper", ["pigment", "marks"]],
  ["CAUDALIE", "treatment", "Beauty Elixir", "بخاخ كودالي بيوتي إليكسير", "100 مل", 159, "spray", ["pores"], ["#E8F3E8", "#2E7D32", "#1B5E20"]],
  ["NUXE", "treatment", "Huile Prodigieuse Multi-Purpose Dry Oil", "زيت نوكس بروديجيوز", "100 مل", 129, "spray", ["dryness"]],
  ["EMBRYOLISSE", "moisturizer", "Lait-Crème Concentré", "كريم إمبريوليس لي كريم", "75 مل", 89, "tube", ["dryness", "barrier"]],
  ["SVR", "cleanser", "Sebiaclear Gel Moussant", "غسول إس في آر سيبياكلير", "200 مل", 65, "tube", ["acne", "oil"]],
  ["URIAGE", "moisturizer", "Bariéderm Cica-Cream", "كريم يورياج سيكا", "40 مل", 69, "tube", ["barrier", "redness"]],
  ["FILORGA", "moisturizer", "Time-Filler 5XP Cream", "كريم فيلورجا تايم فيلر", "50 مل", 249, "jar", ["dryness"]],
  ["CLARINS", "serum", "Double Serum", "سيروم كلارنس دبل", "50 مل", 449, "pump", ["dryness", "barrier"]],
  // ---------------- 🇯🇵 اليابان — شعر ----------------
  ["&HONEY", "shampoo", "Deep Moist Shampoo 1.0", "شامبو آند هني ديب مويست", "440 مل", 69, "pump", ["dryness", "shine"]],
  ["&HONEY", "oil", "Deep Moist Hair Oil 3.0", "زيت آند هني ديب مويست", "100 مل", 65, "bottle", ["shine", "frizz"]],
  ["ORBIS", "treatment", "Essence in Hair Milk", "حليب أوربيس إسنس للشعر", "140 غ", 75, "tube", ["frizz", "damage"]],
  ["BIOLISS", "oil", "Pure Retouch Glow Hair Oil", "زيت بيوليس بيور ريتاتش للمعان", "80 مل", 55, "bottle", ["shine", "frizz"]],
  ["TSUBAKI", "mask", "Premium Repair Mask", "ماسك تسوباكي بريميوم ريبير", "180 غ", 59, "jar", ["damage"]],
  // ---------------- 🇯🇵 اليابان — بشرة ----------------
  ["SKIN AQUA", "spf", "Tone Up UV Essence Lavender SPF50+", "واقي سكن أكوا تون أب لافندر", "80 غ", 59, "tube", ["pigment"]],
  ["SKIN AQUA", "spf", "Super Moisture Gel Pump SPF50+", "واقي سكن أكوا سوبر مويستشر جل", "140 غ", 69, "pump", ["dryness"], ["#E1F5FE", "#4FC3F7", "#0277BD"]],
  ["SANA", "eye", "Soy Milk Sheer & Moisture Eye Cream", "كريم سانا للعين بحليب الصويا للترطيب", "25 غ", 59, "tube", ["eyes", "dryness"]],
  ["SANA", "eye", "Soy Milk Wrinkle Care Eye Cream", "كريم سانا للعين بحليب الصويا للخطوط", "25 غ", 69, "tube", ["eyes", "dryness"]],
  ["MEISHOKU", "eye", "Brilliant Colors Whitening Eye Cream", "كريم ميشوكو للعين للتفتيح", "30 غ", 55, "jar", ["eyes", "pigment"]],
  ["ISHIZAWA LAB", "treatment", "Keana Nadeshiko Rice Pack", "ماسك إيشيزاوا كيانا بالأرز", "170 غ", 59, "tub", ["pores", "oil"]],
  ["PDC", "treatment", "Wafood Made Sake Lees Face Pack", "ماسك بي دي سي بخميرة الساكي", "170 غ", 55, "tube", ["pigment", "pores"]],
  ["ISHIZAWA LAB", "treatment", "Keana Rice Mask", "ماسك كيانا الورقي بالأرز", "10 ماسكات", 59, "box", ["pores"]],
  ["LION PAIR", "treatment", "PAIR Acne Cream W", "كريم بير للحبوب من لايون (علاج موضعي)", "14 غ", 35, "tube", ["acne", "hormonal"]],
  ["NATURIE", "moisturizer", "Hatomugi Skin Conditioning Gel", "جل ناتشوري هاتوموجي", "180 غ", 49, "tub", ["dryness", "oil"]],
  ["HADA LABO", "moisturizer", "Shirojyun Arbutin Whitening Cream", "كريم هادا لابو شيروجيون بالأربوتين", "50 غ", 69, "jar", ["pigment"]],
  ["KOSE SOFTYMO", "cleanser", "Speedy Cleansing Oil", "زيت كوسيه سوفتيمو المنظف", "230 مل", 49, "pump", ["pores"]],
  ["BIORÉ", "cleanser", "Makeup Remover Perfect Cleansing Oil", "زيت بيوريه لإزالة المكياج", "150 مل", 49, "pump", ["pores"], ["#E3F2FD", "#1F6BC0", "#1F6BC0"]],
  ["MUJI", "cleanser", "Mild Cleansing Oil for Sensitive Skin", "زيت موجي المنظف للبشرة الحساسة", "200 مل", 59, "pump", ["redness"]],
  ["MELANO CC", "cleanser", "Deep Clear Enzyme Face Wash", "غسول ميلانو سي سي بالإنزيم", "130 غ", 45, "tube", ["pores", "pigment"]],
  ["HADA LABO", "cleanser", "Gokujyun Hyaluronic Acid Face Wash", "غسول هادا لابو غوكوجيون", "100 غ", 39, "tube", ["dryness"]],
  ["SENKA", "cleanser", "Perfect Whip Beauty Foam Collagen", "غسول سينكا بيرفكت ويب بالكولاجين", "120 غ", 35, "tube", ["dryness"]],
  // ---------------- 🇰🇷 كوريا ----------------
  ["KUNDAL", "shampoo", "Honey & Macadamia Protein Repair Shampoo", "شامبو كوندال بالعسل والمكاديميا", "500 مل", 59, "pump", ["damage", "dryness"]],
  ["UNOVE", "treatment", "Deep Damage Treatment EX", "علاج يونوف ديب داميج", "320 مل", 79, "tube", ["damage"]],
  ["AROMATICA", "shampoo", "Rosemary Scalp Scaling Shampoo", "شامبو أروماتيكا بالروزماري للفروة", "400 مل", 79, "pump", ["oilyScalp", "dandruff", "hairfall"]],
  ["TORRIDEN", "serum", "DIVE-IN Low Molecular Hyaluronic Acid Serum", "سيروم توريدن دايف إن", "50 مل", 89, "dropper", ["dryness"]],
  ["DR. ALTHEA", "moisturizer", "345 Relief Cream", "كريم دكتور ألثيا 345", "50 مل", 89, "tube", ["redness", "barrier"]],
  ["CENTELLIAN24", "moisturizer", "Madeca Cream", "كريم سنتليان24 ماديكا", "50 مل", 99, "jar", ["barrier", "redness"]],
  ["MEDICUBE", "treatment", "Zero Pore Pad 2.0", "بادات ميديكيوب زيرو بور", "70 باد", 99, "jar", ["pores", "oil"]],
  ["PURITO SEOUL", "spf", "Daily Go-To Sunscreen SPF50+", "واقي بوريتو سول اليومي", "60 مل", 69, "tube", ["redness"]],
  ["ISNTREE", "spf", "Hyaluronic Acid Watery Sun Gel SPF50+", "واقي إزنتري جل مائي", "50 مل", 69, "tube", ["dryness"]],
  ["AXIS-Y", "serum", "Dark Spot Correcting Glow Serum", "سيروم أكسس واي للبقع الداكنة", "50 مل", 89, "dropper", ["pigment", "marks"]],
  ["ABIB", "treatment", "Heartleaf Spot Pad Calming Touch", "بادات أبيب بالهارتليف", "80 باد", 89, "jar", ["redness", "acne"]],
  ["HARUHARU WONDER", "treatment", "Black Rice Hyaluronic Toner", "تونر هاروهارو بالأرز الأسود", "150 مل", 79, "bottle", ["dryness"]],
  ["MIXSOON", "serum", "Bean Essence", "إسنس ميكسون بالفول", "50 مل", 85, "bottle", ["pores", "marks"]],
  ["NUMBUZIN", "serum", "No.3 Skin Softening Serum", "سيروم نمبوزين رقم 3", "50 مل", 95, "dropper", ["pores", "dryness"]],
  ["AESTURA", "moisturizer", "Atobarrier 365 Cream", "كريم أستورا أتوباريير 365", "80 مل", 99, "tube", ["barrier", "dryness"]],
  ["GOODAL", "serum", "Green Tangerine Vita C Dark Spot Serum", "سيروم قودال بالتانجرين الأخضر", "40 مل", 99, "dropper", ["pigment", "marks"]],
  ["EPII", "serum", "Skincare Serum (منتج توضيحي)", "سيروم إيبي الكوري (منتج توضيحي)", "30 مل", 89, "dropper", ["dryness", "marks"], null, true],
  ["EPII", "moisturizer", "Skincare Cream (منتج توضيحي)", "كريم إيبي الكوري (منتج توضيحي)", "50 مل", 95, "jar", ["dryness", "barrier"], null, true],
  // ---------------- 🇦🇺 أستراليا ----------------
  ["AESOP", "cleanser", "Parsley Seed Facial Cleanser", "غسول إيسوب ببذور البقدونس", "200 مل", 229, "bottle", ["oil"]],
  // ---------------- 🇹🇭 تايلند ----------------
  ["LOLANE", "oil", "Natura Daily Hair Serum Magic in One", "سيروم لولان ناتورا للشعر", "50 مل", 29, "bottle", ["frizz", "shine"]],
  ["CARING", "treatment", "Hair Treatment (منتج توضيحي)", "علاج كيرنج للشعر (منتج توضيحي)", "250 مل", 35, "jar", ["damage"], null, true],
  ["SRICHAND", "moisturizer", "Skin Care Cream (منتج توضيحي)", "كريم سريتشاند للبشرة (منتج توضيحي)", "50 مل", 45, "jar", ["dryness"], null, true],
  ["MIZUMI", "spf", "UV Water Serum SPF50+", "واقي ميزومي يو في واتر سيروم", "40 غ", 49, "tube", ["oil"]],
  ["SMOOTH E", "cleanser", "Babyface Foam", "غسول سموث إي بيبي فيس", "120 غ", 39, "tube", ["acne", "redness"]],
  // ---------------- 🇸🇦 السعودية (أسماء منتجات توضيحية) ----------------
  ["BLUE CURLS", "curly", "Curl Defining Cream (منتج توضيحي)", "كريم بلو كيرلز لتعريف الكيرلي (منتج توضيحي)", "250 مل", 69, "jar", ["curls"], null, true],
  ["CLARA HAIR", "oil", "Hair Oil (منتج توضيحي)", "زيت كلارا للشعر (منتج توضيحي)", "100 مل", 59, "dropper", ["hairfall", "shine"], null, true],
  ["NGWAA", "mask", "Hair Mask (منتج توضيحي)", "ماسك نجوى للشعر (منتج توضيحي)", "250 مل", 65, "jar", ["damage"], null, true],
  ["SEDRA CARE", "oil", "Sidr Hair Oil (منتج توضيحي)", "زيت سدرة كير بالسدر (منتج توضيحي)", "100 مل", 55, "dropper", ["hairfall"], null, true],
  ["CURL IT", "curly", "Curl Gel (منتج توضيحي)", "جل كيرل إت للكيرلي (منتج توضيحي)", "250 مل", 59, "tube", ["curls"], null, true],
  ["HENNA RAGHAD", "treatment", "Natural Henna (منتج توضيحي)", "حناء رغد الطبيعية (منتج توضيحي)", "200 غ", 35, "box", ["shine"], null, true],
  ["HENNA AFNAN", "treatment", "Natural Henna (منتج توضيحي)", "حناء أفنان الطبيعية (منتج توضيحي)", "200 غ", 35, "box", ["shine"], null, true],
  ["SMOOTH KSA", "treatment", "Smoothing Treatment (منتج توضيحي)", "علاج سموث للتنعيم (منتج توضيحي)", "250 مل", 89, "bottle", ["frizz"], null, true],
  ["JH CARE", "shampoo", "Hair Shampoo (منتج توضيحي)", "شامبو جي إتش كير (منتج توضيحي)", "300 مل", 49, "bottle", [], null, true],
  // ---------------- 🇪🇬 مصر (أسماء منتجات توضيحية) ----------------
  ["EVA", "treatment", "Hair Clinic Treatment (منتج توضيحي)", "علاج إيفا هير كلينك (منتج توضيحي)", "300 مل", 29, "bottle", ["damage"], null, true],
  ["BOBANA", "curly", "Curly Hair Cream (منتج توضيحي)", "كريم بوبانا للكيرلي (منتج توضيحي)", "200 مل", 35, "jar", ["curls"], null, true],
  ["THE HAIR ADDICT", "oil", "Hair Oil (منتج توضيحي)", "زيت ذا هير أديكت (منتج توضيحي)", "100 مل", 45, "dropper", ["hairfall"], null, true],
  ["LES KARITES", "mask", "Shea Butter Hair Mask (منتج توضيحي)", "ماسك ليه كاريتيه بزبدة الشيا (منتج توضيحي)", "250 مل", 49, "jar", ["dryness"], null, true],
  ["HERBAL SENSATION", "shampoo", "Herbal Shampoo (منتج توضيحي)", "شامبو هيربال سنسيشن (منتج توضيحي)", "300 مل", 29, "bottle", [], null, true],
  ["EVA", "moisturizer", "Skin Clinic Cream (منتج توضيحي)", "كريم إيفا سكن كلينك (منتج توضيحي)", "50 مل", 29, "jar", ["dryness"], null, true],
  ["BOBANA", "cleanser", "Face Wash (منتج توضيحي)", "غسول بوبانا للوجه (منتج توضيحي)", "150 مل", 29, "tube", [], null, true],
  ["DERMACY", "serum", "Face Serum (منتج توضيحي)", "سيروم ديرماسي للوجه (منتج توضيحي)", "30 مل", 45, "dropper", ["pigment"], null, true],
  ["NUT BOTANICALS", "moisturizer", "Botanical Cream (منتج توضيحي)", "كريم نت بوتانيكالز (منتج توضيحي)", "50 مل", 49, "jar", ["dryness"], null, true],
  ["INFINITY", "cleanser", "Face Cleanser (منتج توضيحي)", "غسول إنفينيتي للوجه (منتج توضيحي)", "150 مل", 29, "tube", [], null, true],
  // ---------------- ماركات تجارية ----------------
  ["PANTENE", "shampoo", "Pro-V Repair & Protect Shampoo", "شامبو بانتين برو في للإصلاح", "400 مل", 29, "bottle", ["damage"]],
  ["DOVE", "shampoo", "Intensive Repair Shampoo", "شامبو دوف للإصلاح المكثف", "400 مل", 25, "bottle", ["damage"]],
  ["SUNSILK", "conditioner", "Soft & Smooth Conditioner", "بلسم صانسيلك للنعومة", "350 مل", 19, "bottle", ["frizz"]],
  ["SCHWARZKOPF GLISS", "shampoo", "Gliss Ultimate Repair Shampoo", "شامبو شوارزكوف جليس ألتيميت ريبير", "400 مل", 29, "bottle", ["damage"]],
  ["SYOSS", "conditioner", "Keratin Conditioner", "بلسم سيوس بالكيراتين", "500 مل", 29, "bottle", ["damage"]],
  ["NIVEA", "moisturizer", "Soft Moisturising Cream", "كريم نيفيا سوفت المرطب", "100 مل", 19, "jar", ["dryness"]],
  ["EUCERIN", "spf", "Sun Oil Control Gel-Cream SPF50+", "واقي يوسيرين أويل كنترول", "50 مل", 99, "tube", ["oil", "acne"]],
  ["EUCERIN", "serum", "Hyaluron-Filler Serum", "سيروم يوسيرين هيالورون فيلر", "30 مل", 179, "dropper", ["dryness"]],
  // ---------------- موس، حماية من الحرارة، وسيروم الشعر ----------------
  ["CANTU", "mousse", "Shea Butter Wave Whip Curling Mousse", "موس كانتو ويف ويب للكيرلي", "248 مل", 45, "spray", ["curls", "frizz"]],
  ["SHEAMOISTURE", "mousse", "Coconut & Hibiscus Frizz-Free Curl Mousse", "موس شيا مويستشر للكيرلي ضد الهيشان", "213 مل", 65, "spray", ["curls", "frizz"]],
  ["LIVING PROOF", "mousse", "Full Thickening Mousse", "موس ليفينغ بروف لكثافة الشعر الخفيف", "149 غ", 139, "spray", ["shine"]],
  ["KÉRASTASE", "heat", "Résistance Ciment Thermique", "كريم كيراستاس سيمنت ثيرميك للحماية من الحرارة", "150 مل", 165, "tube", ["heat", "damage"]],
  ["L'ORÉAL PROFESSIONNEL", "heat", "Absolut Repair 10-in-1 Spray", "بخاخ لوريال بروفيشنال أبسولوت ريبير 10 في 1", "190 مل", 99, "spray", ["heat", "damage"]],
  ["OLAPLEX", "heat", "No.9 Bond Protector Nourishing Hair Serum", "سيروم أولابلكس رقم 9 للحماية من الحرارة", "90 مل", 129, "pump", ["heat", "frizz", "shine"]],
  ["THE ORDINARY", "hairserum", "Multi-Peptide Serum for Hair Density", "سيروم ذا أوردينري للكثافة", "60 مل", 79, "dropper", ["hairfall"]],
  ["KÉRASTASE", "hairserum", "Genesis Sérum Anti-Chute Fortifiant", "سيروم كيراستاس جينيسيس ضد التساقط", "90 مل", 249, "dropper", ["hairfall"]],
  // ---------------- شامبو وبلسم للشعر الكيرلي (بدون كبريتات) ----------------
  ["CANTU", "shampoo", "Shea Butter Sulfate-Free Cleansing Cream Shampoo", "شامبو كانتو الكريمي بدون كبريتات للكيرلي", "400 مل", 45, "bottle", ["curls", "dryness"]],
  ["BOUCLÈME", "shampoo", "Curl Cleanser", "شامبو بوكليم للكيرلي", "300 مل", 99, "pump", ["curls", "dryness"]],
  ["OGX", "shampoo", "Quenching + Coconut Curls Shampoo", "شامبو أو جي إكس بجوز الهند للكيرلي", "385 مل", 45, "bottle", ["curls", "frizz"]],
  ["NOT YOUR MOTHER'S", "shampoo", "Curl Talk Shampoo", "شامبو نوت يور ماذرز كيرل توك", "355 مل", 49, "bottle", ["curls"]],
  ["KINKY-CURLY", "shampoo", "Come Clean Natural Moisturizing Shampoo", "شامبو كينكي كيرلي كم كلين المرطب", "236 مل", 69, "bottle", ["curls", "dryness"]],
  ["PATTERN", "shampoo", "Hydration Shampoo", "شامبو باترن للترطيب", "295 مل", 109, "bottle", ["curls", "dryness"]],
  ["SHEAMOISTURE", "shampoo", "Manuka Honey & Mafura Oil Intensive Hydration Shampoo", "شامبو شيا مويستشر بعسل المانوكا للترطيب المكثف", "384 مل", 59, "bottle", ["dryness", "curls"]],
  ["CANTU", "conditioner", "Shea Butter Hydrating Cream Conditioner", "بلسم كانتو الكريمي المرطب", "400 مل", 45, "bottle", ["curls", "dryness"]],
  ["OGX", "conditioner", "Quenching + Coconut Curls Conditioner", "بلسم أو جي إكس بجوز الهند للكيرلي", "385 مل", 45, "bottle", ["curls", "frizz"]],
  ["BOUCLÈME", "conditioner", "Curl Conditioner", "بلسم بوكليم للكيرلي", "300 مل", 99, "pump", ["curls", "dryness"]],
  ["NOT YOUR MOTHER'S", "conditioner", "Curl Talk Conditioner", "بلسم نوت يور ماذرز كيرل توك", "355 مل", 49, "bottle", ["curls"]],
  ["SHEAMOISTURE", "conditioner", "Coconut & Hibiscus Curl & Shine Conditioner", "بلسم شيا مويستشر للكيرلي واللمعان", "384 مل", 59, "bottle", ["curls", "frizz"]],
  // ---------------- القشرة وحكة الفروة ----------------
  ["NIZORAL", "shampoo", "Anti-Dandruff Shampoo (Ketoconazole 2%)", "شامبو نيزورال ضد القشرة بالكيتوكونازول", "100 مل", 69, "bottle", ["dandruff"]],
  ["VICHY", "shampoo", "Dercos Anti-Dandruff DS Shampoo", "شامبو فيشي ديركوس ضد القشرة", "200 مل", 99, "bottle", ["dandruff", "oilyScalp"]],
  ["LA ROCHE-POSAY", "shampoo", "Kerium DS Intensive Anti-Dandruff Shampoo", "شامبو لاروش بوزيه كيريوم DS المكثف ضد القشرة", "125 مل", 89, "bottle", ["dandruff", "sensitiveScalp"]],
  ["DUCRAY", "shampoo", "Kelual DS Anti-Dandruff Shampoo", "شامبو دوكراي كيلوال DS ضد القشرة", "100 مل", 95, "tube", ["dandruff", "sensitiveScalp"]],
  ["BIODERMA", "shampoo", "Nodé DS+ Anti-Recurrence Shampoo", "شامبو بيوديرما نودي DS+ ضد رجوع القشرة", "125 مل", 85, "bottle", ["dandruff"]],
  ["NEUTROGENA", "shampoo", "T/Gel Therapeutic Shampoo", "شامبو نيوتروجينا تي/جل العلاجي", "250 مل", 79, "bottle", ["dandruff"]],
  ["SELSUN BLUE", "shampoo", "Medicated Anti-Dandruff Shampoo", "شامبو سيلسن بلو العلاجي ضد القشرة", "200 مل", 49, "bottle", ["dandruff", "oilyScalp"]],
  ["SEBAMED", "shampoo", "Anti-Dandruff Shampoo", "شامبو سيباميد ضد القشرة", "200 مل", 55, "bottle", ["dandruff", "sensitiveScalp"]],
  ["HEAD & SHOULDERS", "shampoo", "Itchy Scalp Care Anti-Dandruff Shampoo", "شامبو هيد آند شولدرز لحكة الفروة", "400 مل", 32, "bottle", ["dandruff", "sensitiveScalp"]],
  ["رؤى الطبيعة", "serum", "Licorice Serum", "سيروم رؤى الطبيعة بعرق السوس", "30 مل", 79, "dropper", ["pigment", "marks", "glow"]],
  ["رؤى الطبيعة", "serum", "Vitamin C Serum", "سيروم رؤى الطبيعة بفيتامين سي", "30 مل", 79, "dropper", ["glow", "pigment"]],
  ["رؤى الطبيعة", "shampoo", "Garlic & Rosemary Shampoo", "شامبو رؤى الطبيعة بالثوم والروزماري", "300 مل", 55, "bottle", ["hairfall", "oilyScalp"]],
  ["رؤى الطبيعة", "shampoo", "Ten Herbs Shampoo", "شامبو رؤى الطبيعة بالأعشاب العشرة", "300 مل", 55, "bottle", ["hairfall", "shine"]],
  ["WRD", "shampoo", "Rice Bran Shampoo Bar", "شامبو بار ورد بنخالة الأرز", "100 غ", 45, "box", ["shine", "dryness"]],
  ["WRD", "shampoo", "Hasawi Lime Shampoo Bar", "شامبو بار ورد باللومي الحساوي", "100 غ", 45, "box", ["oilyScalp"]],
  ["WRD", "hairserum", "WRD Hair Serum", "سيروم ورد لكثافة الشعر", "50 مل", 100, "dropper", ["hairfall"]],
  ["EPII", "moisturizer", "Double Up Cream Ectoin & Panthenol", "كريم إيبي دبل أب بالإكتوين والبانثينول", "50 مل", 99, "jar", ["barrier", "dryness", "redness"]],
  ["EPII", "treatment", "New Skin Toner Snow Mushroom & PHA", "تونر إيبي نيو سكن بفطر الثلج وPHA 5% والهيالورونيك والبانثينول", "145 مل", 85, "bottle", ["glow", "dryness", "barrier"]],
  ["EPII", "moisturizer", "Double Up Cream NAD+ NMN & TXA", "كريم إيبي دبل أب بالـ NAD+ والترانيكساميك للنضارة", "50 مل", 99, "tube", ["glow", "pigment", "marks"]],
  ["THE ORDINARY", "serum", "Azelaic Acid Suspension 10%", "كريم ذا أوردينري أزيليك أسيد 10%", "30 مل", 55, "tube", ["redness", "pigment", "acne", "marks"]],
  ["PAULA'S CHOICE", "serum", "10% Azelaic Acid Booster", "بوستر بولاز تشويس أزيليك أسيد 10%", "30 مل", 159, "tube", ["redness", "pigment", "acne"]],
  ["THE ORDINARY", "treatment", "Salicylic Acid 2% Solution", "محلول ذا أوردينري ساليسيليك أسيد 2%", "30 مل", 45, "dropper", ["acne", "pores", "oil"]],
  ["COSRX", "treatment", "BHA Blackhead Power Liquid", "تونر كوسركس BHA للرؤوس السوداء", "100 مل", 85, "bottle", ["acne", "pores", "oil"]],
  ["CERAVE", "cleanser", "SA Smoothing Cleanser", "غسول سيرافي SA بحمض الساليسيليك", "236 مل", 75, "pump", ["acne", "pores", "dryness"]],
  ["LA ROCHE-POSAY", "cleanser", "Effaclar Micro-Peeling Purifying Gel", "غسول لاروش بوزيه إيفاكلار مايكرو بيلنج", "200 مل", 85, "tube", ["acne", "oil", "pores"]],
  ["CERAVE", "cleanser", "Acne Foaming Cream Cleanser (Benzoyl Peroxide 4%)", "غسول سيرافي للحبوب ببنزويل بيروكسايد 4%", "150 مل", 79, "tube", ["acne", "hormonal"]],
  ["PANOXYL", "cleanser", "Acne Foaming Wash Benzoyl Peroxide 10%", "غسول بانوكسيل للحبوب ببنزويل بيروكسايد 10%", "156 غ", 65, "tube", ["acne", "hormonal"]],
  ["THE ORDINARY", "serum", "Retinol 0.5% in Squalane", "ريتينول ذا أوردينري 0.5% بالسكوالين", "30 مل", 45, "dropper", ["marks", "pores", "pigment"]],
  ["CERAVE", "serum", "Resurfacing Retinol Serum", "سيروم سيرافي بالريتينول لتجديد البشرة", "30 مل", 99, "dropper", ["marks", "pores"]],
  ["LA ROCHE-POSAY", "serum", "Retinol B3 Serum", "سيروم لاروش بوزيه ريتينول B3", "30 مل", 199, "dropper", ["marks", "pigment"]],
  ["PAULA'S CHOICE", "treatment", "8% AHA Gel Exfoliant", "مقشر بولاز تشويس AHA 8%", "100 مل", 159, "tube", ["pigment", "glow", "pores"]],
  ["THE ORDINARY", "serum", "Alpha Arbutin 2% + HA", "سيروم ذا أوردينري ألفا أربوتين 2%", "30 مل", 45, "dropper", ["pigment", "marks"]],
  ["LA ROCHE-POSAY", "serum", "Pure Vitamin C10 Serum", "سيروم لاروش بوزيه فيتامين C10", "30 مل", 229, "dropper", ["pigment", "glow"]],
  ["THE ORDINARY", "serum", "Ascorbyl Glucoside Solution 12%", "سيروم ذا أوردينري فيتامين سي 12%", "30 مل", 55, "dropper", ["glow", "pigment"]],
  ["GARNIER", "serum", "Bright Complete Vitamin C Serum", "سيروم غارنييه برايت كومبليت بفيتامين سي", "30 مل", 45, "dropper", ["glow", "pigment", "marks"]],
  ["LA ROCHE-POSAY", "serum", "Hyalu B5 Serum", "سيروم لاروش بوزيه هيالو B5", "30 مل", 199, "dropper", ["dryness", "barrier", "glow"]],
  ["CERAVE", "serum", "Hydrating Hyaluronic Acid Serum", "سيروم سيرافي المرطب بالهيالورونيك", "30 مل", 89, "dropper", ["dryness", "barrier"]],
  ["LA ROCHE-POSAY", "moisturizer", "Cicaplast Baume B5+", "بلسم لاروش بوزيه سيكابلاست B5+", "40 مل", 75, "tube", ["barrier", "redness", "dryness"]],
  ["BEAUTY OF JOSEON", "serum", "Glow Serum: Propolis + Niacinamide", "سيروم بيوتي أوف جوسون قلو بالبروبوليس", "30 مل", 79, "dropper", ["glow", "acne"]],
  ["BEAUTY OF JOSEON", "serum", "Glow Deep Serum: Rice + Alpha-Arbutin", "سيروم بيوتي أوف جوسون قلو ديب بالأرز والأربوتين", "30 مل", 79, "dropper", ["pigment", "glow"]],
  ["BEAUTY OF JOSEON", "moisturizer", "Dynasty Cream", "كريم بيوتي أوف جوسون ديناستي", "50 مل", 89, "jar", ["dryness", "glow"]],
  ["LANEIGE", "moisturizer", "Water Bank Blue Hyaluronic Cream", "كريم لانيج ووتر بانك بالهيالورونيك", "50 مل", 159, "jar", ["dryness", "glow"]],
  ["TORRIDEN", "moisturizer", "DIVE-IN Soothing Cream", "كريم توريدن دايف إن المهدئ", "100 مل", 89, "jar", ["dryness", "redness"]],
  ["ANUA", "serum", "Niacinamide 10% + TXA 4% Serum", "سيروم أنوا نياسيناميد 10% مع ترانيكساميك 4%", "30 مل", 89, "dropper", ["pigment", "marks", "glow"]],
  ["ANUA", "cleanser", "Heartleaf Pore Control Cleansing Oil", "زيت أنوا هارتليف المنظف للمسام", "200 مل", 89, "pump", ["pores", "acne"]],
  ["GOODAL", "serum", "Green Tangerine Vita C Dark Spot Care Serum", "سيروم قودال باليوسفي الأخضر وفيتامين سي", "40 مل", 99, "dropper", ["pigment", "glow", "marks"]],
  ["ROUND LAB", "treatment", "1025 Dokdo Toner", "تونر راوند لاب دوكدو", "200 مل", 79, "bottle", ["dryness", "pores"]],
  ["ROUND LAB", "spf", "Birch Juice Moisturizing Sunscreen SPF45", "واقي راوند لاب بعصارة البتولا", "50 مل", 75, "tube", ["dryness"]],
  ["SKIN1004", "spf", "Madagascar Centella Hyalu-Cica Water-Fit Sun Serum", "واقي سكن1004 سنتيلا هيالو سيكا", "50 مل", 79, "tube", ["redness", "dryness"]],
  ["SKIN1004", "treatment", "Madagascar Centella Toning Toner", "تونر سكن1004 سنتيلا المقشر اللطيف", "210 مل", 79, "bottle", ["redness", "pores"]],
  ["SOME BY MI", "serum", "AHA BHA PHA 30 Days Miracle Serum", "سيروم سم باي مي ميراكل", "50 مل", 89, "dropper", ["acne", "pores"]],
  ["KLAIRS", "treatment", "Supple Preparation Facial Toner", "تونر كليرز سابل بريبريشن", "180 مل", 85, "bottle", ["dryness", "redness"]],
  ["KLAIRS", "moisturizer", "Midnight Blue Calming Cream", "كريم كليرز ميدنايت بلو المهدئ", "30 مل", 89, "jar", ["redness", "barrier"]],
  ["COSRX", "moisturizer", "Advanced Snail 92 All in One Cream", "كريم كوسركس بالحلزون 92", "100 غ", 89, "jar", ["dryness", "barrier"]],
  ["CENTELLIAN24", "moisturizer", "Madeca Cream Time Reverse", "كريم سنتيليان24 ماديكا تايم ريفيرس", "50 مل", 139, "jar", ["barrier", "dryness"]],
  ["CENTELLIAN24", "spf", "Madeca Derma Shield Safe Moisture Sun Cream", "واقي سنتيليان24 ماديكا ديرما شيلد", "50 مل", 89, "tube", ["redness", "dryness"]],
  ["MEDICUBE", "treatment", "Collagen Night Wrapping Mask", "ماسك ميديكيوب الليلي بالكولاجين", "75 مل", 109, "jar", ["dryness", "glow"]],
  ["PURITO SEOUL", "spf", "Daily Go-To Sunscreen", "واقي بوريتو سيول اليومي", "60 مل", 75, "tube", ["dryness"]],
  ["DR. ALTHEA", "moisturizer", "147 Barrier Cream", "كريم دكتور ألثيا 147 للحاجز", "50 مل", 99, "jar", ["barrier", "dryness"]],
  ["AVÈNE", "cleanser", "Cleanance Cleansing Gel", "غسول أفين كلينانس", "200 مل", 69, "tube", ["acne", "oil"]],
  ["SVR", "serum", "Sebiaclear Serum", "سيروم إس في آر سيبياكلير", "30 مل", 119, "dropper", ["acne", "marks"]],
  ["MIELLE", "shampoo", "Rosemary Mint Strengthening Shampoo", "شامبو ميلي بالروزماري والنعناع", "355 مل", 59, "bottle", ["hairfall", "oilyScalp"]],
  ["MIELLE", "conditioner", "Rosemary Mint Strengthening Conditioner", "بلسم ميلي بالروزماري والنعناع", "355 مل", 59, "bottle", ["hairfall"]],
  ["MIELLE", "curly", "Pomegranate & Honey Curl Smoothie", "كريم ميلي بالرمان والعسل للكيرلي", "340 غ", 69, "jar", ["curls", "dryness"]],
  ["K18", "shampoo", "Peptide Prep pH Maintenance Shampoo", "شامبو K18 للحفاظ على توازن الشعر", "250 مل", 149, "bottle", ["damage"]],
  ["COLOR WOW", "shampoo", "Color Security Shampoo", "شامبو كلر واو للشعر المصبوغ", "250 مل", 109, "bottle", ["damage"]],
  ["REDKEN", "shampoo", "All Soft Shampoo", "شامبو ريدكن أول سوفت للشعر الجاف", "300 مل", 99, "bottle", ["dryness", "frizz"]],
  ["REDKEN", "shampoo", "Acidic Bonding Concentrate Shampoo", "شامبو ريدكن أسيديك بوندنغ", "300 مل", 129, "bottle", ["damage"]],
  ["GIOVANNI", "shampoo", "Tea Tree Triple Treat Invigorating Shampoo", "شامبو جيوفاني بشجرة الشاي", "250 مل", 55, "bottle", ["oilyScalp", "dandruff"]],
  ["AS I AM", "curly", "Curling Jelly", "جل آز آي آم كيرلنغ جيلي", "227 غ", 59, "jar", ["curls", "frizz"]],
  ["L'ORÉAL PARIS ELVIVE", "curly", "Dream Lengths No Haircut Cream Leave-In", "كريم إلفيف دريم لينثس بدون شطف", "200 مل", 39, "tube", ["damage", "frizz"]],
  ["IUNIK", "serum", "Beta-Glucan Power Moisture Serum", "سيروم آيونيك بيتا جلوكان للترطيب والتهدئة", "50 مل", 79, "dropper", ["dryness", "redness", "glow"]],
  ["CENTELLIAN24", "moisturizer", "Expert Madeca Cream Active Renew PDRN", "كريم سنتيليان24 إكسبرت ماديكا بالـ PDRN للتجديد", "50 مل", 149, "tube", ["barrier", "glow", "dryness"]],
  ["NUMBUZIN", "serum", "No.5+ Vitamin Concentrated Serum", "سيروم نمبوزين رقم 5+ بفيتامين سي والنياسيناميد والجلوتاثيون", "30 مل", 99, "dropper", ["pigment", "marks", "glow"]],
  ["EQQUALBERRY", "treatment", "Swimming Pool Moisture Exfoliating Toner", "تونر إيكوالبيري سويمنق بول المقشر المرطب بالهيالورونيك والبانثينول", "155 مل", 79, "bottle", ["dryness", "glow", "pores"]],
  // ---------------- علامات التقدم بالعمر ----------------
  ["THE ORDINARY", "serum", "Multi-Peptide + HA Serum (Buffet)", "سيروم ذا أوردينري بافيه بالببتيدات والهيالورونيك", "30 مل", 69, "dropper", ["aging", "dryness"]],
  ["THE ORDINARY", "serum", "Argireline Solution 10%", "محلول ذا أوردينري أرجيرلين 10% (ببتيد) للخطوط", "30 مل", 39, "dropper", ["aging"]],
  ["NEUTROGENA", "moisturizer", "Rapid Wrinkle Repair Retinol Regenerating Cream", "كريم نيوتروجينا رابيد رينكل ريبير بالريتينول", "48 غ", 99, "jar", ["aging", "marks"]],
  ["VICHY", "serum", "Liftactiv H.A. Epidermic Filler", "سيروم فيشي ليفت أكتيف بالهيالورونيك المالئ", "30 مل", 199, "dropper", ["aging", "dryness"]],
  ["CENTELLIAN24", "serum", "Lifting Peptide Serum", "سيروم سنتيليان24 ليفتنق بالببتيدات", "30 مل", 129, "dropper", ["aging"]],
  ["OLAY", "serum", "Regenerist Retinol 24 Night Serum", "سيروم أولاي ريجينيرست ريتينول 24 الليلي", "30 مل", 129, "dropper", ["aging", "marks"]],
  ["PAULA'S CHOICE", "serum", "Clinical 1% Retinol Treatment", "علاج بولاز تشويس كلينيكال ريتينول 1%", "30 مل", 229, "tube", ["aging", "marks", "pores"]],
  ["BEAUTY OF JOSEON", "serum", "Revive Serum: Ginseng + Snail Mucin", "سيروم بيوتي أوف جوسون ريفايف بالجينسنغ والحلزون", "30 مل", 79, "dropper", ["aging", "glow"]],
  // ---------------- الهالات وتحت العين ----------------
  ["THE ORDINARY", "eye", "Caffeine Solution 5% + EGCG", "سيروم ذا أوردينري للعين بالكافيين 5%", "30 مل", 39, "dropper", ["eyes"]],
  ["BEAUTY OF JOSEON", "eye", "Revive Eye Serum: Ginseng + Retinal", "سيروم بيوتي أوف جوسون ريفايف للعين بالريتينال", "30 مل", 79, "tube", ["eyes", "aging"]],
  ["CENTELLIAN24", "eye", "360 Shot PDRN Lifting Eye Cream", "كريم العين سنتيليان24 بالـ PDRN", "30 مل", 129, "tube", ["eyes", "aging"]],
  ["CLINIQUE", "eye", "All About Eyes", "كريم العين كلينيك أول أباوت آيز", "15 مل", 159, "jar", ["eyes"]],
  ["ESTÉE LAUDER", "eye", "Advanced Night Repair Eye Supercharged Gel-Creme", "جل كريم العين إستي لودر أدفانسد نايت ريبير", "15 مل", 249, "jar", ["eyes", "aging"]],
  ["NEUTROGENA", "eye", "Hydro Boost Eye Gel-Cream", "جل كريم العين نيوتروجينا هايدرو بوست", "15 مل", 79, "tube", ["eyes", "dryness"]],
  // ---------------- أطراف الشعر المتقصفة ----------------
  ["L'ORÉAL PROFESSIONNEL", "oil", "Absolut Repair 10-in-1 Oil", "زيت لوريال بروفيشنال أبسولوت ريبير 10 في 1 للأطراف", "90 مل", 119, "pump", ["splitEnds", "damage", "shine"]]
];
const STEP_OF = { shampoo: "shampoo", conditioner: "conditioner", mask: "mask", oil: "oil", hairserum: "oil", treatment: "treatment", styling: "styler", mousse: "styler", heat: "protect", curly: "styler",
  cleanser: "cleanser", moisturizer: "moisturizer", serum: "serum", spf: "spf", eye: "eye" };
const CATEGORY_DESC = {
  shampoo: "شامبو ينظف الشعر وفروة الرأس.", conditioner: "بلسم يرطب الشعر ويسهل تسريحه.", mask: "ماسك عناية مكثفة مرة أو مرتين بالأسبوع.",
  oil: "زيت أو سيروم يعطي الشعر لمعة ونعومة.", treatment: "علاج عناية مركّز.", styling: "منتج تصفيف للشعر.", heat: "يحمي الشعر من حرارة الاستشوار والمكواة.", mousse: "موس خفيف يعرّف التموجات ويعطي الشعر حجم بدون ثقل.", hairserum: "سيروم للشعر أو الفروة يعالج مشكلة محددة.",
  curly: "منتج مخصص للشعر الكيرلي والكِنكي: ترطيب وتعريف للتموجات.", cleanser: "غسول ينظف البشرة.", moisturizer: "مرطب يحافظ على رطوبة البشرة.",
  serum: "سيروم مركّز يعالج مشكلة محددة.", eye: "عناية لمنطقة تحت العين: الهالات والانتفاخ والخطوط.", spf: "واقي شمس للحماية اليومية من الأشعة."
};
const HAIR_CATS = Object.keys(CATEGORIES.hair);
let shopSeq = 0;
for (const r of SHOP_ROWS) {
  const [brand, category, nameEn, name, size, price, shape, goodFor, colors, demo] = r;
  const b = SHOP_BRANDS[brand];
  const cat = HAIR_CATS.includes(category) && !(category === "treatment" && ["SANA", "MEISHOKU", "ISHIZAWA LAB", "PDC", "LION PAIR", "MEDICUBE", "ABIB", "HARUHARU WONDER", "SUMMER FRIDAYS", "VASELINE", "THE ORDINARY", "CERAVE", "AVÈNE", "CAUDALIE", "NUXE", "EPII", "COSRX", "PAULA'S CHOICE", "ROUND LAB", "SKIN1004", "KLAIRS", "EQQUALBERRY"].includes(brand)) ? "hair" : "skin";
  const [body, cap, accent] = colors || [b[1], b[2], b[3]];
  const id = "x" + String(++shopSeq).padStart(3, "0");
  PRODUCTS.push({
    id, cat, step: STEP_OF[category], category, brand, country: COUNTRIES[b[0]], nameEn, name, size, price,
    suits: cat === "skin" ? ["dry", "oily", "combo", "normal", "sensitive"] : ["dry", "oily", "curly", "damaged", "normal"],
    contains: [], kitEligible: false, demo: !!demo, shopGoodFor: goodFor,
    desc: (demo ? `منتج من البراند المحلي ${brand} (${COUNTRIES[b[0]].replace(/^\S+ /, "")}). اسم المنتج توضيحي ويتعدل من لوحة الإدارة. ` : "") + CATEGORY_DESC[category],
    pack: { shape, body, cap, accent, clear: ["bottle", "dropper"].includes(shape) && /^#F|^#E/.test(body) && !demo && ["serum", "oil"].includes(category) }
  });
}
/* ---------- المكونات الفعالة ----------
   نطلعها من اسم المنتج ووصفه، عشان المتجر يعرض الحلول حسب المكوّن (مثل الساليسيليك والأزيليك). */
const ACTIVES = {
  salicylic:   { name: "حمض الساليسيليك (BHA)", for: "الحبوب والرؤوس السوداء والمسام", re: /salicylic|\bbha\b|الساليسيليك/i, cat: "skin" },
  azelaic:     { name: "حمض الأزيليك", for: "الاحمرار والحبوب والتصبغات", re: /azelaic|أزيليك/i, cat: "skin" },
  bpo:         { name: "بنزويل بيروكسايد", for: "الحبوب الملتهبة", re: /benzoyl|بنزويل/i, cat: "skin" },
  niacinamide: { name: "النياسيناميد", for: "الدهون والمسام والآثار", re: /niacinamide|النياسيناميد/i, cat: "skin" },
  retinol:     { name: "الريتينول", for: "الآثار والمسام وتجديد البشرة", re: /retinol|retinal|الريتينول/i, cat: "skin" },
  vitaminC:    { name: "فيتامين C", for: "النضارة والتصبغات", re: /vitamin c|vita c|vitamin drop|ascorb|\bc10\b|anti-spot|فيتامين c|فيتامين سي/i, cat: "skin" },
  aha:         { name: "أحماض AHA (جلايكوليك ولاكتيك)", for: "التصبغات والملمس والنضارة", re: /glycolic|\baha\b|lactic|mandelic|الجلايكوليك/i, cat: "skin" },
  arbutin:     { name: "ألفا أربوتين وترانيكساميك", for: "الكلف والتصبغات", re: /arbutin|tranexamic|\btxa\b|أربوتين|ترانيكساميك/i, cat: "skin" },
  hyaluronic:  { name: "حمض الهيالورونيك", for: "الترطيب والامتلاء", re: /hyalur|hyalu|الهيالورونيك/i, cat: "skin" },
  ceramide:    { name: "السيراميد", for: "ترميم الحاجز والجفاف", re: /ceramide|السيراميد/i, cat: "skin" },
  centella:    { name: "السنتيلا (سيكا)", for: "التهدئة والاحمرار", re: /centella|cica|madeca|السنتيلا/i, cat: "skin" },
  peptides:    { name: "الببتيدات", for: "الخطوط وشد البشرة", re: /peptide|argireline|buffet|ببتيد/i, cat: "skin" },
  pha:         { name: "أحماض PHA", for: "تقشير لطيف للبشرة الحساسة", re: /\bpha\b/i, cat: "skin" },
  ectoin:      { name: "الإكتوين", for: "حماية الحاجز من الحرارة والتلوث", re: /ectoin|إكتوين/i, cat: "skin" },
  panthenol:   { name: "البانثينول (B5)", for: "التهدئة وترميم الحاجز", re: /panthenol|\bb5\b|بانثينول/i, cat: "skin" },
  sulfur:      { name: "الكبريت", for: "الحبوب والحبوب الفطرية", re: /sulfur|sulphur|drying lotion|الكبريت/i, cat: "skin" },
  caffeine:    { name: "الكافيين", for: "انتفاخ وهالات العين", re: /caffeine|الكافيين/i, cat: "skin" },
  pdrn:        { name: "PDRN", for: "التجديد والنضارة", re: /pdrn/i, cat: "skin" },
  ketoconazole:{ name: "كيتوكونازول", for: "القشرة العنيدة", re: /ketoconazole|كيتوكونازول/i, cat: "hair" },
  rosemary:    { name: "الروزماري", for: "تساقط الشعر", re: /rosemary|الروزماري/i, cat: "hair" }
};
const activesOf = p => Object.keys(ACTIVES).filter(k => ACTIVES[k].cat === p.cat && ACTIVES[k].re.test((p.nameEn || "") + " " + (p.name || "") + " " + (p.desc || "")));

/* المنتجات التوضيحية (أسماء غير حقيقية) مخفية من المتجر والتوصيات، وتبقى بأرقامها عشان الطلبات القديمة */
PRODUCTS.forEach(p => { if (p.demo) p.active = false; });
/* قسم المتجر لمنتجات الروتينات (عشان تظهر في المتجر بعد) */
const STEP_TO_CATEGORY = { cleanser: "cleanser", toner: "treatment", serum: "serum", moisturizer: "moisturizer", spf: "spf", treatment: "treatment", exfoliant: "treatment",
  shampoo: "shampoo", conditioner: "conditioner", oil: "oil", scalp: "treatment", styler: "styling", protect: "heat" };
PRODUCTS.forEach(p => {
  if (!p.category) p.category = p.step === "mask" ? (p.cat === "hair" ? "mask" : "treatment") : p.id === "h11" ? "curly" : STEP_TO_CATEGORY[p.step] || "treatment";
});

/* منتجات المتجر: "مناسب لـ" + رابط ريفيوهات تيك توك */
PRODUCTS.forEach(p => {
  if (p.kitEligible !== false) return;
  p.goodFor = p.shopGoodFor || []; p.fungal = null; delete p.shopGoodFor;
  p.tiktok = "https://www.tiktok.com/search?q=" + encodeURIComponent(p.demo ? `${p.brand} ${p.cat === "hair" ? "hair" : "skincare"} review` : `${p.brand} ${p.nameEn} review`);
});


/* ---------- الاستشارات ----------
   أسماء الطبيبات توضيحية لأغراض المشروع. */
const DOCTORS = [
  { id: "d1", name: "د. نورة (اسم توضيحي)", title: "استشارية جلدية وتجميل", focus: "الحبوب بأنواعها، الهرمونية والفطرية، والتصبغات", years: 12, langs: "العربية، الإنجليزية", color: "#E3ECE4" },
  { id: "d2", name: "د. ريم (اسم توضيحي)", title: "أخصائية أمراض جلدية", focus: "البشرة الحساسة والإكزيما والوردية", years: 8, langs: "العربية", color: "#F2D4D2" },
  { id: "d3", name: "د. هيا (اسم توضيحي)", title: "أخصائية الشعر وفروة الرأس", focus: "تساقط الشعر، الفروة الدهنية والقشرة، الشعر التالف", years: 10, langs: "العربية، الإنجليزية", color: "#E4E0EF" }
];
const CONSULT_TYPES = {
  chat:  { name: "استشارة كتابية", desc: "محادثة مع الطبيبة خلال 24 ساعة، مع إرفاق صور", price: 79, minutes: 0 },
  video: { name: "استشارة فيديو", desc: "مكالمة فيديو 20 دقيقة في الموعد اللي تختارينه", price: 149, minutes: 20 }
};
const CONSULT_TIMES = ["17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00"];

/* ---------- المشاكل وحلولها في المتجر ----------
   لكل مشكلة: ترشيح رينورا (الأفضل) مع السبب، والروتين المتكامل اللي يعالجها. */
const PROBLEMS = {
  skin: {
    acne:     { name: "حبوب ورؤوس سوداء", kit: "k-acne" },
    hormonal: { name: "حبوب هرمونية", kit: "k-acne", consult: true },
    fungal:   { name: "حبوب فطرية", kit: "k-acne", consult: true },
    marks:    { name: "آثار الحبوب", kit: "k-bright" },
    pigment:  { name: "تصبغات وكلف", kit: "k-bright" },
    dryness:  { name: "جفاف البشرة", kit: "k-dry" },
    glow:     { name: "بهتان ونقص نضارة", kit: "k-glow" },
    aging:    { name: "تجاعيد وعلامات تقدم العمر", kit: "k-age" },
    eyes:     { name: "هالات وتحت العين", kit: "k-age" },
    oil:      { name: "دهون ولمعان", kit: "k-oily" },
    pores:    { name: "مسام واسعة", kit: "k-oily" },
    redness:  { name: "احمرار وتحسس", kit: "k-sensitive" },
    barrier:  { name: "ضعف حاجز البشرة", kit: "k-sensitive" }
  },
  hair: {
    dryness:        { name: "شعر جاف", kit: "h-dry" },
    damage:         { name: "شعر تالف ومصبوغ", kit: "h-damaged" },
    splitEnds:      { name: "أطراف متقصفة", kit: "h-damaged" },
    frizz:          { name: "هيشان", kit: "h-dry" },
    curls:          { name: "كيرلي وكِنكي", kit: "h-curly" },
    shine:          { name: "شعر باهت بدون لمعة", kit: "h-dry" },
    heat:           { name: "تلف من الحرارة", kit: "h-damaged" },
    oilyScalp:      { name: "فروة دهنية", kit: "h-oily" },
    hairfall:       { name: "تساقط الشعر", kit: "h-oily", consult: true },
    sensitiveScalp: { name: "فروة حساسة", kit: "h-normal" },
    dandruff:       { name: "قشرة وحكة", kit: "h-oily" }
  }
};
const BEST_PICKS = {
  "skin:acne":     ["PAULA'S CHOICE", "2% BHA", "حمض الساليسيليك 2% يدخل المسام وينظفها من الداخل، ومن أكثر المنتجات اللي عليها ريفيوهات للحبوب والرؤوس السوداء."],
  "skin:hormonal": ["LA ROCHE-POSAY", "Effaclar Duo", "يهدّي الحبوب الملتهبة العميقة ويقلل آثارها. والحبوب الهرمونية علاجها الأساسي عند الطبيبة."],
  "skin:fungal":   ["MARIO BADESCU", "Drying Lotion", "فيه كبريت، وهو مضاد طبيعي للفطريات، وبدون زيوت تغذيها. يستخدم موضعياً بالليل."],
  "skin:marks":    ["AXIS-Y", "Dark Spot", "مخصص للبقع وآثار الحبوب بالنياسيناميد، لطيف ومناسب للاستخدام اليومي."],
  "skin:pigment":  ["MELANO CC", "Anti-Spot", "فيتامين C نقي مركّز من اليابان، مشهور بتفتيح البقع والكلف بسعر مناسب."],
  "skin:glow":     ["BEAUTY OF JOSEON", "Glow Serum", "بروبوليس 60% ونياسيناميد يعطون البشرة إشراقة ورطوبة من أول أسبوع، خفيف ومناسب لأغلب أنواع البشرة."],
  "skin:aging":    ["THE ORDINARY", "Buffet", "ببتيدات متعددة مع هيالورونيك تخفف مظهر الخطوط وتناسب أغلب البشرات، وآمنة للحامل بعكس الريتينول. ولو تبين أقوى أضيفي ريتينول بالليل."],
  "skin:eyes":     ["THE ORDINARY", "Caffeine", "الكافيين يخفف الانتفاخ والهالات الزرقاء، وسعره من الأوفر. والهالات البنية الوراثية تحتاج صبر وواقي شمس."],
  "skin:dryness":  ["CeraVe", "Moisturizing Cream", "سيراميد يرمم حاجز البشرة ويرطب 24 ساعة، بدون عطر، ومن أكثر المرطبات اللي ينصح فيها أطباء الجلدية."],
  "skin:oil":      ["THE ORDINARY", "Niacinamide 10%", "النياسيناميد والزنك ينظمون الدهون ويقللون اللمعان، وسعره من الأوفر."],
  "skin:pores":    ["MEDICUBE", "Zero Pore", "بادات بأحماض لطيفة تنظف المسام وتصغر مظهرها، سهلة للاستخدام اليومي."],
  "skin:redness":  ["SKIN1004", "Centella", "سنتيلا 100% تهدّي الاحمرار وتقوي البشرة الحساسة، وبدون عطور."],
  "skin:barrier":  ["AESTURA", "Atobarrier", "كريم كوري بالسيراميد مصمم للبشرة الجافة جداً والحساسة، يرمم الحاجز بسرعة."],
  "hair:dryness":  ["FINO", "Premium Touch", "ماسك ياباني يرطب الشعر الجاف ويعطيه نعومة من أول استخدام، وسعره مناسب."],
  "hair:splitEnds":["KÉRASTASE", "Elixir", "زيت خفيف يلم الأطراف المتقصفة ويخليها ناعمة ولامعة. والحل النهائي للأطراف المتقصفة هو القص، والزيت يمنع التقصف يزيد."],
  "hair:damage":   ["K18", "Molecular Repair", "يصلح روابط الشعرة المتضررة من الصبغة والحرارة في 4 دقائق، بدون شطف."],
  "hair:frizz":    ["COLOR WOW", "Dream Coat", "يحمي الشعر من الرطوبة ويخليه ناعم بدون هيشان لأيام."],
  "hair:curls":    ["KINKY-CURLY", "Curling Custard", "يعرّف الكيرلي والكِنكي ويثبّته بدون قشور ولا ثقل."],
  "hair:shine":    ["&HONEY", "Hair Oil", "زيت ياباني بالعسل يعطي لمعة ونعومة بدون ما يثقل الشعر."],
  "hair:heat":     ["OLAPLEX", "No.7", "زيت يحمي من الحرارة ويرمم الشعر ويعطيه لمعة."],
  "hair:oilyScalp":["BRIOGEO", "Charcoal", "شامبو بالفحم ينظف الفروة الدهنية بعمق ويزيل التراكمات."],
  "hair:hairfall": ["MIELLE", "Rosemary", "زيت الروزماري ترند تيك توك لتقوية الشعر وتقليل التساقط. وإذا التساقط كثير استشيري الطبيبة."],
  "hair:sensitiveScalp": ["VANICREAM", "Shampoo", "بدون عطور ولا صبغات ولا كبريتات، ألطف خيار للفروة الحساسة."],
  "hair:dandruff": ["HEAD & SHOULDERS", "Classic Clean", "فيه زنك بيريثيون اللي يخفف القشرة، لطيف للاستخدام اليومي وسعره مناسب. ولو القشرة عنيدة جربي Nizoral أو Vichy Dercos مرتين بالأسبوع."]
};

const TIER_LABELS = {
  basic: { name: "أساسي", note: "3 منتجات للبداية" },
  full:  { name: "متكامل", note: "الروتين الكامل" },
  plus:  { name: "فاخر",  note: "الكامل + إضافة متقدمة" }
};


if (typeof module !== "undefined") module.exports = { ACTIVES, activesOf, COUNTRIES, CATEGORIES, PROBLEMS, BEST_PICKS, BRAND, SKIN_TYPES, SKIN_CONCERNS, HAIR_TYPES, ALLERGENS, PRODUCTS, KITS, TIER_LABELS, CONCERN_TAGS, DOCTORS, CONSULT_TYPES, CONSULT_TIMES };
