# پورتفولیوی آرمین تحسیری

پورتفولیوی شخصی و استاتیک آرمین تحسیری، با تمرکز بر توسعه‌ی وب‌سایت‌های حرفه‌ای و ساخت قابلیت‌های هوشمند برای کسب‌وکارها.

## معرفی

این پروژه با HTML، CSS و JavaScript خام ساخته شده و به‌صورت فارسی و راست‌به‌چپ طراحی شده است. تمرکز اصلی سایت روی دو مسیر است:

- طراحی و توسعه‌ی وب‌سایت‌های سریع، responsive و سازگار با SEO
- ساخت قابلیت‌های هوش مصنوعی، دستیارهای RAG و اتوماسیون فرایندها

## قابلیت‌ها

- طراحی Swiss / Editorial با تم روشن
- هدر شیشه‌ای و responsive
- پشتیبانی از موبایل، تبلت و دسکتاپ
- منوی موبایل با کنترل کیبورد
- فرم همکاری با validation و honeypot ضداسپم
- اتصال فرم همکاری به Web3Forms
- فونت Vazirmatn به‌صورت self-host شده
- متادیتای فارسی و JSON-LD برای SEO
- Open Graph image با ابعاد 1200×630
- favicon اختصاصی
- رعایت `prefers-reduced-motion`
- پنهان‌سازی پروژه‌های Draft تا زمان آماده‌شدن واقعی

## پروژه‌های نمایش‌داده‌شده

### SmartDoor

نمونه‌ی اولیه‌ی سیستم کنترل دسترسی با تشخیص چهره.

فناوری‌ها: FastAPI، face_recognition، OpenCV، ESP32 و MicroPython.

### Sentra

ایجنت پشتیبانی دو‌زبانه مبتنی بر RAG برای جست‌وجو در مستندات داخلی و ارجاع موارد نامطمئن به نیروی انسانی.

فناوری‌ها: LangGraph، FastAPI، ChromaDB، aiogram و SQLite.

## ساختار فایل‌ها

```text
.
├── index.html                  # ساختار و محتوای اصلی سایت
├── style.css                  # طراحی، layout و responsive styles
├── script.js                  # منوی موبایل، modal و فرم همکاری
├── favicon.svg                # favicon سایت
├── og-image.png               # تصویر اشتراک‌گذاری 1200×630
├── og-image.svg               # نسخه‌ی برداری تصویر Open Graph
├── sitemap.xml                # نقشه‌ی سایت
├── robots.txt                 # قوانین دسترسی موتورهای جست‌وجو
├── assets/                    # تصویر پروفایل و آیکون‌های تماس
├── fonts/                     # فایل‌های محلی Vazirmatn
├── backup/                    # نسخه‌های پشتیبان محلی؛ نباید deploy شود
├── PORTFOLIO_TODO.md          # کارهای دستی و اطلاعات تکمیل‌نشده
└── .gitignore                 # فایل‌های خارج از نسخه‌ی عمومی
```

## اجرای محلی

برای اجرای ساده‌ی پروژه، در پوشه‌ی اصلی یکی از روش‌های زیر را استفاده کن:

```bash
python3 -m http.server 8000
```

سپس آدرس زیر را در مرورگر باز کن:

```text
http://localhost:8000
```

بازکردن مستقیم `index.html` معمولاً برای بررسی ظاهر کار می‌کند، اما برای تست کامل فونت‌ها، assetها و فرم بهتر است از سرور محلی استفاده شود.

## فرم همکاری

فرم همکاری از endpoint زیر استفاده می‌کند:

```text
https://api.web3forms.com/submit
```

Access Key داخل `script.js` قرار دارد و برای فرم‌های سمت‌کاربر Web3Forms طراحی شده است. این کلید را در README، issueها یا پیام‌های عمومی منتشر نکن.

برای تغییر تنظیمات فرم، بخش `CONFIG` در `script.js` را بررسی کن:

```js
const CONFIG = {
  email: '',
  phone: '09135561741',
  telegram: 'https://t.me/Armiinths',
  linkedin: '',
  tryhackme: '',
  portswigger: '',
  formEndpoint: 'https://api.web3forms.com/submit'
};
```

اگر Access Key جدید ساختی، مقدار آن را فقط در `formAccessKey` جایگزین کن. اطلاعات ورود حساب Web3Forms را داخل پروژه قرار نده.

## انتشار روی GitHub Pages

مخزن انتشار باید نام زیر را داشته باشد:

```text
armintahsiri.github.io
```

مراحل انتشار:

1. فایل‌های پروژه را روی branch اصلی، معمولاً `main`، push کن.
2. در GitHub به مسیر `Settings > Pages` برو.
3. گزینه‌ی `Deploy from a branch` را انتخاب کن.
4. branch `main` و پوشه‌ی `/root` را انتخاب کن.
5. چند دقیقه برای اجرای deployment صبر کن.
6. آدرس زیر را بررسی کن:

```text
https://armintahsiri.github.io/
```

قبل از انتشار عمومی، این فایل‌ها نباید deploy شوند:

- `backup/`
- `PORTFOLIO_TODO.md`
- `.DS_Store`

این موارد در `.gitignore` قرار گرفته‌اند.

## بررسی بعد از انتشار

بعد از هر انتشار، مسیرهای زیر را تست کن:

```text
https://armintahsiri.github.io/
https://armintahsiri.github.io/robots.txt
https://armintahsiri.github.io/sitemap.xml
https://armintahsiri.github.io/og-image.png
https://armintahsiri.github.io/favicon.svg
```

همچنین باید موارد زیر بررسی شوند:

- بازشدن منوی موبایل در عرض‌های مختلف
- باز و بسته‌شدن فرم همکاری
- ارسال موفق فرم و دریافت ایمیل
- نمایش صحیح تصویر پروفایل
- بارگذاری فونت Vazirmatn
- نبودن overflow افقی
- درست‌بودن عنوان و تصویر هنگام اشتراک‌گذاری لینک

## اطلاعات تماس

- GitHub: [armintahsiri](https://github.com/armintahsiri)
- Telegram: [@Armiinths](https://t.me/Armiinths)
- Phone: `09135561741`

## وضعیت فعلی

- سایت: آماده‌ی انتشار روی GitHub Pages
- پروژه‌های SmartDoor و Sentra: Prototype
- امنیت وب و تست نفوذ: در حال یادگیری
- لینک repo و demo اختصاصی پروژه‌ها: هنوز باید در صورت آماده‌شدن اضافه شوند
- LinkedIn، TryHackMe و PortSwigger: در صورت داشتن لینک عمومی قابل تکمیل هستند

## مجوز

این پروژه یک پورتفولیوی شخصی است. محتوای شخصی، تصویر، متن‌ها و اطلاعات تماس بدون اجازه‌ی مالک استفاده نشوند.
