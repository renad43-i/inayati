/* =========================================================
   رينورا — محرك الأسعار والتوصية (مشترك بين المتصفح والخادم)
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
  /* كل الأسئلة اختيار متعدد. خيار exclusive (مثل «لا يوجد») يلغي باقي الاختيارات */
  const has = (v, x) => Array.isArray(v) ? v.includes(x) : v === x;
  const anyOf = (v, xs) => xs.some(x => has(v, x));
  const QUIZ = [
    { id: "focus", title: "وش تبين نهتم فيه؟", sub: "تقدرين تختارين الاثنين", type: "multi",
      options: [
        { v: "skin", t: "بشرتي", d: "روتين يومي للوجه" },
        { v: "hair", t: "شعري", d: "روتين للشعر وفروة الرأس" } ] },
    { id: "skinType", title: "كيف تحسين بشرتك بعد ساعتين من غسلها؟", sub: "بدون أي منتج · اختاري كل اللي ينطبق", type: "multi", when: a => has(a.focus, "skin"),
      options: [
        { v: "dry", t: "مشدودة وجافة", d: "أحياناً فيها قشور" },
        { v: "oily", t: "لامعة بالكامل", d: "خصوصاً الجبهة والخدين" },
        { v: "combo", t: "لامعة في الجبهة والأنف فقط", d: "والخدود طبيعية أو جافة" },
        { v: "normal", t: "مريحة ومتوازنة", d: "ما ألاحظ شي" },
        { v: "sensitive", t: "تحمر أو تحرقني بسهولة", d: "تتهيج من منتجات كثيرة" } ] },
    { id: "age", title: "كم عمرك؟", sub: "عشان نختار روتين يناسب مرحلتك", type: "multi", when: a => has(a.focus, "skin"),
      options: [
        { v: "teen", t: "من 13 إلى 17" },
        { v: "young", t: "من 18 إلى 29" },
        { v: "mid", t: "من 30 إلى 44" },
        { v: "mature", t: "45 وفوق" } ] },
    { id: "barrier", title: "هل حاجز بشرة وجهك متضرر؟", sub: "علامات ضعف حاجز بشرة الوجه · اختاري كل اللي ينطبق", type: "multi", when: a => has(a.focus, "skin"),
      options: [
        { v: "sting", t: "تحرقني أو تلسعني المنتجات", d: "حتى المرطب العادي، أو الماء أحياناً" },
        { v: "tight", t: "مشدودة وتقشر وتلمع بنفس الوقت", d: "شكلها ملمّع بس هي جافة من تحت" },
        { v: "over", t: "استخدمت تقشير أو ريتينول كثير مؤخراً", d: "أحماض، سكراب، ريتينول، أو علاج حبوب قوي" },
        { v: "red", t: "احمرار أو حبوب صغيرة ظهرت فجأة", d: "بعد ما جربت منتج جديد" },
        { v: "no", t: "لا، ما ألاحظ شي من هذا", exclusive: true } ] },
    { id: "concern", title: "وش يضايقك في بشرتك؟", sub: "اختاري كل اللي ينطبق", type: "multi", when: a => has(a.focus, "skin"),
      options: [
        { v: "acne", t: "حبوب ورؤوس سوداء" },
        { v: "hormonal", t: "حبوب هرمونية", d: "عميقة حول الذقن والفك، وتزيد مع الدورة" },
        { v: "fungal", t: "حبوب فطرية", d: "حبوب صغيرة متشابهة تحك، غالباً على الجبهة" },
        { v: "marks", t: "آثار حبوب" },
        { v: "pigment", t: "تصبغات وكلف وبهتان" },
        { v: "dryness", t: "جفاف وخشونة" },
        { v: "pores", t: "مسام واسعة ولمعان" },
        { v: "glow", t: "بهتان وأبي نضارة وترطيب", d: "بشرتي باهتة أو عطشانة ومو مشرقة" },
        { v: "aging", t: "تجاعيد وخطوط", d: "خطوط حول العين والجبهة، أو البشرة فقدت شدها" },
        { v: "eyes", t: "هالات أو انتفاخ تحت العين" },
        { v: "none", t: "ولا شي محدد", exclusive: true } ] },
    { id: "marks", title: "آثار الحبوب عندك وش شكلها؟", sub: "ضغطي على الأثر بكوب زجاج شفاف وشوفي", type: "multi", when: a => has(a.focus, "skin") && anyOf(a.concern, ["acne", "hormonal", "fungal", "marks"]),
      options: [
        { v: "pie", t: "حمراء أو وردية (PIE)", d: "تبيض أو تخف لما تضغطين عليها: احمرار بعد الالتهاب" },
        { v: "pih", t: "بنية أو غامقة (PIH)", d: "ما تتغير بالضغط: تصبغ بعد الالتهاب، أشيع في البشرة الحنطية والسمراء" },
        { v: "none", t: "ما عندي آثار", exclusive: true } ] },
    { id: "hairType", title: "كيف تصفين شعرك؟", sub: "اختاري كل اللي ينطبق", type: "multi", when: a => has(a.focus, "hair"),
      options: [
        { v: "dry", t: "جاف وخشن" },
        { v: "oily", t: "دهني من الجذور" },
        { v: "curly", t: "مموج أو كيرلي", d: "تموجات أو حلقات واضحة" },
        { v: "coily", t: "كِنكي / مجعد جداً", d: "حلقات صغيرة جداً أو زقزاق" },
        { v: "damaged", t: "مصبوغ أو تالف من الحرارة" },
        { v: "splitEnds", t: "أطرافه متقصفة" },
        { v: "hairfall", t: "يتساقط" },
        { v: "dandruff", t: "قشرة أو حكة في الفروة" },
        { v: "normal", t: "عادي", exclusive: true } ] },
    { id: "dandruff", title: "القشرة عندك كيف؟", sub: "عشان نعرف تحتاجين شامبو قشرة عادي ولا علاجي", type: "multi", when: a => has(a.focus, "hair") && has(a.hairType, "dandruff"),
      options: [
        { v: "mild", t: "قشور بيضاء خفيفة", d: "تروح وتجي، خصوصاً بالشتاء" },
        { v: "severe", t: "قشور كثيفة أو صفراء ودهنية", d: "ما تروح مع الشامبو العادي" },
        { v: "red", t: "احمرار أو حكة قوية", d: "أو القشور توصل للحواجب أو ورا الأذن" } ] },
    { id: "hairThickness", title: "شعرك خفيف ولا ثقيل؟", sub: "الشعرة نفسها وكثافة الشعر", type: "multi", when: a => has(a.focus, "hair"),
      options: [
        { v: "fine", t: "خفيف وناعم", d: "الشعرة رفيعة، ويثقل بسرعة من المنتجات" },
        { v: "medium", t: "متوسط" },
        { v: "thick", t: "كثيف وثقيل", d: "الشعرة سميكة ويحتاج ترطيب أكثر" } ] },
    { id: "frizz", title: "هل شعرك يهيش؟", type: "multi", when: a => has(a.focus, "hair"),
      options: [
        { v: "lot", t: "إيه، يهيش كثير" },
        { v: "humid", t: "يهيش بالرطوبة أو بعد الغسيل" },
        { v: "no", t: "لا، ما يهيش", exclusive: true } ] },
    { id: "allergies", title: "عندك حساسية من أي مكون؟", sub: "اختاري كل اللي ينطبق", type: "multi",
      options: [
        { v: "fragrance", t: "العطور" },
        { v: "alcohol", t: "الكحول" },
        { v: "nuts", t: "زيوت المكسرات" },
        { v: "none", t: "لا يوجد", exclusive: true } ] },
    { id: "pregnant", title: "هل أنتِ حامل أو مرضع؟", sub: "نستبعد المكونات اللي ما تناسب الحمل والرضاعة مثل الريتينول", type: "multi",
      options: [
        { v: "yes", t: "إيه، حامل أو مرضع" },
        { v: "no", t: "لا", exclusive: true } ] },
    { id: "budget", title: "كم ميزانيتك الشهرية للعناية؟", sub: "لو اخترتي أكثر من وحدة نعتمد الأعلى", type: "multi",
      options: [
        { v: "low", t: "حتى 250 ر.س" },
        { v: "mid", t: "من 250 إلى 400 ر.س" },
        { v: "high", t: "أكثر من 400 ر.س" } ] }
  ];

  /* تحويل الإجابات (اختيار متعدد) لإجابة أساسية لكل سؤال + قائمة كل الاحتياجات */
  function normalize(a) {
    const arr = v => Array.isArray(v) ? v.filter(Boolean) : v ? [v] : [];
    const focusL = arr(a.focus);
    const focus = focusL.includes("both") || (focusL.includes("skin") && focusL.includes("hair")) ? "both" : focusL[0] || "skin";
    const skinTypes = arr(a.skinType);
    const skinType = skinTypes.includes("sensitive") ? "sensitive" : (skinTypes.includes("oily") && skinTypes.includes("dry")) ? "combo"
      : ["combo", "oily", "dry", "normal"].find(t => skinTypes.includes(t)) || "normal";
    const concerns = arr(a.concern).filter(c => c !== "none");
    const concern = ["hormonal", "fungal", "acne", "marks", "pigment", "aging", "dryness", "pores", "glow", "eyes"].find(c => concerns.includes(c)) || "none";
    const marks = arr(a.marks).filter(x => x !== "none");
    const barrier = arr(a.barrier).filter(x => x !== "no");
    const hairTypes = arr(a.hairType);
    const hairType = ["damaged", "coily", "curly", "oily", "dry", "normal"].find(t => hairTypes.includes(t)) || (anyOf(hairTypes, ["hairfall", "dandruff"]) ? "oily" : hairTypes.includes("splitEnds") ? "damaged" : "normal");
    const thickness = arr(a.hairThickness), frizz = arr(a.frizz).filter(x => x !== "no"), dandruff = arr(a.dandruff);
    const budgets = arr(a.budget);
    const budget = ["high", "mid", "low"].find(b => budgets.includes(b)) || "mid";
    const skinConcerns = [...new Set([
      ...concerns, ...(marks.includes("pie") ? ["redness", "marks"] : []), ...(marks.includes("pih") ? ["pigment", "marks"] : []),
      ...(skinTypes.includes("dry") ? ["dryness"] : []), ...(skinTypes.includes("oily") || skinTypes.includes("combo") ? ["oil"] : []), ...(skinTypes.includes("sensitive") ? ["redness", "barrier"] : []), ...(barrier.length ? ["barrier", "redness"] : []), ...(barrier.includes("tight") ? ["dryness"] : [])
    ])];
    const HMAP = { dry: ["dryness"], oily: ["oilyScalp"], curly: ["curls"], coily: ["curls", "dryness"], damaged: ["damage"], hairfall: ["hairfall"], dandruff: ["dandruff", "sensitiveScalp"], splitEnds: ["splitEnds", "damage"] };
    const hairConcerns = [...new Set([...hairTypes.flatMap(t => HMAP[t] || []), ...(frizz.length ? ["frizz"] : []), ...(thickness.includes("thick") ? ["dryness"] : [])])];
    return { ...a, focus, skinType, concern, hairType: hairType === "coily" ? "curly" : hairType, budget, allergies: arr(a.allergies),
      barrierDamaged: barrier.length > 0, age: arr(a.age)[0] || "", pregnant: arr(a.pregnant).includes("yes"), dandruffSevere: anyOf(dandruff, ["severe", "red"]), profile: { skinTypes, concerns, marks, barrier, dandruff, hairTypes, thickness, frizz, skinConcerns, hairConcerns } };
  }

  const BUDGET_MAX = { low: 250, mid: 400, high: Infinity };
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
  /* التوصيل: عادي (1–3 أيام، مجاني فوق 200) أو سريع نفس اليوم في الرياض وجدة والدمام (35 ر.س) */
  const EXPRESS_CITIES = ["الرياض", "جدة", "الدمام"];
  const DELIVERY = { standard: { name: "توصيل عادي", days: "1–3 أيام عمل", fee: 25, freeFrom: 200 }, express: { name: "توصيل سريع نفس اليوم", days: "اطلبي قبل 2 الظهر يوصلك اليوم", fee: 35 } };
  function shippingFor(subtotal, method, city) {
    if (!subtotal) return 0;
    if (method === "express" && (!city || EXPRESS_CITIES.includes(city))) return DELIVERY.express.fee;
    return subtotal >= DELIVERY.standard.freeFrom ? 0 : DELIVERY.standard.fee;
  }

  /* ---------- قواعد التوصية ----------
     القاعدة 1: البشرة الحساسة لها الأولوية دائماً ← روتين التهدئة (ونتجنب العطور تلقائياً)
     القاعدة 2: المشكلة الأساسية تتقدم على النوع: حبوب ← صفاء، تصبغات ← الإشراقة
     القاعدة 3: جفاف مع بشرة دهنية/مختلطة ← التوازن الذكي، وإلا ← الترطيب العميق
     القاعدة 4: مسام مع بشرة جافة ← التوازن الذكي، وإلا ← التوازن والنقاء
     القاعدة 5: بدون مشكلة ← حسب نوع البشرة
     القاعدة 6: الشعر ← حسب نوع الشعر مباشرة
     القاعدة 7: الميزانية (حتى 250 / 250–400 / أكثر من 400) تحدد المستوى (أساسي/متكامل/فاخر)، وإذا تجاوز المجموع الميزانية
               نخفّض مستوى روتين الشعر أولاً ثم البشرة
     القاعدة 8: أي منتج فيه مكوّن تتحسس منه يُستبدل ببديل من نفس الخطوة يناسب نوعها،
               وإذا ما فيه بديل يُحذف ونوضح ذلك */
  function pickSkinKit(type, concern, barrier, age) {
    if (age === "teen" && type !== "sensitive" && !barrier && ["acne", "none", "pores", "dryness", "glow", "marks"].includes(concern))
      return { kit: "k-teen", why: "اخترنا روتين المراهقات: خطوات قليلة ولطيفة تنظف وترطب وتحمي من الشمس، بدون مكونات قوية ما تحتاجها بشرتك الحين." };
    if (barrier && type !== "sensitive" && concern !== "hormonal" && concern !== "fungal") return { kit: "k-sensitive", barrier: true,
      why: "حاجز بشرتك متضرر، فأول شي نرممه قبل أي علاج: روتين التهدئة مع كريم ترميم بالسيراميد. وقّفي التقشير والريتينول أسبوعين إلى أربعة، وبعدها ترجعين تعالجين مشكلتك الأساسية." };
    if (type === "sensitive") return { kit: "k-sensitive", consult: concern === "hormonal" || concern === "fungal", avoidFungal: concern === "fungal", why: "بشرتك حساسة، فبدأنا بالتهدئة وتقوية الحاجز قبل أي علاج." };
    if (concern === "hormonal") return { kit: "k-acne", consult: true,
      why: "الحبوب الهرمونية سببها من الداخل، فروتين صفاء عناية مساندة تهدّي الالتهاب وتمنع الانسداد، والعلاج الأساسي عند الطبيبة." };
    if (concern === "fungal") return { kit: "k-acne", consult: true, avoidFungal: true,
      why: "اخترنا روتين صفاء بعد استبعاد المنتجات اللي ممكن تغذي الفطريات، وننصحك تتأكدين من التشخيص مع الطبيبة." };
    if (concern === "marks") return { kit: "k-bright", why: "اخترنا روتين الإشراقة لأنه يخفف آثار الحبوب ويوحّد لون البشرة، مع واقي شمس يمنعها تغمق." };
    if (concern === "acne") return { kit: "k-acne", why: "اخترنا روتين صفاء لأن الحبوب هي مشكلتك الأساسية." };
    if (concern === "pigment") return { kit: "k-bright", why: "اخترنا روتين الإشراقة بفيتامين C لعلاج التصبغات والبهتان." };
    if (concern === "dryness") return (type === "oily" || type === "combo")
      ? { kit: "k-combo", why: "بشرتك دهنية لكنها تعاني من الجفاف، فتحتاج توازن: ترطيب بدون ثقل." }
      : { kit: "k-dry", why: "الجفاف هو مشكلتك الأساسية، فاخترنا الترطيب العميق." };
    if (concern === "aging" || (concern === "eyes" && (age === "mid" || age === "mature"))) return { kit: "k-age", why: "اخترنا روتين الشباب والتجديد: ببتيدات الصبح، وريتينول بالليل، وواقي شمس كل يوم لأنه أهم شي ضد الخطوط." + (concern === "eyes" ? " وأضفنا لك عناية لتحت العين." : "") };
    if (concern === "glow") return { kit: "k-glow", why: "اخترنا روتين النضارة والترطيب: ترطيب على طبقات بالهيالورونيك، وفيتامين C للإشراقة، وواقي يحافظ عليها." };
    if (concern === "pores") return type === "dry"
      ? { kit: "k-combo", why: "المسام واضحة لكن بشرتك تميل للجفاف، فاخترنا التوازن الذكي." }
      : { kit: "k-oily", why: "اخترنا روتين التوازن والنقاء بالنياسيناميد لتقليل المسام واللمعان." };
    const map = { dry: "k-dry", oily: "k-oily", combo: "k-combo", normal: "k-normal" };
    return { kit: map[type] || "k-normal", why: "اخترنا الروتين المناسب لنوع بشرتك للمحافظة عليها." };
  }
  function pickHairKit(type) {
    const map = { dry: "h-dry", oily: "h-oily", curly: "h-curly", damaged: "h-damaged", normal: "h-normal" };
    return { kit: map[type] || "h-normal", why: "اخترنا الروتين حسب نوع شعرك." };
  }

  /* أسباب استبعاد منتج: مكوّن تتحسس منه، أو (للحبوب الفطرية) منتج قد يغذي الفطريات */
  // الحمل والرضاعة: نستبعد الريتينويدات، والساليسيليك اللي يبقى على البشرة (الغسول مسموح)
  const PREG_RE = /retinol|retinal|retinoid|adapalene|tretinoin|الريتينول|الريتينال/i;
  const pregnancyUnsafe = p => PREG_RE.test((p.nameEn || "") + " " + (p.name || "") + " " + (p.desc || "")) ||
    (/salicylic|\bbha\b|الساليسيليك|drying lotion/i.test((p.nameEn || "") + " " + (p.desc || "")) && !/cleanser|wash|gel cleanser|shampoo|غسول|شامبو/i.test((p.nameEn || "") + " " + (p.name || "")) && p.cat === "skin");
  const badReasons = (p, allergens) => {
    const r = (p.contains || []).filter(c => allergens.includes(c));
    if (allergens.includes("pregnancy") && pregnancyUnsafe(p)) r.push("pregnancy");
    if (allergens.includes("fungal") && p.cat === "skin" && p.fungal === false) r.push("fungal");
    return r;
  };
  function applyAllergies(productIds, allergens, suitsKey, productMap) {
    const swaps = [], out = [];
    for (const id of productIds) {
      const p = productMap[id];
      const bad = badReasons(p, allergens);
      if (!bad.length) { out.push(id); continue; }
      const candidates = Object.values(productMap).filter(q =>
        q.active !== false && q.kitEligible !== false && q.cat === p.cat && q.step === p.step && q.id !== p.id &&
        !badReasons(q, allergens).length && !out.includes(q.id) && !productIds.includes(q.id));
      const alt = candidates.find(q => (q.suits || []).includes(suitsKey)) || candidates[0];
      if (alt) { out.push(alt.id); swaps.push({ from: p.id, to: alt.id, reason: bad }); }
      else swaps.push({ from: p.id, to: null, reason: bad });
    }
    return { productIds: out, swaps };
  }

  /* catalog = { products: [...], kits: [...] } */
  function recommend(rawAnswers, catalog) {
    const answers = normalize(rawAnswers);
    const productMap = Object.fromEntries(catalog.products.map(p => [p.id, p]));
    const kitMap = Object.fromEntries(catalog.kits.map(k => [k.id, k]));
    // حساسية العميلة تنطبق على كل الروتينات؛ أما استبعاد العطور للبشرة الحساسة والمنتجات اللي تغذي الفطريات فيخص روتين البشرة بس
    const userAllergens = (answers.allergies || []).filter(a => a !== "none");
    if (answers.pregnant && !userAllergens.includes("pregnancy")) userAllergens.push("pregnancy");
    const allergens = [...userAllergens];
    const skinAllergens = [...userAllergens];
    if ((answers.skinType === "sensitive" || answers.barrierDamaged) && !skinAllergens.includes("fragrance")) skinAllergens.push("fragrance");

    const picks = [];
    if (answers.focus !== "hair") {
      const sk = pickSkinKit(answers.skinType, answers.concern, answers.barrierDamaged, answers.age);
      if (answers.barrierDamaged && !sk.barrier) sk.why += " وبما إن حاجز بشرتك متضرر، رشحنا لك كريم ترميم، وخففي الأحماض والريتينول لين يرتاح.";
      if (sk.avoidFungal && !skinAllergens.includes("fungal")) skinAllergens.push("fungal");
      skinAllergens.forEach(x => { if (!allergens.includes(x)) allergens.push(x); });
      const mk = answers.profile.marks;
      if (mk.length) sk.why += mk.includes("pih") && mk.includes("pie") ? " آثارك نوعين: الحمراء (PIE) تهديها السنتيلا والنياسيناميد، والبنية (PIH) يفتحها فيتامين C والأحماض، والواقي أهم شي للاثنين."
        : mk.includes("pih") ? " آثارك بنية (PIH)، وهذي يفتحها فيتامين C والأحماض، والواقي يمنعها تغمق." : " آثارك حمراء (PIE)، وهذي تهديها السنتيلا والنياسيناميد وتخف مع الوقت والواقي.";
      picks.push({ ...sk, suits: answers.skinType, al: skinAllergens });
    }
    if (answers.focus !== "skin") {
      const hk = pickHairKit(answers.hairType), pr = answers.profile;
      const extra = [pr.frizz.length ? "يقلل الهيشان" : "", pr.thickness.includes("fine") ? "بمنتجات خفيفة ما تثقل الشعر الناعم" : "", pr.thickness.includes("thick") ? "بترطيب أعمق للشعر الكثيف" : "", pr.hairTypes.includes("coily") ? "ومناسب للشعر الكِنكي" : ""].filter(Boolean);
      picks.push({ ...hk, why: hk.why + (extra.length ? " " + extra.join("، ") + "." : ""), suits: answers.hairType, al: userAllergens });
    }

    const budget = answers.budget || "mid";
    const max = BUDGET_MAX[budget];
    const tiers = picks.map(() => BUDGET_TIER[budget]);
    const build = () => picks.map((pk, i) => {
      const kit = kitMap[pk.kit];
      const { productIds, swaps } = applyAllergies(kit.tiers[tiers[i]], pk.al, pk.suits, productMap);
      return { kitId: kit.id, tier: tiers[i], productIds, swaps, why: pk.why, price: kitPrice(productIds, productMap), allergens: pk.al };
    });
    let result = build();
    const total = () => result.reduce((s, r) => s + r.price, 0);
    // القاعدة 7: نخفّض من آخر روتين (الشعر) أولاً
    while (total() > max) {
      let idx = -1;
      for (let i = tiers.length - 1; i >= 0; i--) if (tiers[i] !== "basic") { idx = i; break; }
      if (idx === -1) break;
      tiers[idx] = TIERS[TIERS.indexOf(tiers[idx]) - 1];
      result = build();
    }
    const notes = [];
    if (total() > max && result.length > 1) {
      notes.push("الروتينين معاً يتجاوزان ميزانيتك قليلاً، تقدرين تبدئين بروتين البشرة وتضيفين الشعر لاحقاً.");
    }
    if (allergens.length) notes.push("استبعدنا المنتجات اللي فيها: " + allergens.map(a => REASON_AR[a]).join("، ") + ".");
    const consult = picks.some(p => p.consult) || !!answers.seeDoctor || !!answers.dandruffSevere;
    const consultWhy = answers.doctorReason || (answers.concern === "hormonal"
      ? "الحبوب الهرمونية تحتاج تقييم طبي (أحياناً تحاليل أو علاج بوصفة)، والروتين يساندك بس ما يغني عن العلاج."
      : answers.concern === "fungal" ? "الحبوب الفطرية تشبه الحبوب العادية، والطبيبة تأكد التشخيص وتصرف العلاج المضاد للفطريات إذا احتجتي."
      : answers.dandruffSevere ? "القشرة الكثيفة أو اللي معها احمرار ممكن تكون التهاب جلدي دهني (seborrheic dermatitis)، وهذا تشخصه الطبيبة وأحياناً يحتاج علاج بوصفة." : "");
    return { kits: result, total: total(), notes, allergens, consult, consultWhy, profile: answers.profile };
  }

  const REASON_AR = { fragrance: "العطور", alcohol: "الكحول", nuts: "زيوت المكسرات", fungal: "مكونات قد تغذي الفطريات", pregnancy: "مكونات ما تناسب الحمل والرضاعة (مثل الريتينول والساليسيليك المركّز)" };

  /* ---------- تحليل البشرة بالذكاء الاصطناعي ----------
     نفس التعليمات تُستخدم في الخادم (Anthropic API) وفي نسخة الرابط (قدرة "اسألي Claude"). */
  const ANALYSIS_PROMPT = `أنتِ مساعدة عناية بالبشرة في متجر "رينورا". الصورة المرفقة صورة وجه أرسلتها العميلة لتقترحي لها روتين عناية.
مهمتك: وصف ما يظهر في الصورة من ناحية العناية بالبشرة فقط، بدون تشخيص طبي وبدون أي تعليق على الشكل أو الجمال.
إذا الصورة ليست لوجه، أو الإضاءة/الوضوح لا يسمح بالتقييم، اجعلي photoQuality = "poor" ووضحي السبب، وخلي بقية الحقول بأقل ثقة.
اكتبي النصوص بالعربي بلهجة سعودية بيضاء ودودة، بصيغة المؤنث، وبجمل قصيرة.
أرجعي فقط كائن JSON واحد بهذا الشكل:
{
  "photoQuality": "good" | "poor",
  "qualityNote": "جملة قصيرة عن جودة الصورة",
  "skinType": "dry" | "oily" | "combo" | "normal" | "sensitive" | "unknown",
  "primaryConcern": "acne" | "hormonal" | "fungal" | "pigment" | "dryness" | "pores" | "none",
  "concerns": [ { "key": "acne" | "hormonal" | "fungal" | "pigment" | "marks" | "dryness" | "pores" | "redness" | "oil", "confidence": "low" | "medium" | "high", "note": "ملاحظة قصيرة عن مكانها أو شكلها" } ],
  "observations": ["2 إلى 4 ملاحظات قصيرة"],
  "seeDoctor": true | false,
  "doctorReason": "لماذا ننصح بالطبيبة، أو نص فارغ",
  "summary": "جملتين تلخصين فيها حالة البشرة والخطوة الجاية"
}
قواعد: "hormonal" فقط إذا الحبوب عميقة/ملتهبة ومتركزة حول الذقن والفك. "fungal" فقط إذا حبوب صغيرة متشابهة جداً ومتجمعة (غالباً الجبهة) — ودائماً مع seeDoctor = true لأنها تحتاج تأكيد.
اجعلي seeDoctor = true أيضاً إذا ظهرت حبوب كيسية أو التهاب شديد أو بقع غير معتادة أو أي شيء يحتاج تقييم طبي.`;
  const AI_KEYS = { skinType: ["dry", "oily", "combo", "normal", "sensitive"], concern: ["acne", "hormonal", "fungal", "pigment", "dryness", "pores", "glow", "aging", "none"] };
  /* يحوّل نتيجة التحليل + اختيارات العميلة (الميزانية والحساسية) إلى إجابات الاختبار */
  function analysisToAnswers(ai, extra = {}) {
    return {
      focus: "skin",
      skinType: AI_KEYS.skinType.includes(ai.skinType) ? ai.skinType : "normal",
      concern: AI_KEYS.concern.includes(ai.primaryConcern) ? ai.primaryConcern : "none",
      allergies: extra.allergies && extra.allergies.length ? extra.allergies : ["none"],
      budget: extra.budget || "mid",
      seeDoctor: !!ai.seeDoctor, doctorReason: ai.doctorReason || "", source: "ai"
    };
  }
  function parseJSONLoose(text) {
    try { return JSON.parse(text); } catch {}
    const a = text.indexOf("{"), b = text.lastIndexOf("}");
    if (a !== -1 && b > a) { try { return JSON.parse(text.slice(a, b + 1)); } catch {} }
    return null;
  }

  /* ---------- حلول المشكلة في المتجر ----------
     نرتب المنتجات حسب ملاءمتها للمشكلة، ونطلع: ترشيح رينورا، الأوفر، الفاخر. */
  function solutionsFor(section, concern, products, bestPicks) {
    let list = products.filter(p => p.active !== false && p.cat === section);
    if (concern === "fungal") list = list.filter(p => p.fungal !== false && ((p.goodFor || []).includes("fungal") || p.fungal === true));
    else list = list.filter(p => (p.goodFor || []).includes(concern));
    const score = p => {
      const i = (p.goodFor || []).indexOf(concern);
      return (i === 0 ? 3 : i === 1 ? 2 : i > 1 ? 1 : 0.5) + (p.kitEligible !== false ? 1 : 0) - (p.demo ? 1.5 : 0) + (concern === "fungal" && p.fungal === true ? 1 : 0);
    };
    list.sort((a, b) => score(b) - score(a) || a.price - b.price);
    const pick = bestPicks && bestPicks[section + ":" + concern];
    let best = pick ? list.find(p => p.brand.toUpperCase() === pick[0].toUpperCase() && (p.nameEn || "").toLowerCase().includes(pick[1].toLowerCase())) : null;
    if (!best) best = list.find(p => !p.demo) || list[0] || null;
    let others = list.filter(p => p !== best && !p.demo);
    // الأوفر والفاخر من ماركات غير ماركة الترشيح، إذا فيه
    if (best && others.some(p => p.brand !== best.brand)) others = others.filter(p => p.brand !== best.brand);
    const value = others.length ? others.reduce((m, p) => p.price < m.price ? p : m) : null;
    const lux = others.filter(p => p !== value);
    const luxury = lux.length ? lux.reduce((m, p) => p.price > m.price ? p : m) : null;
    return { best, bestWhy: pick && best && best.brand.toUpperCase() === pick[0].toUpperCase() ? pick[2] : "", value, luxury: luxury && value && luxury.price > value.price ? luxury : null, list };
  }

  /* «ابني روتينك»: لكل خطوة في الروتين نطلع ترشيحنا + بدائل من ماركات ثانية تحل نفس الاحتياج */
  function stepOptions(kitRes, section, profile, products, allergens) {
    const pMap = Object.fromEntries(products.map(p => [p.id, p]));
    const concerns = (profile && (section === "skin" ? profile.skinConcerns : profile.hairConcerns)) || [];
    const fine = profile && profile.thickness && profile.thickness.includes("fine");
    const al = allergens || [];
    const used = new Set(kitRes.productIds);
    return kitRes.productIds.map(id => {
      const def = pMap[id]; if (!def) return null;
      let c = products.filter(p => p.active !== false && p.cat === section && p.category === def.category && p.id !== id && !p.demo && p.brand !== def.brand);
      if (al.filter(x => x !== "fungal").length) c = c.filter(p => p.kitEligible !== false && !badReasons(p, al).length);
      if (al.includes("fungal")) c = c.filter(p => p.fungal !== false);
      if (fine && section === "hair") c = c.filter(p => !["tub", "jar"].includes((p.pack || {}).shape) || p.category === "mask");
      const overlap = p => (p.goodFor || []).filter(g => concerns.includes(g)).length;
      if (concerns.length) c = c.filter(p => overlap(p) > 0);
      c.sort((a, b) => (overlap(b) * 2 + (b.kitEligible !== false)) - (overlap(a) * 2 + (a.kitEligible !== false)) || a.price - b.price);
      const alts = []; for (const p of c) { if (alts.length >= 2) break; if (!used.has(p.id) && !alts.some(x => x.brand === p.brand)) { alts.push(p); used.add(p.id); } }
      return { category: def.category, step: def.step, options: [def, ...alts] };
    }).filter(Boolean);
  }

  /* «ابني روتينك» الكامل: كل أنواع منتجات القسم (مو بس اللي في الروتين).
     لكل نوع: قائمة مرتبة من الأنسب للأقل، والعميلة تختار وش تضيف، وتقدر تشيل أي منتج ما يعجبها ويطلع لها اللي بعده. */
  const LEAVE = p => /leave[- ]?in/i.test(p.nameEn || ""), MOUSSE = p => /mousse|whip/i.test(p.nameEn || "");
  const WASH = p => /co-?wash|conditioning wash|cleans|shampoo/i.test(p.nameEn || "");
  const SLOTS = {
    hair: [
      { key: "shampoo", label: "شامبو", m: p => p.category === "shampoo" || (p.category === "curly" && WASH(p)) },
      { key: "conditioner", label: "بلسم", m: p => (p.category === "conditioner" || (p.category === "curly" && /conditioner/i.test(p.nameEn || ""))) && !LEAVE(p) },
      { key: "mask", label: "ماسك", m: p => p.category === "mask" },
      { key: "serum", label: "سيروم الشعر", m: p => p.category === "hairserum" || (p.category === "oil" && /serum/i.test(p.nameEn || "")) },
      { key: "oil", label: "زيت الشعر", m: p => p.category === "oil" },
      { key: "leavein", label: "ليف إن وكريم تعريف", m: p => p.category === "curly" && !MOUSSE(p) || (LEAVE(p) && p.category !== "mousse") || p.category === "styling" },
      { key: "mousse", label: "موس", m: p => p.category === "mousse" || MOUSSE(p) },
      { key: "heat", label: "حامي حرارة", m: p => p.category === "heat" },
      { key: "scalp", label: "علاج الفروة والتساقط", m: p => p.category === "treatment" }
    ],
    skin: [
      { key: "cleanser", label: "غسول", m: p => p.category === "cleanser" },
      { key: "toner", label: "تونر", m: p => p.step === "toner" || /toner|pad/i.test(p.nameEn || "") },
      { key: "serum", label: "سيروم", m: p => p.category === "serum" },
      { key: "mask", label: "ماسك", m: p => p.step === "mask" || /mask|jelly/i.test(p.nameEn || "") },
      { key: "treatment", label: "علاج موضعي ومقشر", m: p => p.category === "treatment" },
      { key: "eye", label: "العناية بالعين", m: p => p.category === "eye" },
      { key: "moisturizer", label: "مرطب", barrierLabel: "مرطب وكريم ترميم", m: p => p.category === "moisturizer" },
      { key: "spf", label: "واقي شمس", m: p => p.category === "spf" }
    ]
  };
  const SLOT_ORDER = { hair: ["shampoo", "conditioner", "mask", "serum", "oil", "leavein", "mousse", "heat", "scalp"], skin: ["cleanser", "toner", "serum", "treatment", "eye", "moisturizer", "spf", "mask"] };
  const slotOf = p => { const sl = SLOTS[p.cat]; if (!sl) return null; const f = sl.find(s => s.m(p)); return f ? f.key : null; };
  function routineSlots(kitRes, section, profile, products, allergens) {
    const pMap = Object.fromEntries(products.map(p => [p.id, p]));
    const concerns = (profile && (section === "skin" ? profile.skinConcerns : profile.hairConcerns)) || [];
    const fine = profile && profile.thickness && profile.thickness.includes("fine");
    const al = allergens || [];
    let pool = products.filter(p => p.active !== false && p.cat === section && !p.demo);
    if (al.filter(x => x !== "fungal" && x !== "pregnancy").length) pool = pool.filter(p => p.kitEligible !== false && !badReasons(p, al).length);
    if (al.includes("pregnancy")) pool = pool.filter(p => !pregnancyUnsafe(p));
    if (al.includes("fungal")) pool = pool.filter(p => p.fungal !== false);
    if (fine && section === "hair") pool = pool.filter(p => !["tub", "jar"].includes((p.pack || {}).shape) || p.category === "mask");
    const overlap = p => (p.goodFor || []).filter(g => concerns.includes(g)).length;
    const kitProducts = (kitRes.productIds || []).map(id => pMap[id]).filter(Boolean);
    const barrier = profile && profile.barrier && profile.barrier.length;
    const dandruff = concerns.includes("dandruff"), severe = profile && profile.dandruff && profile.dandruff.some(x => x === "severe" || x === "red");
    return SLOT_ORDER[section].map(key => { let included = false;
      const def = SLOTS[section].find(s => s.key === key);
      const kitP = kitProducts.find(p => slotOf(p) === key);
      const c = pool.filter(p => slotOf(p) === key && (!kitP || p.id !== kitP.id));
      if (kitP) c.push(kitP);
      // الأنسب: يحل أكثر احتياجاتها، بعدها منتج الروتين، والمنتجات اللي مكوناتها مراجعة، وبعدها السعر
      const score = p => overlap(p) * 3 + (kitP && p.id === kitP.id ? 1 : 0) + (p.kitEligible !== false ? 0.5 : 0);
      c.sort((a, b) => score(b) - score(a) || a.price - b.price);
      let cands = c;
      // حاجز متضرر: كريم الترميم الأنسب يصير الأول في المرطب
      if (barrier && key === "moisturizer") cands = [...cands].sort((a, b) => ((b.goodFor || []).includes("barrier") - (a.goodFor || []).includes("barrier")));
      // قشرة: شامبو القشرة يصير الأول (والعلاجي أول لو القشرة كثيفة)
      if (dandruff && key === "shampoo") { const dd = p => (p.goodFor || []).includes("dandruff") ? (severe && /ketoconazole|ds|t\/gel|medicated/i.test(p.nameEn) ? 2 : 1) : 0; cands = [...cands].sort((a, b) => dd(b) - dd(a)); }
      // مشاكل لها خطوة خاصة: الهالات ← العناية بالعين، الأطراف المتقصفة ← زيت الشعر
      if (((key === "eye" && concerns.includes("eyes")) || (key === "oil" && concerns.includes("splitEnds"))) && !kitP && cands.length) included = true;
      return { key, label: barrier && def.barrierLabel ? def.barrierLabel : dandruff && key === "shampoo" ? "شامبو القشرة" : def.label, candidates: cands.map(p => p.id), included: included || !!kitP };
    }).filter(s => s.candidates.length);
  }

  return { DELIVERY, EXPRESS_CITIES, QUIZ, routineSlots, slotOf, pregnancyUnsafe, TIERS, REASON_AR, solutionsFor, normalize, stepOptions, ANALYSIS_PROMPT, analysisToAnswers, parseJSONLoose, KIT_DISCOUNT, SUB_DISCOUNT, kitPrice, sumProducts, shippingFor, recommend };
});
