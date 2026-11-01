/* =========================================================
   عنايتي — بيانات المحتوى (ريناد)
   هذا الملف هو "مصدر الحقيقة" للمحتوى في مرحلة الواجهات.
   ريفال: كل مصفوفة هنا تقابل جدولاً في قاعدة البيانات
   (products, kits, kit_items, kit_steps, skin_types, hair_types).
   ========================================================= */

const BRAND = {
  name: "عنايتي",
  nameEn: "Inayati",
  slogan: "روتينك، مصمَّم لكِ",
  tiktok: "https://www.tiktok.com/@inayati.sa", // حساب المتجر (فيديوهات الروتين)
  currency: "ر.س",
  freeShippingFrom: 200,
  shippingFee: 25,
  kitDiscount: 0.15,          // خصم الكيت مقارنة بشراء المنتجات منفردة (يُطبَّق في engine.js)
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
  { id: "s12", cat: "skin", step: "serum", brand: "MELANO CC", country: "🇯🇵 اليابان", nameEn: "Vitamin C Brightening Essence", name: "إسنس ميلانو سي سي بفيتامين C", size: "20 مل", price: 65,
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

/* ---------- الكيتات ----------
   tiers.basic = المنتجات الأساسية | tiers.full = الروتين الكامل | tiers.plus = الكامل + إضافة متقدمة
   routine: طريقة الاستخدام (صباح / مساء / أسبوعي) */
const KITS = [
  {
    id: "k-dry", cat: "skin", name: "كيت الترطيب العميق", for: "للبشرة الجافة", color: "#EFE3D3",
    tagline: "سيرافي + هادا لابو + حلزون كوسركس: وداعاً للشد.",
    tiers: { basic: ["s01","s15","s20"], full: ["s01","s06","s09","s15","s20"], plus: ["s01","s06","s09","s15","s20","s19"] },
    routine: {
      morning: ["غسول سيرافي بماء فاتر", "لوشن هادا لابو: ربتي منه على الوجه بكفوفك", "إسنس الحلزون من كوسركس على بشرة رطبة", "كريم سيرافي المرطب", "واقي بيوتي أوف جوسون كآخر خطوة"],
      evening: ["غسول سيرافي", "لوشن هادا لابو (طبقتين لو بشرتك جافة جداً)", "إسنس الحلزون", "طبقة أسمك من كريم سيرافي، أو ماسك لانيج النومي في الكيت الفاخر"],
      weekly: []
    }
  },
  {
    id: "k-oily", cat: "skin", name: "كيت التوازن والنقاء", for: "للبشرة الدهنية", color: "#DDEBE0",
    tagline: "كوسركس + أنوا + ذا أوردينري: لمعان أقل ومسام أنقى.",
    tiers: { basic: ["s04","s18","s21"], full: ["s04","s05","s10","s18","s21"], plus: ["s04","s05","s10","s18","s21","s26"] },
    routine: {
      morning: ["جل كوسركس الصباحي 30 ثانية", "تونر أنوا", "سيروم النياسيناميد", "لوشن كوسركس الخالي من الزيوت", "واقي بيوريه"],
      evening: ["جل كوسركس", "تونر أنوا", "سيروم النياسيناميد", "لوشن كوسركس"],
      weekly: ["مقشر بولاز تشويس BHA مساءً 2–3 مرات أسبوعياً بدل التونر (الكيت الفاخر)"]
    }
  },
  {
    id: "k-combo", cat: "skin", name: "كيت التوازن الذكي", for: "للبشرة المختلطة", color: "#E4E0EF",
    tagline: "راوند لاب + أنوا: كل منطقة تأخذ اللي تحتاجه.",
    tiers: { basic: ["s03","s18","s20"], full: ["s03","s05","s11","s18","s20"], plus: ["s03","s05","s11","s10","s18","s20"] },
    routine: {
      morning: ["غسول راوند لاب", "تونر أنوا", "الهيالورونيك على الخدين (والنياسيناميد على منطقة T في الفاخر)", "لوشن كوسركس", "واقي بيوتي أوف جوسون"],
      evening: ["غسول راوند لاب", "تونر أنوا", "الهيالورونيك على كامل الوجه", "لوشن كوسركس"],
      weekly: []
    }
  },
  {
    id: "k-normal", cat: "skin", name: "كيت الأساسيات", for: "للبشرة العادية", color: "#F4E4DC",
    tagline: "روتين بسيط من فرنسا واليابان وكوريا.",
    tiers: { basic: ["s03","s16","s20"], full: ["s03","s06","s09","s16","s20"], plus: ["s03","s06","s09","s14","s16","s20"] },
    routine: {
      morning: ["غسول راوند لاب", "لوشن هادا لابو", "إسنس الحلزون (أو فيتامين C من كليرز في الفاخر)", "مرطب لاروش بوزيه", "واقي بيوتي أوف جوسون"],
      evening: ["غسول راوند لاب", "لوشن هادا لابو", "إسنس الحلزون", "مرطب لاروش بوزيه"],
      weekly: []
    }
  },
  {
    id: "k-sensitive", cat: "skin", name: "كيت التهدئة", for: "للبشرة الحساسة", color: "#DCEAF0",
    tagline: "بيوديرما + سكن1004 + لاروش بوزيه: مكونات أقل، راحة أكثر.",
    tiers: { basic: ["s27","s16","s20"], full: ["s27","s05","s13","s16","s20"], plus: ["s27","s05","s13","s11","s16","s20"] },
    routine: {
      morning: ["ماء بيوديرما على قطنة بدون فرك", "تونر أنوا المهدئ", "أمبول السنتيلا", "مرطب لاروش بوزيه توليريان", "واقي بيوتي أوف جوسون"],
      evening: ["ماء بيوديرما", "أمبول السنتيلا", "مرطب لاروش بوزيه"],
      weekly: ["جربي أي منتج جديد خلف الأذن 24 ساعة قبل استخدامه"]
    }
  },
  {
    id: "k-acne", cat: "skin", name: "كيت صفاء", for: "للبشرة المعرضة للحبوب", color: "#E6EED8",
    tagline: "كوسركس + ذا أوردينري + ماريو باديسكو: خطة واضحة ضد الحبوب.",
    tiers: { basic: ["s04","s18","s25"], full: ["s04","s10","s18","s24","s21"], plus: ["s04","s07","s10","s18","s24","s21"] },
    routine: {
      morning: ["جل كوسركس الصباحي", "سيروم النياسيناميد", "لوشن كوسركس", "واقي بيوريه"],
      evening: ["جل كوسركس", "تونر سم باي مي (الكيت الفاخر)", "سيروم النياسيناميد", "لوشن كوسركس", "ماريو باديسكو على الحبة بعود قطن بدون رج، أو لصقة كوسركس"],
      weekly: ["لا تفركين الحبوب، والنتائج تبان عادة بعد 4–6 أسابيع"]
    }
  },
  {
    id: "k-bright", cat: "skin", name: "كيت الإشراقة", for: "للتصبغات والبهتان", color: "#F8E8C8",
    tagline: "ميلانو سي سي الياباني + ذا أوردينري: لون موحد وإشراقة.",
    tiers: { basic: ["s03","s12","s20"], full: ["s03","s12","s11","s18","s20"], plus: ["s03","s12","s11","s18","s20","s08"] },
    routine: {
      morning: ["غسول راوند لاب", "ميلانو سي سي: قطرتين على البقع والوجه", "سيروم الهيالورونيك", "لوشن كوسركس", "واقي بيوتي أوف جوسون (أهم خطوة لعلاج التصبغات)"],
      evening: ["غسول راوند لاب", "سيروم الهيالورونيك", "لوشن كوسركس"],
      weekly: ["تونر الجلايكوليك مساءً 2–3 مرات أسبوعياً (الكيت الفاخر)، ولا تستخدمينه مع فيتامين C بنفس الليلة"]
    }
  },

  // ===== كيتات الشعر =====
  {
    id: "h-dry", cat: "hair", name: "كيت ترطيب الشعر", for: "للشعر الجاف", color: "#F0E2D0",
    tagline: "تسوباكي الياباني + ميزنسين الكوري: نعومة ولمعة.",
    tiers: { basic: ["h01","h05"], full: ["h01","h05","h09"], plus: ["h01","h05","h09","h07"] },
    routine: {
      morning: ["2–3 بمبات من سيروم ميزنسين على الأطراف بعد التسريح"],
      evening: [],
      weekly: ["شامبو تسوباكي 2–3 مرات أسبوعياً على الفروة", "بلسم تسوباكي على الأطراف 3 دقائق", "ماسك فينو مرة أسبوعياً 5–10 دقائق (الكيت الفاخر)"]
    }
  },
  {
    id: "h-oily", cat: "hair", name: "كيت انتعاش الفروة", for: "للشعر الدهني", color: "#DCE9DF",
    tagline: "بريوجيو + زيت ميلي بالروزماري: جذور منتعشة.",
    tiers: { basic: ["h02","h06"], full: ["h02","h06","h10"], plus: ["h02","h06","h10","h12"] },
    routine: {
      morning: [],
      evening: ["زيت ميلي على الفروة 3 مرات أسبوعياً مع تدليك 5 دقائق"],
      weekly: ["شامبو بريوجيو يوم بعد يوم", "بلسم فانيكريم على الأطراف فقط"]
    }
  },
  {
    id: "h-curly", cat: "hair", name: "كيت تعريف الكيرلي", for: "للشعر المجعد", color: "#EBDDE8",
    tagline: "شيا مويستشر + أولابلكس: تموجات واضحة بدون هيشان.",
    tiers: { basic: ["h04","h11"], full: ["h04","h05","h11"], plus: ["h04","h05","h11","h08"] },
    routine: {
      morning: ["رطبي الشعر بالماء وأعيدي توزيع كريم شيا مويستشر عند الحاجة"],
      evening: ["نامي على كيس مخدة حرير عشان تحافظين على التموجات"],
      weekly: ["شامبو شيا مويستشر مرتين أسبوعياً", "بلسم بكمية كبيرة", "كريم التعريف على شعر مبلل ثم تجفيف بتيشيرت قطني", "أولابلكس رقم 3 قبل الشامبو مرة أسبوعياً (الكيت الفاخر)"]
    }
  },
  {
    id: "h-damaged", cat: "hair", name: "كيت الإصلاح", for: "للشعر المصبوغ والتالف", color: "#F3E1D2",
    tagline: "أولابلكس + فينو + كيراستاس: استرجعي قوة شعرك.",
    tiers: { basic: ["h01","h07"], full: ["h01","h05","h08","h12"], plus: ["h01","h05","h08","h12","h14"] },
    routine: {
      morning: ["بخاخ تريسيمي قبل أي استشوار أو مكواة"],
      evening: [],
      weekly: ["أولابلكس رقم 3 على شعر مبلل 10 دقائق قبل الشامبو، مرة أسبوعياً", "شامبو تسوباكي 2–3 مرات أسبوعياً", "ماسك فينو أو البلسم بعد كل غسلة", "قطرات زيت كيراستاس على الأطراف (الكيت الفاخر)"]
    }
  },
  {
    id: "h-normal", cat: "hair", name: "كيت الشعر الأساسي", for: "للشعر العادي", color: "#E8E5D8",
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
/* زر تيك توك في صفحة الكيت يفتح ريفيوهات المنتج الأبرز فيه (أول سيروم/علاج، أو أول منتج) */
KITS.forEach(k => {
  const ids = k.tiers.full, pick = ids.find(id => /^s(09|10|12|13|05)$|^h(07|08|10|11)$/.test(id)) || ids[0];
  k.tiktok = PRODUCTS.find(p => p.id === pick).tiktok;
});

const TIER_LABELS = {
  basic: { name: "أساسي", note: "3 منتجات للبداية" },
  full:  { name: "متكامل", note: "الروتين الكامل" },
  plus:  { name: "فاخر",  note: "الكامل + إضافة متقدمة" }
};


if (typeof module !== "undefined") module.exports = { BRAND, SKIN_TYPES, SKIN_CONCERNS, HAIR_TYPES, ALLERGENS, PRODUCTS, KITS, TIER_LABELS };
