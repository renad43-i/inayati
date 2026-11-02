# هوية RENAURA

كل ملفات الهوية المعتمدة (باقة الألوان A) في مكان واحد.

| المجلد / الملف | وش فيه |
|---|---|
| `BRAND.md` | دليل الهوية: الألوان والخطوط وقواعد الشعار، مع كود CSS وTailwind جاهز |
| `colors.txt` | أكواد الألوان باختصار |
| `preview.png` | صورة تجمع كل نسخ الشعار |
| `logo/` | ملفات الشعار النهائية SVG وPNG (خلفية شفافة) + أيقونات المتصفح |
| `scripts/build_logo.py` | يرسم الشعار من جديد. عدّلي الألوان أو الخط فيه وشغليه |
| `scripts/export_png.js` | يطلع نسخ PNG والأيقونات من ملفات SVG |

## نسخ الشعار
- `renaura-logo-horizontal-no-tagline` — هيدر الموقع (هي نفسها `public/assets/logo.svg`)
- `renaura-logo-horizontal` / `renaura-logo` — مع عبارة SKIN · HAIR · GLOW
- `*-light` — للخلفيات الغامقة والحمراء (الفوتر يستخدم `public/assets/logo-light.svg`)
- `renaura-icon` / `renaura-icon-red` — صورة الحسابات وأيقونة الموقع
- `renaura-mark` — الأقواس لحالها بدون خلفية

## تعديل الشعار
```bash
pip install fonttools brotli
python3 brand/scripts/build_logo.py
node brand/scripts/export_png.js
```
بعدها انسخي الملفات اللي تبينها إلى `public/assets/` عشان تطلع في الموقع.

## صفحات مرجعية
- صفحة الهوية للفريق: https://claude.ai/artifact/TnBWL2s17pn5LTmnFmdbLR
- صفحة كل الاقتراحات والمسودات: https://claude.ai/artifact/MU7YZCbECGmv5LUW27wiHj
