/* =========================================================
   رينورا — تحليل البشرة على جهاز العميلة (بدون إنترنت أو مفتاح)
   تحليل تقريبي بالرؤية الحاسوبية البسيطة على الصورة:
   - كشف منطقة البشرة بنموذج لون YCbCr
   - تقسيم الوجه: الجبهة، منطقة T، الخدود، الذقن والفك
   - قياس اللمعان، الاحمرار، الحبوب (بقع حمراء صغيرة) ومكانها، البقع الداكنة
   يرجع نفس شكل نتيجة تحليل Claude عشان يمر على نفس قواعد التوصية.
   الصورة ما تطلع من الجهاز.
   ========================================================= */
(function (root, factory) {
  if (typeof module !== "undefined" && module.exports) module.exports = factory();
  else root.SkinScan = factory();
})(typeof self !== "undefined" ? self : this, function () {

  /* يحسب المقاييس من بيانات البكسلات (RGBA) — دالة نقية قابلة للاختبار */
  function measure(data, W, H) {
    const N = W * H;
    const Y = new Float32Array(N), RG = new Float32Array(N), skin = new Uint8Array(N), S = new Float32Array(N);
    let skinCount = 0;
    for (let i = 0; i < N; i++) {
      const r = data[i * 4], g = data[i * 4 + 1], b = data[i * 4 + 2];
      const y = 0.299 * r + 0.587 * g + 0.114 * b;
      const cb = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b;
      const cr = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b;
      const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
      Y[i] = y; RG[i] = r - g; S[i] = mx ? (mx - mn) / mx : 0;
      // نطاق البشرة + السماح بنقاط اللمعان الفاتحة القريبة من البشرة
      if ((cr >= 133 && cr <= 180 && cb >= 77 && cb <= 135 && y > 45) || (y > 205 && S[i] < 0.28 && cr > 128)) { skin[i] = 1; skinCount++; }
    }
    // صندوق الوجه: الصفوف والأعمدة اللي فيها بشرة كافية
    const rowHas = r => { let c = 0; for (let x = 0; x < W; x++) c += skin[r * W + x]; return c > W * 0.12; };
    const colHas = x => { let c = 0; for (let r = 0; r < H; r++) c += skin[r * W + x]; return c > H * 0.12; };
    let top = 0, bot = H - 1, left = 0, right = W - 1;
    while (top < H && !rowHas(top)) top++;
    while (bot > top && !rowHas(bot)) bot--;
    while (left < W && !colHas(left)) left++;
    while (right > left && !colHas(right)) right--;
    const bw = right - left + 1, bh = bot - top + 1;

    // متوسط محلي (ضبابية صندوقية) لكشف البقع مقارنة بما حولها
    const blur = (src, rad) => {
      const out = new Float32Array(N), tmp = new Float32Array(N);
      for (let y = 0; y < H; y++) { let s = 0, c = 0; for (let x = -rad; x < W; x++) {
        if (x + rad < W) { s += src[y * W + x + rad]; c++; } if (x - rad - 1 >= 0) { s -= src[y * W + x - rad - 1]; c--; } if (x >= 0) tmp[y * W + x] = s / c; } }
      for (let x = 0; x < W; x++) { let s = 0, c = 0; for (let y = -rad; y < H; y++) {
        if (y + rad < H) { s += tmp[(y + rad) * W + x]; c++; } if (y - rad - 1 >= 0) { s -= tmp[(y - rad - 1) * W + x]; c--; } if (y >= 0) out[y * W + x] = s / c; } }
      return out;
    };
    const rad = Math.max(3, Math.round(Math.min(bw, bh) / 22));
    const mRG = blur(RG, rad), mY = blur(Y, rad);

    // المناطق داخل صندوق الوجه
    const region = (x, y) => {
      const fx = (x - left) / bw, fy = (y - top) / bh;
      if (fx < 0 || fx > 1 || fy < 0 || fy > 1) return null;
      if (fy < 0.28) return "forehead";
      if (fy > 0.74) return "chin";
      if (fx > 0.36 && fx < 0.64) return "tzone";
      return "cheeks";
    };
    const R = { forehead: {}, tzone: {}, cheeks: {}, chin: {} };
    for (const k in R) Object.assign(R[k], { n: 0, shine: 0, red: 0, y: 0, y2: 0, redSpot: 0, darkSpot: 0 });

    const redMark = new Uint8Array(N), darkMark = new Uint8Array(N);
    let ySum = 0;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const i = y * W + x; if (!skin[i]) continue;
      const g = region(x, y); if (!g) continue;
      const a = R[g]; a.n++; ySum += Y[i];
      a.y += Y[i]; a.y2 += Y[i] * Y[i]; a.red += RG[i];
      if (Y[i] > 212 && S[i] < 0.3) a.shine++;
      if (RG[i] - mRG[i] > 22 && Y[i] > 50) { redMark[i] = 1; }
      else if (mY[i] - Y[i] > 24 && RG[i] - mRG[i] < 10 && Y[i] > 40) { darkMark[i] = 1; }
    }
    // عدّ البقع (مكونات متصلة صغيرة)
    const blobs = mark => {
      const seen = new Uint8Array(N), list = [];
      const maxArea = Math.max(40, (bw * bh) * 0.006);
      for (let i = 0; i < N; i++) {
        if (!mark[i] || seen[i]) continue;
        let area = 0, sx = 0, sy = 0; const st = [i]; seen[i] = 1;
        while (st.length) { const j = st.pop(); area++; sx += j % W; sy += (j / W) | 0;
          for (const d of [1, -1, W, -W]) { const k = j + d; if (k >= 0 && k < N && mark[k] && !seen[k]) { seen[k] = 1; st.push(k); } } }
        if (area >= 2 && area <= maxArea) list.push({ area, x: sx / area, y: sy / area });
      }
      return list;
    };
    const reds = blobs(redMark), darks = blobs(darkMark);
    for (const b of reds) { const g = region(b.x, b.y); if (g) R[g].redSpot++; }
    for (const b of darks) { const g = region(b.x, b.y); if (g) R[g].darkSpot++; }
    const areas = reds.map(b => b.area), meanA = areas.reduce((s, a) => s + a, 0) / (areas.length || 1);
    const cvArea = areas.length > 2 ? Math.sqrt(areas.reduce((s, a) => s + (a - meanA) ** 2, 0) / areas.length) / meanA : 1;

    const pct = (a, k) => a.n ? a[k] / a.n : 0;
    const std = a => a.n ? Math.sqrt(Math.max(0, a.y2 / a.n - (a.y / a.n) ** 2)) : 0;
    return {
      skinRatio: skinCount / N, faceBox: { left, top, w: bw, h: bh }, meanY: ySum / Math.max(1, skinCount),
      shine: { t: (R.tzone.shine + R.forehead.shine) / Math.max(1, R.tzone.n + R.forehead.n), cheeks: pct(R.cheeks, "shine") },
      redness: { cheeks: pct(R.cheeks, "red"), forehead: pct(R.forehead, "red"), all: (R.cheeks.red + R.forehead.red + R.tzone.red + R.chin.red) / Math.max(1, R.cheeks.n + R.forehead.n + R.tzone.n + R.chin.n) },
      spots: { forehead: R.forehead.redSpot, tzone: R.tzone.redSpot, cheeks: R.cheeks.redSpot, chin: R.chin.redSpot, total: reds.length, sizeCV: cvArea },
      dark: { total: darks.length }, toneStd: (std(R.cheeks) + std(R.forehead)) / 2
    };
  }

  /* يحوّل المقاييس لنتيجة بنفس شكل تحليل Claude */
  function interpret(m) {
    const out = { method: "local", photoQuality: "good", qualityNote: "", concerns: [], observations: [], seeDoctor: false, doctorReason: "" };
    if (m.skinRatio < 0.12 || m.faceBox.w < 20 || m.faceBox.h < 20) {
      return { ...out, photoQuality: "poor", qualityNote: "ما قدرنا نلقى وجه واضح في الصورة.", skinType: "unknown", primaryConcern: "none",
        summary: "جربي صورة أمامية للوجه قريبة وبإضاءة نهار، أو جاوبي أسئلة الاختبار." };
    }
    if (m.meanY < 75 || m.meanY > 225) { out.photoQuality = "poor"; out.qualityNote = m.meanY < 75 ? "الصورة مظلمة شوي." : "الإضاءة قوية جداً على الصورة."; }

    // نوع البشرة من اللمعان والاحمرار
    const tS = m.shine.t, cS = m.shine.cheeks;
    let skinType = "normal";
    if (tS > 0.045 && cS > 0.015) skinType = "oily";
    else if (tS > 0.03 && cS <= 0.015) skinType = "combo";
    else if (tS < 0.002 && cS < 0.002) skinType = "dry";
    const redHigh = m.redness.cheeks > m.redness.forehead + 6.5;
    if (redHigh && skinType !== "oily") skinType = "sensitive";
    out.skinType = skinType;
    if (tS > 0.035) out.observations.push("لمعان واضح في منطقة T (الجبهة والأنف).");
    if (skinType === "dry") out.observations.push("ما فيه لمعان تقريباً، وهذا غالباً يدل على بشرة تميل للجفاف.");
    if (redHigh) { out.concerns.push({ key: "redness", confidence: "medium", note: "احمرار أوضح على الخدود من باقي الوجه." }); out.observations.push("احمرار على الخدود ممكن يدل على حساسية."); }

    // الحبوب ومكانها
    const sp = m.spots, acneTotal = sp.total;
    let primary = "none";
    if (acneTotal >= 5) {
      const chinShare = sp.chin / acneTotal, foreShare = sp.forehead / acneTotal;
      if (sp.chin >= 3 && chinShare >= 0.45) {
        primary = "hormonal";
        out.concerns.push({ key: "hormonal", confidence: "low", note: `حبوب متركزة حول الذقن والفك (${sp.chin} تقريباً)، وهذا نمط الحبوب الهرمونية.` });
      } else if (sp.forehead >= 8 && foreShare >= 0.5 && m.spots.sizeCV < 0.6) {
        primary = "fungal";
        out.concerns.push({ key: "fungal", confidence: "low", note: "حبوب صغيرة متشابهة ومتجمعة على الجبهة، وهذا ممكن يكون حبوب فطرية." });
      } else {
        primary = "acne";
        out.concerns.push({ key: "acne", confidence: acneTotal >= 12 ? "medium" : "low", note: `حوالي ${acneTotal} حبة أو بقعة حمراء موزعة على الوجه.` });
      }
    }
    if (m.dark.total >= 8 || m.toneStd > 26) {
      out.concerns.push({ key: "pigment", confidence: "low", note: "بقع أغمق من لون البشرة أو لون غير متساوي." });
      if (primary === "none") primary = "pigment";
    }
    if (primary === "none" && skinType === "oily" && tS > 0.06) { primary = "pores"; out.concerns.push({ key: "oil", confidence: "medium", note: "دهون ولمعان واضح." }); }
    if (primary === "none" && skinType === "dry") primary = "dryness";
    out.primaryConcern = primary;

    if (primary === "hormonal" || primary === "fungal" || acneTotal >= 20) {
      out.seeDoctor = true;
      out.doctorReason = primary === "fungal" ? "الحبوب الفطرية تشبه العادية وتحتاج تأكيد من الطبيبة قبل العلاج."
        : primary === "hormonal" ? "نمط الحبوب حول الذقن والفك غالباً هرموني، والطبيبة تقيّم العلاج المناسب."
        : "عدد الحبوب كبير، والأفضل تقييم من طبيبة.";
    }
    const T = { dry: "تميل للجفاف", oily: "دهنية", combo: "مختلطة", normal: "متوازنة", sensitive: "حساسة" };
    out.summary = `بشرتك تبان ${T[skinType]}${out.concerns.length ? "، ولاحظنا " + out.concerns.map(c => ({ acne: "حبوب", hormonal: "حبوب حول الذقن", fungal: "حبوب صغيرة على الجبهة", pigment: "تصبغات", redness: "احمرار", oil: "لمعان" })[c.key]).join(" و") : ""}. هذا تحليل تقريبي على جهازك، عدّليه من أسئلة الاختبار إذا ما طابقك.`;
    if (!out.observations.length) out.observations.push("ما ظهرت مشاكل واضحة في الصورة.");
    return out;
  }

  /* في المتصفح: من صورة (dataURL) إلى نتيجة */
  function analyze(dataUrl) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const W = 256, H = Math.max(1, Math.round(img.height * W / img.width));
        const c = document.createElement("canvas"); c.width = W; c.height = H;
        const ctx = c.getContext("2d", { willReadFrequently: true }); ctx.drawImage(img, 0, 0, W, H);
        try { resolve(interpret(measure(ctx.getImageData(0, 0, W, H).data, W, H))); } catch (e) { reject(e); }
      };
      img.onerror = () => reject(new Error("ما قدرنا نقرأ الصورة"));
      img.src = dataUrl;
    });
  }

  return { analyze, measure, interpret };
});
