

بک‌اند یک سامانه آموزش آنلاین مبتنی بر Node.js و Express.js.

این پروژه امکانات مدیریت کاربران، احراز هویت، ثبت‌نام با رمز یک‌بارمصرف، مدیریت دوره‌ها، ثبت‌نام در دوره، پرداخت آنلاین، مدیریت کامنت‌ها و پنل مدیریت را فراهم می‌کند.

## امکانات

* ثبت‌نام و ورود کاربران
* احراز هویت با JWT
* ثبت‌نام با رمز یک‌بارمصرف
* بازیابی رمز عبور
* تغییر رمز عبور
* مدیریت کاربران توسط مدیر
* مدیریت دوره‌ها
* ثبت‌نام کاربران در دوره‌ها
* پرداخت آنلاین با زرین‌پال
* اتصال به SpotPlayer برای مدیریت لایسنس دوره‌ها
* سیستم نظرات و پاسخ مدیر
* گزارش ورود کاربران
* گزارش فروش
* گزارش فروش ۱۴ روز اخیر
* مدیریت کاربران و دوره‌ها در پنل مدیریت
* بارگذاری تصویر و ویدیوی دوره
* محدودسازی درخواست‌ها
* اعتبارسنجی داده‌های ورودی
* محافظت در برابر برخی حملات رایج مانند NoSQL Injection و HTTP Parameter Pollution

## تکنولوژی‌ها

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcrypt
* Axios
* Multer
* Express Validator
* Helmet
* Express Rate Limit

## ساختار پروژه

```text
.
├── app.js
├── server.js
├── package.json
├── .env.example
└── scr
    ├── config
    ├── controllers
    ├── integrations
    ├── middlewares
    ├── models
    ├── routes
    ├── utils
    └── validators
```

## نصب

ابتدا مخزن را دریافت کنید:

```bash
git clone YOUR_REPOSITORY_URL
cd PROJECT_DIRECTORY
```

سپس وابستگی‌ها را نصب کنید:

```bash
npm install
```

فایل محیطی را ایجاد کنید:

```bash
.env
```

و مقادیر موردنیاز را در آن قرار دهید.

## متغیرهای محیطی

```env
JWT=
MONGO=
ZARINPALCALLBACK=
ZARINPALID=
SPOTID=
PHONE=
FARAZ_PATTERN_CODE=
FARAZ_API=
```

## اجرای پروژه

برای اجرای سرور:

```bash
npm start
```

سرور به صورت پیش‌فرض روی پورت `5000` اجرا می‌شود.

## API

مسیرهای اصلی API:

```text
/api/auth
/api/profile
/api/user
/api/admin
```

### احراز هویت

```text
POST /api/auth/register
POST /api/auth/applyregister
POST /api/auth/login
POST /api/auth/forgotpassword/enterphone
POST /api/auth/forgotpassword/entercode
POST /api/auth/changepassword
```

### کاربر

```text
GET  /api/profile/showprofile
GET  /api/profile/showcourse
GET  /api/profile/logout

GET  /api/user/paycourse/:courseid
POST /api/user/sendcomment/:courseid
GET  /api/user/enrollmentuser
```

### دوره‌ها

```text
GET /api/getcourses
GET /api/getcourse/:courseid
GET /api/getlicense/:courseId
GET /api/morecomment/:courseid
```

### مدیریت

مسیرهای مربوط به پنل مدیریت در زیرمسیر زیر قرار دارند:

```text
/api/admin
```

و برای عملیات مدیریتی از احراز هویت مدیر استفاده می‌شود.

## امنیت

در این پروژه از ابزارها و روش‌های زیر برای افزایش امنیت استفاده شده است:

* JWT برای احراز هویت
* bcrypt برای Hash کردن رمز عبور
* Helmet برای تنظیم HTTP Security Headers
* Express Rate Limit برای محدودسازی درخواست‌ها
* Express Validator برای اعتبارسنجی ورودی‌ها
* Express Mongo Sanitize برای کاهش ریسک NoSQL Injection
* HPP برای جلوگیری از HTTP Parameter Pollution
* محدودیت حجم درخواست‌های JSON
* بررسی ObjectIdهای MongoDB
* استفاده از Indexهای یکتا برای جلوگیری از ثبت‌نام تکراری در دوره‌ها

## وضعیت پروژه

این پروژه در حال توسعه و آماده‌سازی برای انتشار آنلاین است.

## توسعه‌دهنده

Amir
