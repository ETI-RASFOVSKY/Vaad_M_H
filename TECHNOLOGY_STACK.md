# פירוט מלא של הטכנולוגיות והספריות במערכת

## 📋 תוכן עניינים
1. [שפות תכנות](#שפות-תכנות)
2. [Backend - שרת](#backend---שרת)
3. [Frontend - ממשק משתמש](#frontend---ממשק-משתמש)
4. [מסד נתונים](#מסד-נתונים)
5. [שירותי ענן חיצוניים](#שירותי-ענן-חיצוניים)
6. [כלי פיתוח](#כלי-פיתוח)
7. [אריזה ופריסה](#אריזה-ופריסה)

---

## שפות תכנות

### JavaScript (ES6+)
- **שימוש:** שפת התכנות הראשית
- **גרסה:** ES6+ (Modern JavaScript)
- **מיקום:** Backend ו-Frontend

### TypeScript
- **שימוש:** Frontend - טיפוסים חזקים ל-React
- **גרסה:** 5.2.2
- **יתרונות:** זיהוי שגיאות בזמן פיתוח, קוד יותר בטוח

---

## Backend - שרת

### Node.js
- **תיאור:** סביבת ריצה ל-JavaScript בצד השרת
- **שימוש:** הרצת שרת Express

### Express.js (v4.18.2)
- **תיאור:** Framework ל-Node.js לבניית שרתים ו-APIs
- **שימוש:** יצירת REST API, ניהול routes, middleware
- **קישור:** https://expressjs.com/

### Prisma ORM (v5.7.1)
- **תיאור:** Object-Relational Mapping - ניהול מסד נתונים
- **שימוש:** 
  - הגדרת סכמת מסד נתונים (`schema.prisma`)
  - יצירת migrations
  - גישה למסד נתונים דרך Prisma Client
- **קישור:** https://www.prisma.io/

### JWT (JSON Web Tokens) - jsonwebtoken (v9.0.2)
- **תיאור:** יצירה ואימות טוקנים לאימות משתמשים
- **שימוש:** אימות מנהלים, שמירת סשן
- **קישור:** https://jwt.io/

### bcryptjs (v2.4.3)
- **תיאור:** הצפנת סיסמאות
- **שימוש:** הצפנת סיסמאות לפני שמירה במסד נתונים
- **קישור:** https://www.npmjs.com/package/bcryptjs

### express-validator (v7.0.1)
- **תיאור:** אימות נתונים בקלט (validation)
- **שימוש:** בדיקת תקינות אימיילים, סיסמאות, ונתונים אחרים
- **קישור:** https://express-validator.github.io/

### express-rate-limit (v7.1.5)
- **תיאור:** הגבלת מספר בקשות (rate limiting)
- **שימוש:** הגנה מפני התקפות brute force
- **קישור:** https://www.npmjs.com/package/express-rate-limit

### multer (v1.4.5-lts.1)
- **תיאור:** טיפול בהעלאת קבצים
- **שימוש:** העלאת תמונות וסרטונים
- **גבול:** 200MB
- **קישור:** https://www.npmjs.com/package/multer

### CORS (v2.8.5)
- **תיאור:** Cross-Origin Resource Sharing
- **שימוש:** מתן הרשאה ל-Frontend לגשת ל-Backend
- **קישור:** https://www.npmjs.com/package/cors

### dotenv (v16.3.1)
- **תיאור:** ניהול משתני סביבה
- **שימוש:** קריאת משתנים מ-`.env` (API keys, secrets)
- **קישור:** https://www.npmjs.com/package/dotenv

### nodemailer (v7.0.12)
- **תיאור:** שליחת מיילים
- **שימוש:** שליחת מיילים דרך Gmail (fallback)
- **קישור:** https://nodemailer.com/

### Resend (v6.7.0)
- **תיאור:** שירות שליחת מיילים מודרני
- **שימוש:** שליחת מיילים ראשית (קודים, הודעות)
- **קישור:** https://resend.com/

### google-auth-library (v10.5.0)
- **תיאור:** אימות Google OAuth
- **שימוש:** התחברות עם Google
- **קישור:** https://www.npmjs.com/package/google-auth-library

### nodemon (v3.0.2) - Development
- **תיאור:** אוטומציה להפעלה מחדש של השרת
- **שימוש:** פיתוח - השרת מתעדכן אוטומטית בעת שינוי קוד
- **קישור:** https://nodemon.io/

---

## Frontend - ממשק משתמש

### React (v18.2.0)
- **תיאור:** ספרייה לבניית ממשק משתמש
- **שימוש:** בניית כל הקומפוננטות והדפים
- **קישור:** https://react.dev/

### React Router DOM (v6.20.1)
- **תיאור:** ניהול ניווט ונתיבים
- **שימוש:** מעבר בין דפים (Home, About, Gallery, Contact, Admin)
- **קישור:** https://reactrouter.com/

### TypeScript (v5.2.2)
- **תיאור:** JavaScript עם טיפוסים
- **שימוש:** כל הקוד ב-Frontend
- **קישור:** https://www.typescriptlang.org/

### Vite (v5.0.8)
- **תיאור:** Build tool מהיר לפיתוח
- **שימוש:** בנייה והרצת פרויקט React
- **יתרונות:** מהיר מאוד, Hot Module Replacement
- **קישור:** https://vitejs.dev/

### Axios (v1.6.2)
- **תיאור:** HTTP client לבקשות API
- **שימוש:** תקשורת עם Backend (GET, POST, DELETE)
- **קישור:** https://axios-http.com/

### React Hook Form (v7.49.2)
- **תיאור:** ניהול טפסים
- **שימוש:** טפסי יצירת קשר, התחברות, הרשמה
- **קישור:** https://react-hook-form.com/

### Zod (v3.22.4)
- **תיאור:** אימות סכמות (schema validation)
- **שימוש:** אימות נתונים ב-React Hook Form
- **קישור:** https://zod.dev/

### @hookform/resolvers (v3.3.2)
- **תיאור:** חיבור בין React Hook Form ל-Zod
- **שימוש:** אינטגרציה בין React Hook Form ו-Zod
- **קישור:** https://www.npmjs.com/package/@hookform/resolvers

### Framer Motion (v10.16.16)
- **תיאור:** אנימציות
- **שימוש:** אנימציות במעבר בין דפים, אפקטים
- **קישור:** https://www.framer.com/motion/

### @react-oauth/google (v0.13.4)
- **תיאור:** התחברות עם Google OAuth
- **שימוש:** כפתור התחברות עם Google
- **קישור:** https://www.npmjs.com/package/@react-oauth/google

### Tailwind CSS (v3.3.6)
- **תיאור:** Framework לעיצוב
- **שימוש:** כל העיצוב והסטיילינג
- **יתרונות:** Utility-first, מהיר, גמיש
- **קישור:** https://tailwindcss.com/

### PostCSS (v8.4.32)
- **תיאור:** כלי לעיבוד CSS
- **שימוש:** עיבוד Tailwind CSS
- **קישור:** https://postcss.org/

### Autoprefixer (v10.4.16)
- **תיאור:** הוספת prefixes אוטומטית ל-CSS
- **שימוש:** תאימות לדפדפנים ישנים
- **קישור:** https://autoprefixer.github.io/

### ESLint (v8.55.0) - Development
- **תיאור:** בדיקת איכות קוד
- **שימוש:** זיהוי שגיאות ובעיות בקוד
- **קישור:** https://eslint.org/

---

## מסד נתונים

### PostgreSQL (v15-alpine)
- **תיאור:** מסד נתונים יחסי (Relational Database)
- **שימוש:** אחסון כל הנתונים (משתמשים, הודעות, מדיה)
- **גרסה:** 15 (Alpine Linux - גרסה קלה)
- **קישור:** https://www.postgresql.org/

### Docker PostgreSQL
- **תיאור:** PostgreSQL בתוך Docker container
- **שימוש:** פיתוח מקומי
- **פורט:** 5433 (host) → 5432 (container)

---

## שירותי ענן חיצוניים

### Cloudinary
- **תיאור:** שירות אחסון מדיה בענן
- **שימוש:** 
  - אחסון תמונות
  - אחסון סרטונים
  - עיבוד תמונות (resize, crop, etc.)
- **קישור:** https://cloudinary.com/

### Resend
- **תיאור:** שירות שליחת מיילים
- **שימוש:** 
  - שליחת קודי אימות
  - שליחת קודי איפוס סיסמה
  - שליחת הודעות יצירת קשר
- **קישור:** https://resend.com/

### Google OAuth
- **תיאור:** שירות אימות של Google
- **שימוש:** התחברות עם חשבון Google
- **קישור:** https://developers.google.com/identity/protocols/oauth2

---

## כלי פיתוח

### Docker
- **תיאור:** קונטיינריזציה
- **שימוש:** 
  - הרצת PostgreSQL
  - פריסת Backend ו-Frontend (אופציונלי)
- **קישור:** https://www.docker.com/

### Docker Compose
- **תיאור:** ניהול מספר containers יחד
- **שימוש:** הרצת PostgreSQL + Backend + Frontend יחד
- **קישור:** https://docs.docker.com/compose/

### Git
- **תיאור:** מערכת בקרת גרסאות
- **שימוש:** ניהול קוד, גיבויים, שיתוף

### NPM (Node Package Manager)
- **תיאור:** מנהל חבילות ל-Node.js
- **שימוש:** התקנת ספריות, הרצת scripts

### Concurrently (v8.2.2)
- **תיאור:** הרצת מספר פקודות במקביל
- **שימוש:** הרצת Backend ו-Frontend יחד (`npm run dev`)
- **קישור:** https://www.npmjs.com/package/concurrently

---

## אריזה ופריסה

### Vercel (אופציונלי)
- **תיאור:** פלטפורמת פריסה
- **שימוש:** פריסת Backend ו-Frontend
- **קישור:** https://vercel.com/

### Nginx (אופציונלי)
- **תיאור:** שרת web
- **שימוש:** הגשת קבצי Frontend בפריסה
- **קישור:** https://nginx.org/

---

## סיכום לפי קטגוריות

### 🔐 אבטחה
- JWT (jsonwebtoken)
- bcryptjs
- express-rate-limit
- express-validator

### 📧 מיילים
- Resend (ראשי)
- Nodemailer (fallback)
- Google OAuth (אימות)

### 🗄️ מסד נתונים
- PostgreSQL
- Prisma ORM

### 📁 קבצים
- Multer (העלאת קבצים)
- Cloudinary (אחסון מדיה)

### 🎨 עיצוב
- Tailwind CSS
- Framer Motion (אנימציות)

### 🔧 כלי פיתוח
- Vite
- TypeScript
- ESLint
- Nodemon
- Docker

### 🌐 תקשורת
- Express.js
- Axios
- CORS

### 📝 טפסים ואימות
- React Hook Form
- Zod
- express-validator

---

## גרסאות עיקריות

| טכנולוגיה | גרסה |
|-----------|------|
| Node.js | Latest LTS |
| React | 18.2.0 |
| Express | 4.18.2 |
| Prisma | 5.7.1 |
| PostgreSQL | 15 |
| TypeScript | 5.2.2 |
| Vite | 5.0.8 |
| Tailwind CSS | 3.3.6 |

---

## מבנה הפרויקט

```
Vaad_M_H/
├── backend/          # שרת Node.js + Express
│   ├── src/
│   │   ├── routes/   # API endpoints
│   │   ├── middleware/ # Middleware (auth, errors)
│   │   └── services/  # שירותים (email)
│   └── prisma/        # Prisma schema
├── frontend/          # React + TypeScript
│   ├── src/
│   │   ├── pages/     # דפים
│   │   ├── components/ # קומפוננטות
│   │   └── api/       # API client
└── docker-compose.yml # הגדרות Docker
```

---

## הערות חשובות

1. **גרסאות:** כל הגרסאות מוגדרות ב-`package.json` של כל חלק
2. **משתני סביבה:** כל ה-API keys והסודות נמצאים ב-`.env` (לא בקוד!)
3. **פיתוח:** משתמשים ב-`npm run dev` להרצת Backend ו-Frontend יחד
4. **פריסה:** אפשר לפרוס ל-Vercel, Render, או כל שירות אחר

---

**תאריך עדכון:** ינואר 2025
