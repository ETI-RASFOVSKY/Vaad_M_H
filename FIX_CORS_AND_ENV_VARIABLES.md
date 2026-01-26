# 🔧 תיקון CORS ומשתני סביבה

## 📚 הסבר קצר

### מה זה CORS?

**CORS** = Cross-Origin Resource Sharing (שיתוף משאבים בין דומיינים)

**למה צריך את זה?**
- דפדפנים חוסמים בקשות בין דומיינים שונים מטעמי אבטחה
- אם ה-Frontend על `https://vaad-frontend.vercel.app`
- וה-Backend על `https://vaad-backend.onrender.com`
- אלו **שני דומיינים שונים**!
- ה-Backend צריך להרשות מפורשות ל-Frontend לגשת אליו

**✅ טוב לדעת:** הקוד כבר תומך בכל אתרי Vercel אוטומטית!
- כל URL שמסתיים ב-`.vercel.app` מאושר אוטומטית
- לא צריך להוסיף כל URL ספציפי

**מה קורה כשזה לא מוגדר?**
- אתה תראה שגיאה בקונסול: `CORS policy: No 'Access-Control-Allow-Origin'`
- ה-API לא יעבוד

---

### למה משתני סביבה undefined?

**Vite (Frontend)** עובד אחרת מ-Node.js (Backend):

1. **Backend (Node.js):**
   - קורא משתני סביבה **בזמן ריצה** (runtime)
   - משתמש ב-`process.env.VARIABLE`
   - יכול לקרוא משתנים גם אחרי שהשרת רץ

2. **Frontend (Vite):**
   - קורא משתני סביבה **בזמן בנייה** (build time)
   - משתמש ב-`import.meta.env.VITE_*`
   - **חייב** שהמשתנים יהיו זמינים כשעושים `npm run build`
   - אחרי הבנייה, המשתנים מוטמעים בקוד

**לכן:**
- אם לא הגדרת `VITE_API_URL` **לפני** הבנייה ב-Vercel
- הקוד יקבל `undefined`
- צריך לבנות מחדש (redeploy) אחרי הוספת המשתנה

---

## 🔧 תיקון הבעיות

### בעיה 1: CORS חוסם את הבקשות

**הסיבה:**
- ה-Backend לא מכיר את כתובת ה-Frontend שלך ב-Vercel
- צריך להוסיף את כתובת ה-Frontend לרשימת המקורות המותרים

**פתרון:**

1. **ב-Render Dashboard → Backend Service:**
   - לחץ על השירות שלך (Backend)
   - לך ל-Environment Variables
   - הוסף משתנה חדש (אופציונלי - אבל מומלץ):
     ```
     FRONTEND_URL=https://vaad-frontend.vercel.app
     ```
     (החלף `vaad-frontend` בשם האמיתי של ה-Frontend שלך ב-Vercel)

2. **✅ טוב לדעת:**
   - הקוד כבר תומך **אוטומטית** בכל אתרי Vercel (`*.vercel.app`)
   - לא חובה להוסיף `FRONTEND_URL`, אבל זה עוזר ללוגים
   - אם יש לך דומיין מותאם אישית (custom domain), הוסף אותו גם בקוד

---

### בעיה 2: משתני סביבה undefined

**הסיבה:**
- `VITE_API_URL` לא הוגדר לפני הבנייה
- או שהוגדר לא נכון

**פתרון:**

1. **ב-Vercel Dashboard → Project → Settings → Environment Variables:**
   - לחץ על ה-Projects שלך (Frontend)
   - לך ל-Settings → Environment Variables
   - לחץ "Add New"
   - **Key:** `VITE_API_URL`
   - **Value:** `https://vaad-backend.onrender.com`
     (החלף `vaad-backend` בשם האמיתי של ה-Backend שלך)
   - **Environment:** בחר "Production", "Preview", "Development" (או רק "Production")
   - לחץ "Save"
   
   **⚠️ חשוב מאוד:**
   - **ללא סלאש בסוף!** ❌ לא: `https://...onrender.com/`
   - ✅ כן: `https://...onrender.com`
   - משתני סביבה עם `VITE_` בתחילה נטמעים בזמן build

2. **Deploy מחדש:**
   - ב-Vercel Dashboard → Project
   - לחץ על "Deployments"
   - לחץ על "..." של ה-Deployment האחרון
   - בחר "Redeploy" (או פשוט עשה push ל-GitHub - זה יעשה deploy אוטומטית)
   - חכה שהבנייה תסתיים (1-2 דקות ב-Vercel!)

3. **בדוק בקונסול:**
   - פתח את האתר בדפדפן
   - לחץ F12 → Console
   - חפש את ההודעות:
     ```
     🔍 VITE_API_URL: https://vaad-backend.onrender.com
     🔍 API_URL (raw): https://vaad-backend.onrender.com
     ```
   - אם אתה רואה `undefined`, המשתנה לא נקלט - צריך לבנות מחדש!

---

## ✅ רשימת בדיקה

### Backend (ב-Render):

- [ ] `DATABASE_URL` - מחרוזת חיבור למסד הנתונים
- [ ] `JWT_SECRET` - מפתח אבטחה (אקראי)
- [ ] `PORT` - `10000` (ל-Render)
- [ ] `NODE_ENV` - `production`
- [ ] `FRONTEND_URL` - כתובת ה-Frontend שלך ב-Vercel (אופציונלי - אבל מומלץ)
- [ ] `CLOUDINARY_CLOUD_NAME` (אופציונלי)
- [ ] `CLOUDINARY_API_KEY` (אופציונלי)
- [ ] `CLOUDINARY_API_SECRET` (אופציונלי)

### Frontend (ב-Vercel):

- [ ] `VITE_API_URL` - כתובת ה-Backend שלך ⚠️ **ללא סלאש בסוף!**

---

## 🧪 איך לבדוק שזה עובד

### בדיקה 1: CORS

1. פתח את אתר ה-Frontend ב-Vercel
2. לחץ F12 → Console
3. הרץ:
   ```javascript
   fetch('https://vaad-backend.onrender.com/api/health')
     .then(r => r.json())
     .then(console.log)
   ```

**אם זה עובד:**
- תראה: `{status: 'ok', message: 'Server is running'}`

**אם יש בעיית CORS:**
- תראה: `Access to fetch ... has been blocked by CORS policy`
- בדוק שהכתובת שלך מסתיימת ב-`.vercel.app`
- כל כתובת `*.vercel.app` מאושרת אוטומטית

### בדיקה 2: משתני סביבה

1. פתח את אתר ה-Frontend
2. לחץ F12 → Console
3. חפש הודעות שהתחילות ב-`🔍`
4. וודא ש-`VITE_API_URL` **לא** `undefined`

---

## 🆘 אם עדיין לא עובד

### בעיית CORS עדיין קיימת:

1. **בדוק את הלוגים של Backend:**
   - ב-Render Dashboard → Backend → Logs
   - חפש הודעות: `⚠️ CORS blocked origin: ...`
   - זה יראה לך מה ה-Origin שנחסם

2. **הוסף את ה-Origin החסום:**
   - עדכן את `backend/src/index.js`
   - הוסף את הכתובת ל-`allowedOrigins`

### משתני סביבה עדיין undefined:

1. **וודא שהמשתנה מוגדר נכון:**
   - ללא רווחים מיותרים
   - ללא סלאש בסוף
   - עם `https://` בתחילה
   - השם מתחיל ב-`VITE_` (חובה!)

2. **Deploy מחדש:**
   - ב-Vercel, כל שינוי במשתני סביבה דורש Redeploy
   - Vercel Dashboard → Deployments → "Redeploy"
   - או פשוט עשה `git push` (Vercel יעשה deploy אוטומטית)

3. **בדוק את Build Logs:**
   - ב-Vercel Dashboard → Deployments → לחץ על ה-Deployment
   - לחץ על "Build Logs" או "Function Logs"
   - חפש שגיאות בזמן הבנייה

---

## 📝 דוגמה: הגדרות נכונות

### Backend (ב-Render):

```
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=my-super-secret-key-2024
PORT=10000
NODE_ENV=production
FRONTEND_URL=https://vaad-frontend.vercel.app
```

### Frontend (ב-Vercel):

**Settings → Environment Variables:**

| Key | Value | Environments |
|-----|-------|--------------|
| `VITE_API_URL` | `https://vaad-backend.onrender.com` | Production, Preview, Development |

**⚠️ שים לב:**
- Frontend משתמש ב-`VITE_` לפני השם (חובה!)
- Backend משתמש בשם ישיר
- אין סלאש בסוף!
- ב-Vercel, בחר את ה-Environments הרלוונטיים

---

**תאריך עדכון:** 2025-01-18
