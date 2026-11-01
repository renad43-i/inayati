/* =========================================================
   عنايتي — محرك الأسعار والتوصية (مشترك بين المتصفح والخادم)
   الخادم يستخدم نفس الدوال لإعادة حساب السعر عند الدفع،
   فلا يمكن للعميلة التلاعب بالسعر من المتصفح.
   ========================================================= */
(function (root, factory) {
  if (typeof module !== "undefined" && module.exports) module.exports = factory();
  else root.Engine = factory();
})(typeof self !== "undefined" ? self : this, function () {

  const KIT_DISCOUNT = 0.15;
  const SUB_DISCOUNT = 0.10;
  const TIERS = ["basic", "full", "plus"];

  /* ---------- أسئلة الاختبار ---------- */
  const QUIZ = [
    { id: "focus", title: "وش تبين نهتم فيه؟", sub: "اختاري مجال الروتين", type: "single",
      options: [
        { v: "skin", t: "بشرتي", d: "روتين يومي للوجه" },
        { v: "hair", t: "شعري", d: "روتين للشعر وفروة الرأس" },
        { v: "both", t: "الاثنين", d: "كيت للبشرة وكيت للشعر" } ] },
    { id: "skinType", title: "كيف تحسين بشرتك بعد ساعتين من غسلها؟", sub: "بدون أي منتج", type: "single", when: a => a.focus !== "hair",
      options: [
        { v: "dry", t: "مشدودة وجافة", d: "أحياناً فيها قشور" },
        { v: "oily", t: "لامعة بالكامل", d: "خصوصاً الجبهة والخدين" },
        { v: "combo", t: "لامعة في الجبهة والأنف فقط", d: "والخدود طبيعية أو جافة" },
        { v: "normal", t: "مريحة ومتوازنة", d: "ما ألاحظ شي" },
        { v: "sensitive", t: "تحمر أو تحرقني بسهولة", d: "تتهيج من منتجات كثيرة" } ] },
    { id: "concern", title: "وش أكثر شي يضايقك في بشرتك؟", sub: "اختاري الأهم", type: "single", when: a => a.focus !== "hair",
      options: [
        { v: "acne", t: "حبوب ورؤوس سوداء" },
        { v: "pigment", t: "تصبغات وبهتان" },
        { v: "dryness", t: "جفاف وخشونة" },
        { v: "pores", t: "مسام واسعة ولمعان" },
        { v: "none", t: "ولا شي محدد" } ] },
    { id: "hairType", title: "كيف تصفين شعرك؟", type: "single", when: a => a.focus !== "skin",
      options: [
        { v: "dry", t: "جاف وخشن" },
        { v: "oily", t: "دهني من الجذور" },
        { v: "curly", t: "مجعد / كيرلي" },
        { v: "damaged", t: "مصبوغ أو تالف من الحرارة" },
        { v: "normal", t: "عادي" } ] },
    { id: "allergies", title: "عندك حساسية من أي مكون؟", sub: "تقدرين تختارين أكثر من خيار", type: "multi",
      options: [
        { v: "fragrance", t: "العطور" },
        { v: "alcohol", t: "الكحول" },
        { v: "nuts", t: "زيوت المكسرات" },
        { v: "none", t: "لا يوجد" } ] },
    { id: "budget", title: "كم ميزانيتك الشهرية للعناية؟", type: "single",
      options: [
        { v: "low", t: "حتى 200 ر.س" },
        { v: "mid", t: "من 200 إلى 350 ر.س" },
        { v: "high", t: "أكثر من 350 ر.س" } ] }
  ];

  const BUDGET_MAX = { low: 200, mid: 350, high: Infinity };
  const BUDGET_TIER = { low: "basic", mid: "full", high: "plus" };

  /* ---------- الأسعار ---------- */
  function sumProducts(productIds, productMap) {
    return productIds.reduce((s, id) => s + (productMap[id] ? productMap[id].price : 0), 0);
  }
  function roundNine(x) { return Math.max(9, Math.round(x / 10) * 10 - 1); }
  function kitPrice(productIds, productMap, purchaseType) {
    let p = roundNine(sumProducts(productIds, productMap) * (1 - KIT_DISCOUNT));
    if (purchaseType === "subscription") p = roundNine(p * (1 - SUB_DISCOUNT));
    return p;
  }
  function shippingFor(subtotal) { return subtotal === 0 || subtotal >= 200 ? 0 : 25; }

  /* ---------- قواعد التوصية ----------
     القاعدة 1: البشرة الحساسة لها الأولوية دائماً ← كيت التهدئة (ونتجنب العطور تلقائياً)
     القاعدة 2: المشكلة الأساسية تتقدم على النوع: حبوب ← صفاء، تصبغات ← الإشراقة
     القاعدة 3: جفاف مع بشرة دهنية/مختلطة ← التوازن الذكي، وإلا ← الترطيب العميق
     القاعدة 4: مسام مع بشرة جافة ← التوازن الذكي، وإلا ← التوازن والنقاء
     القاعدة 5: بدون مشكلة ← حسب نوع البشرة
     القاعدة 6: الشعر ← حسب نوع الشعر مباشرة
     القاعدة 7: الميزانية تحدد المستوى (أساسي/متكامل/فاخر)، وإذا تجاوز المجموع الميزانية
               نخفّض مستوى كيت الشعر أولاً ثم البشرة
     القاعدة 8: أي منتج فيه مكوّن تتحسس منه يُستبدل ببديل من نفس الخطوة يناسب نوعها،
               وإذا ما فيه بديل يُحذف ونوضح ذلك */
  function pickSkinKit(type, concern) {
    if (type === "sensitive") return { kit: "k-sensitive", why: "بشرتك حساسة، فبدأنا بالتهدئة وتقوية الحاجز قبل أي علاج." };
    if (concern === "acne") return { kit: "k-acne", why: "اخترنا كيت صفاء لأن الحبوب هي مشكلتك الأساسية." };
    if (concern === "pigment") return { kit: "k-bright", why: "اخترنا كيت الإشراقة بفيتامين C لعلاج التصبغات والبهتان." };
    if (concern === "dryness") return (type === "oily" || type === "combo")
      ? { kit: "k-combo", why: "بشرتك دهنية لكنها تعاني من الجفاف، فتحتاج توازن: ترطيب بدون ثقل." }
      : { kit: "k-dry", why: "الجفاف هو مشكلتك الأساسية، فاخترنا الترطيب العميق." };
    if (concern === "pores") return type === "dry"
      ? { kit: "k-combo", why: "المسام واضحة لكن بشرتك تميل للجفاف، فاخترنا التوازن الذكي." }
      : { kit: "k-oily", why: "اخترنا كيت التوازن والنقاء بالنياسيناميد لتقليل المسام واللمعان." };
    const map = { dry: "k-dry", oily: "k-oily", combo: "k-combo", normal: "k-normal" };
    return { kit: map[type] || "k-normal", why: "اخترنا الكيت المناسب لنوع بشرتك للمحافظة عليها." };
  }
  function pickHairKit(type) {
    const map = { dry: "h-dry", oily: "h-oily", curly: "h-curly", damaged: "h-damaged", normal: "h-normal" };
    return { kit: map[type] || "h-normal", why: "اخترنا الكيت حسب نوع شعرك." };
  }

  function applyAllergies(productIds, allergens, suitsKey, productMap) {
    const swaps = [], out = [];
    for (const id of productIds) {
      const p = productMap[id];
      const bad = (p.contains || []).filter(c => allergens.includes(c));
      if (!bad.length) { out.push(id); continue; }
      const candidates = Object.values(productMap).filter(q =>
        q.active !== false && q.cat === p.cat && q.step === p.step && q.id !== p.id &&
        !(q.contains || []).some(c => allergens.includes(c)) && !out.includes(q.id) && !productIds.includes(q.id));
      const alt = candidates.find(q => (q.suits || []).includes(suitsKey)) || candidates[0];
      if (alt) { out.push(alt.id); swaps.push({ from: p.id, to: alt.id, reason: bad }); }
      else swaps.push({ from: p.id, to: null, reason: bad });
    }
    return { productIds: out, swaps };
  }

  /* catalog = { products: [...], kits: [...] } */
  function recommend(answers, catalog) {
    const productMap = Object.fromEntries(catalog.products.map(p => [p.id, p]));
    const kitMap = Object.fromEntries(catalog.kits.map(k => [k.id, k]));
    const allergens = (answers.allergies || []).filter(a => a !== "none");
    if (answers.skinType === "sensitive" && !allergens.includes("fragrance")) allergens.push("fragrance");

    const picks = [];
    if (answers.focus !== "hair") picks.push({ ...pickSkinKit(answers.skinType, answers.concern), suits: answers.skinType });
    if (answers.focus !== "skin") picks.push({ ...pickHairKit(answers.hairType), suits: answers.hairType });

    const budget = answers.budget || "mid";
    const max = BUDGET_MAX[budget];
    const tiers = picks.map(() => BUDGET_TIER[budget]);
    const build = () => picks.map((pk, i) => {
      const kit = kitMap[pk.kit];
      const { productIds, swaps } = applyAllergies(kit.tiers[tiers[i]], allergens, pk.suits, productMap);
      return { kitId: kit.id, tier: tiers[i], productIds, swaps, why: pk.why, price: kitPrice(productIds, productMap) };
    });
    let result = build();
    const total = () => result.reduce((s, r) => s + r.price, 0);
    // القاعدة 7: نخفّض من آخر كيت (الشعر) أولاً
    while (total() > max) {
      let idx = -1;
      for (let i = tiers.length - 1; i >= 0; i--) if (tiers[i] !== "basic") { idx = i; break; }
      if (idx === -1) break;
      tiers[idx] = TIERS[TIERS.indexOf(tiers[idx]) - 1];
      result = build();
    }
    const notes = [];
    if (total() > max && result.length > 1) {
      notes.push("الكيتين معاً يتجاوزان ميزانيتك قليلاً، تقدرين تبدئين بكيت البشرة وتضيفين الشعر لاحقاً.");
    }
    if (allergens.length) notes.push("استبعدنا المنتجات اللي فيها: " + allergens.map(a => ({ fragrance: "العطور", alcohol: "الكحول", nuts: "زيوت المكسرات" })[a]).join("، ") + ".");
    return { kits: result, total: total(), notes, allergens };
  }

  return { QUIZ, TIERS, KIT_DISCOUNT, SUB_DISCOUNT, kitPrice, sumProducts, shippingFor, recommend };
});
