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
  tiktok: "https://www.tiktok.com/@inayati.sa", // يُستبدل بحساب المشروع الحقيقي
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
   step: خطوة الروتين (تُستخدم في استبدال المنتج عند وجود حساسية)
   contains: مسببات الحساسية الموجودة في المنتج
   suits: أنواع البشرة/الشعر المناسبة */
const PRODUCTS = [
  // ===== البشرة =====
  { id: "p01", cat: "skin", step: "cleanser",    name: "غسول كريمي لطيف",               size: "150 مل", price: 49, suits: ["dry","sensitive","normal"], contains: [], desc: "غسول بقوام كريمي ينظف دون أن يسلب البشرة رطوبتها. بالسيراميد والجلسرين." },
  { id: "p02", cat: "skin", step: "cleanser",    name: "جل منقي بحمض الساليسيليك 0.5%", size: "150 مل", price: 55, suits: ["oily","combo"],           contains: ["fragrance"], desc: "ينظف المسام بعمق ويقلل الرؤوس السوداء والحبوب." },
  { id: "p03", cat: "skin", step: "cleanser",    name: "غسول رغوي متوازن",               size: "150 مل", price: 45, suits: ["combo","normal","oily"],  contains: [], desc: "رغوة خفيفة تزيل الدهون والشوائب وتحافظ على توازن البشرة." },
  { id: "p04", cat: "skin", step: "toner",       name: "تونر مرطب بالهيالورونيك",       size: "200 مل", price: 59, suits: ["dry","normal","sensitive"], contains: [], desc: "يجهز البشرة للسيروم ويمنحها ترطيباً فورياً." },
  { id: "p05", cat: "skin", step: "toner",       name: "تونر النياسيناميد 5%",           size: "200 مل", price: 65, suits: ["oily","combo"],           contains: ["alcohol"], desc: "يقلل اللمعان ومظهر المسام ويوحّد لون البشرة." },
  { id: "p06", cat: "skin", step: "serum",       name: "سيروم هيالورونيك 2%",            size: "30 مل",  price: 79, suits: ["dry","normal","combo","sensitive"], contains: [], desc: "يجذب الرطوبة لطبقات البشرة ويمنحها امتلاءً ونضارة." },
  { id: "p07", cat: "skin", step: "serum",       name: "سيروم نياسيناميد 10% + زنك",     size: "30 مل",  price: 75, suits: ["oily","combo"],           contains: [], desc: "ينظم الدهون ويهدئ الحبوب ويصغّر مظهر المسام." },
  { id: "p08", cat: "skin", step: "serum",       name: "سيروم فيتامين C 10%",            size: "30 مل",  price: 95, suits: ["normal","combo","oily","dry"], contains: ["fragrance"], desc: "مضاد أكسدة يفتّح التصبغات ويمنح البشرة إشراقة." },
  { id: "p09", cat: "skin", step: "serum",       name: "سيروم السنتيلا المهدئ",          size: "30 مل",  price: 85, suits: ["sensitive","dry","normal"], contains: [], desc: "يهدئ الاحمرار ويقوّي حاجز البشرة الحساسة." },
  { id: "p10", cat: "skin", step: "moisturizer", name: "كريم مرطب غني بالسيراميد",       size: "50 مل",  price: 69, suits: ["dry","sensitive","normal"], contains: [], desc: "يرمم حاجز البشرة ويحبس الرطوبة طوال اليوم." },
  { id: "p11", cat: "skin", step: "moisturizer", name: "جل مرطب خفيف خالٍ من الزيوت",   size: "50 مل",  price: 59, suits: ["oily","combo","normal"],  contains: [], desc: "ترطيب خفيف يمتص بسرعة ولا يسد المسام." },
  { id: "p12", cat: "skin", step: "spf",         name: "واقي شمس خفيف SPF50",            size: "50 مل",  price: 79, suits: ["oily","combo","normal","dry"], contains: ["alcohol"], desc: "حماية واسعة الطيف بلمسة نهائية غير لامعة وبدون أثر أبيض." },
  { id: "p13", cat: "skin", step: "spf",         name: "واقي شمس معدني SPF50",           size: "50 مل",  price: 85, suits: ["sensitive","dry","normal","combo","oily"], contains: [], desc: "واقٍ فيزيائي بأكسيد الزنك، مناسب لأكثر أنواع البشرة حساسية." },
  { id: "p14", cat: "skin", step: "treatment",   name: "علاج موضعي للحبوب",              size: "15 مل",  price: 39, suits: ["oily","combo","normal"],  contains: ["alcohol"], desc: "يوضع على الحبة مباشرة ليقلل الالتهاب خلال أيام." },
  { id: "p15", cat: "skin", step: "exfoliant",   name: "مقشر لطيف AHA 5%",               size: "100 مل", price: 69, suits: ["normal","combo","oily","dry"], contains: [], desc: "تقشير كيميائي لطيف يزيل الخلايا الميتة ويوحد اللون (مرتين أسبوعياً)." },

  // ===== الشعر =====
  { id: "p16", cat: "hair", step: "shampoo",     name: "شامبو مرطب خالٍ من الكبريتات",  size: "300 مل", price: 55, suits: ["dry","curly","damaged","normal"], contains: ["fragrance"], desc: "ينظف بلطف ويحافظ على الزيوت الطبيعية للشعر." },
  { id: "p17", cat: "hair", step: "shampoo",     name: "شامبو منظف لفروة الرأس",         size: "300 مل", price: 52, suits: ["oily","normal"],          contains: [], desc: "ينظف الجذور الدهنية ويمنح انتعاشاً يدوم." },
  { id: "p24", cat: "hair", step: "shampoo",     name: "شامبو لطيف بدون عطر",           size: "300 مل", price: 55, suits: ["dry","curly","damaged","normal","oily"], contains: [], desc: "تركيبة بسيطة بدون عطور للفروة الحساسة." },
  { id: "p18", cat: "hair", step: "conditioner", name: "بلسم مرطب",                      size: "300 مل", price: 52, suits: ["dry","curly","damaged","normal","oily"], contains: [], desc: "ينعّم الشعر ويسهل تسريحه ويقلل التقصف." },
  { id: "p19", cat: "hair", step: "mask",        name: "ماسك الإصلاح بالكيراتين",       size: "250 مل", price: 79, suits: ["damaged","dry","curly"],  contains: [], desc: "يعيد بناء الشعرة المتضررة من الصبغة والحرارة (مرة أسبوعياً)." },
  { id: "p20", cat: "hair", step: "oil",         name: "زيت الأرغان للأطراف",            size: "50 مل",  price: 65, suits: ["dry","damaged","curly","normal"], contains: ["nuts"], desc: "يغذي الأطراف ويمنح لمعاناً بدون ثقل." },
  { id: "p25", cat: "hair", step: "oil",         name: "سيروم سيليكون خفيف للأطراف",    size: "50 مل",  price: 59, suits: ["dry","damaged","curly","normal"], contains: [], desc: "بديل خالٍ من زيوت المكسرات، يحمي الأطراف ويمنع الهيشان." },
  { id: "p21", cat: "hair", step: "styler",      name: "كريم تعريف الكيرلي",             size: "200 مل", price: 69, suits: ["curly"],                  contains: [], desc: "يحدد التموجات ويقلل الهيشان بدون قشور." },
  { id: "p22", cat: "hair", step: "scalp",       name: "سيروم فروة الرأس بالروزماري",   size: "50 مل",  price: 75, suits: ["oily","normal","dry"],    contains: ["fragrance"], desc: "ينشط فروة الرأس ويقلل تساقط الشعر." },
  { id: "p23", cat: "hair", step: "protect",     name: "بخاخ الحماية من الحرارة",        size: "150 مل", price: 59, suits: ["damaged","normal","curly","dry"], contains: ["alcohol"], desc: "يحمي الشعر حتى 230°م قبل الاستشوار والمكواة." }
];

/* ---------- الكيتات ----------
   tiers.basic = المنتجات الأساسية فقط (ميزانية أقل من 150)
   tiers.full  = الروتين الكامل (150–250)
   tiers.plus  = الكامل + إضافة متقدمة (أكثر من 250)
   routine: طريقة الاستخدام (صباح / مساء / أسبوعي) */
const KITS = [
  {
    id: "k-dry", cat: "skin", name: "كيت الترطيب العميق", for: "للبشرة الجافة", color: "#E9D8C4",
    tagline: "وداعاً للشد والخشونة.",
    tiers: { basic: ["p01","p10","p13"], full: ["p01","p04","p06","p10","p13"], plus: ["p01","p04","p06","p10","p13","p09"] },
    routine: {
      morning: ["اغسلي وجهك بالغسول الكريمي بماء فاتر", "رشّي التونر على كفيك وربتي على وجهك", "قطرتان من سيروم الهيالورونيك على بشرة رطبة", "طبقة من كريم السيراميد", "واقي الشمس كآخر خطوة"],
      evening: ["الغسول الكريمي", "التونر", "سيروم الهيالورونيك (والسنتيلا في الكيت الفاخر)", "طبقة أسمك من كريم السيراميد"],
      weekly: []
    },
    tiktok: "https://www.tiktok.com/@inayati.sa"
  },
  {
    id: "k-oily", cat: "skin", name: "كيت التوازن والنقاء", for: "للبشرة الدهنية", color: "#CFE0D2",
    tagline: "لمعان أقل، مسام أنقى.",
    tiers: { basic: ["p02","p11","p12"], full: ["p02","p05","p07","p11","p12"], plus: ["p02","p05","p07","p11","p12","p15"] },
    routine: {
      morning: ["جل الساليسيليك لمدة 30 ثانية", "تونر النياسيناميد", "سيروم النياسيناميد + زنك", "الجل المرطب الخفيف", "واقي الشمس الخفيف"],
      evening: ["جل الساليسيليك", "تونر النياسيناميد", "سيروم النياسيناميد", "الجل المرطب"],
      weekly: ["مقشر AHA مرتين أسبوعياً مساءً بدل التونر (الكيت الفاخر)"]
    },
    tiktok: "https://www.tiktok.com/@inayati.sa"
  },
  {
    id: "k-combo", cat: "skin", name: "كيت التوازن الذكي", for: "للبشرة المختلطة", color: "#DCD6EA",
    tagline: "كل منطقة تأخذ ما تحتاجه.",
    tiers: { basic: ["p03","p11","p12"], full: ["p03","p06","p07","p11","p12"], plus: ["p03","p06","p07","p11","p12","p15"] },
    routine: {
      morning: ["الغسول الرغوي المتوازن", "سيروم النياسيناميد على منطقة T", "سيروم الهيالورونيك على الخدين", "الجل المرطب", "واقي الشمس"],
      evening: ["الغسول الرغوي", "سيروم الهيالورونيك على كامل الوجه", "الجل المرطب"],
      weekly: ["مقشر AHA مرتين أسبوعياً (الكيت الفاخر)"]
    },
    tiktok: "https://www.tiktok.com/@inayati.sa"
  },
  {
    id: "k-normal", cat: "skin", name: "كيت الأساسيات", for: "للبشرة العادية", color: "#F3E1D9",
    tagline: "روتين بسيط يحافظ على بشرتك.",
    tiers: { basic: ["p03","p11","p12"], full: ["p03","p04","p06","p11","p12"], plus: ["p03","p04","p08","p06","p11","p12"] },
    routine: {
      morning: ["الغسول الرغوي", "التونر المرطب", "السيروم (فيتامين C في الكيت الفاخر)", "المرطب", "واقي الشمس"],
      evening: ["الغسول", "التونر", "سيروم الهيالورونيك", "المرطب"],
      weekly: []
    },
    tiktok: "https://www.tiktok.com/@inayati.sa"
  },
  {
    id: "k-sensitive", cat: "skin", name: "كيت التهدئة", for: "للبشرة الحساسة", color: "#D6E6EC",
    tagline: "مكونات أقل، راحة أكثر.",
    tiers: { basic: ["p01","p10","p13"], full: ["p01","p04","p09","p10","p13"], plus: ["p01","p04","p09","p06","p10","p13"] },
    routine: {
      morning: ["الغسول الكريمي بماء فاتر (ليس ساخناً)", "التونر المرطب", "سيروم السنتيلا", "كريم السيراميد", "الواقي المعدني"],
      evening: ["الغسول الكريمي", "سيروم السنتيلا", "كريم السيراميد"],
      weekly: ["جربي أي منتج جديد على خلف الأذن 24 ساعة قبل استخدامه"]
    },
    tiktok: "https://www.tiktok.com/@inayati.sa"
  },
  {
    id: "k-acne", cat: "skin", name: "كيت صفاء", for: "للبشرة المعرضة للحبوب", color: "#E2EBD3",
    tagline: "خطة واضحة ضد الحبوب.",
    tiers: { basic: ["p02","p11","p14"], full: ["p02","p07","p11","p14","p12"], plus: ["p02","p05","p07","p11","p14","p12"] },
    routine: {
      morning: ["جل الساليسيليك", "سيروم النياسيناميد + زنك", "الجل المرطب الخفيف", "واقي الشمس"],
      evening: ["جل الساليسيليك", "سيروم النياسيناميد", "العلاج الموضعي على الحبوب فقط", "الجل المرطب"],
      weekly: ["لا تفركي الحبوب، والنتائج تظهر عادة بعد 4–6 أسابيع"]
    },
    tiktok: "https://www.tiktok.com/@inayati.sa"
  },
  {
    id: "k-bright", cat: "skin", name: "كيت الإشراقة", for: "للتصبغات والبهتان", color: "#F5E3C3",
    tagline: "لون موحد وإشراقة طبيعية.",
    tiers: { basic: ["p03","p08","p12"], full: ["p03","p08","p06","p11","p12"], plus: ["p03","p08","p06","p11","p12","p15"] },
    routine: {
      morning: ["الغسول الرغوي", "سيروم فيتامين C", "المرطب", "واقي الشمس (أهم خطوة لعلاج التصبغات)"],
      evening: ["الغسول الرغوي", "سيروم الهيالورونيك", "المرطب"],
      weekly: ["مقشر AHA مرتين أسبوعياً مساءً (الكيت الفاخر)"]
    },
    tiktok: "https://www.tiktok.com/@inayati.sa"
  },

  // ===== كيتات الشعر =====
  {
    id: "h-dry", cat: "hair", name: "كيت ترطيب الشعر", for: "للشعر الجاف", color: "#EADBC8",
    tagline: "شعر ناعم وملمس حريري.",
    tiers: { basic: ["p16","p18"], full: ["p16","p18","p20"], plus: ["p16","p18","p20","p19"] },
    routine: {
      morning: ["قطرات من زيت الأرغان على الأطراف بعد التسريح"],
      evening: [],
      weekly: ["الشامبو المرطب 2–3 مرات أسبوعياً على الفروة", "البلسم على الأطراف 3 دقائق", "ماسك الكيراتين مرة أسبوعياً (الكيت الفاخر)"]
    },
    tiktok: "https://www.tiktok.com/@inayati.sa"
  },
  {
    id: "h-oily", cat: "hair", name: "كيت انتعاش الفروة", for: "للشعر الدهني", color: "#D3E4DA",
    tagline: "جذور منتعشة لوقت أطول.",
    tiers: { basic: ["p17","p18"], full: ["p17","p18","p22"], plus: ["p17","p18","p22","p23"] },
    routine: {
      morning: [],
      evening: ["سيروم الروزماري على الفروة 3 مرات أسبوعياً مع تدليك"],
      weekly: ["شامبو الفروة يوماً بعد يوم", "البلسم على الأطراف فقط وليس الجذور"]
    },
    tiktok: "https://www.tiktok.com/@inayati.sa"
  },
  {
    id: "h-curly", cat: "hair", name: "كيت تعريف الكيرلي", for: "للشعر المجعد", color: "#E6D5E3",
    tagline: "تموجات واضحة بدون هيشان.",
    tiers: { basic: ["p16","p21"], full: ["p16","p18","p21"], plus: ["p16","p18","p21","p19"] },
    routine: {
      morning: ["رطبي الشعر بالماء وأعيدي توزيع كريم التعريف عند الحاجة"],
      evening: ["نامي على كيس وسادة حريري للحفاظ على التموجات"],
      weekly: ["الشامبو الخالي من الكبريتات مرتين أسبوعياً", "البلسم بكمية وفيرة", "كريم التعريف على شعر مبلل ثم التجفيف بمنشفة قطنية"]
    },
    tiktok: "https://www.tiktok.com/@inayati.sa"
  },
  {
    id: "h-damaged", cat: "hair", name: "كيت الإصلاح", for: "للشعر المصبوغ والتالف", color: "#F0DCCB",
    tagline: "استرجعي قوة شعرك.",
    tiers: { basic: ["p16","p19"], full: ["p16","p18","p19","p23"], plus: ["p16","p18","p19","p23","p20"] },
    routine: {
      morning: ["بخاخ الحماية قبل أي أداة حرارية"],
      evening: [],
      weekly: ["الشامبو المرطب 2–3 مرات أسبوعياً", "ماسك الكيراتين مرة أسبوعياً لمدة 10 دقائق", "البلسم بعد كل غسلة"]
    },
    tiktok: "https://www.tiktok.com/@inayati.sa"
  },
  {
    id: "h-normal", cat: "hair", name: "كيت الشعر الأساسي", for: "للشعر العادي", color: "#E4E1D4",
    tagline: "نظافة ولمعان كل يوم.",
    tiers: { basic: ["p17","p18"], full: ["p17","p18","p25"], plus: ["p17","p18","p25","p23"] },
    routine: {
      morning: [],
      evening: [],
      weekly: ["الشامبو 3 مرات أسبوعياً", "البلسم على الأطراف", "سيروم الأطراف بعد التجفيف"]
    },
    tiktok: "https://www.tiktok.com/@inayati.sa"
  }
];

const TIER_LABELS = {
  basic: { name: "أساسي", note: "3 منتجات للبداية" },
  full:  { name: "متكامل", note: "الروتين الكامل" },
  plus:  { name: "فاخر",  note: "الكامل + إضافة متقدمة" }
};


if (typeof module !== "undefined") module.exports = { BRAND, SKIN_TYPES, SKIN_CONCERNS, HAIR_TYPES, ALLERGENS, PRODUCTS, KITS, TIER_LABELS };
