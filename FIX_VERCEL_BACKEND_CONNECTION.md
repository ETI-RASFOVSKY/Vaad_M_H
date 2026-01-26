# תיקון חיבור Frontend (Vercel) ל-Backend (Render)

## הבעיה

הפרונטאנד ב-Vercel מנסה לקרוא ל-`/api/...` אבל זה מצביע לפרונטאנד עצמו, לא לבקאנד:
```
GET https://vaad-m-h-frontend-realy.vercel.app/api/media 404
POST https://vaad-m-h-frontend-realy.vercel.app/api/messages 404
```

## מה תוקן

### 1. תיקון baseURL ב-Frontend ✅

**לפני:**
```typescript
return 'https://vaad-m-h.onrender.com/api' // ❌ כפילות /api
```

**אחרי:**
```typescript
return 'https://vaad-m-h.onrender.com' // ✅ רק הדומיין
```

**הסבר:** ה-`baseURL` של Axios צריך להיות רק הדומיין, כי בקריאות כבר יש `/api/...`.

### 2. תיקון CORS ב-Backend ✅

הוספתי את ה-origin של Vercel ל-allowed origins:
- `https://vaad-m-h-frontend-realy.vercel.app`
- תמיכה ב-wildcard patterns ל-Vercel preview URLs

### 3. שיפור הלוגים ✅

עכשיו תראו בקונסול:
- מה ה-API_URL שנבחר
- מה ה-VITE_API_URL (אם מוגדר)
- מה ה-hostname של הדפדפן

## מה לעשות עכשיו

### שלב 1: עדכון משתנה סביבה ב-Vercel (מומלץ)

1. לכו ל-Vercel Dashboard: https://vercel.com/dashboard
2. בחרו את הפרויקט `vaad-m-h-frontend-realy`
3. לכו ל-Settings → Environment Variables
4. הוסיפו משתנה חדש:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://vaad-m-h.onrender.com` (ללא `/api`!)
   - **Environment:** Production, Preview, Development (סמנו את כולם)
5. שמרו
6. פרסו מחדש (Redeploy)

### שלב 2: עדכון CORS ב-Render

1. לכו ל-Render Dashboard: https://dashboard.render.com
2. בחרו את ה-Backend service
3. לכו ל-Environment
4. הוסיפו:
   - **Key:** `FRONTEND_URL`
   - **Value:** `https://vaad-m-h-frontend-realy.vercel.app`
5. שמרו
6. השרת יתעדכן אוטומטית

## בדיקה

אחרי הפריסה, בדקו בקונסול (F12):
```
🔗 API Configuration:
  - API_URL: https://vaad-m-h.onrender.com
  - VITE_API_URL env: https://vaad-m-h.onrender.com (או not set)
  - PROD mode: true
  - Window hostname: vaad-m-h-frontend-realy.vercel.app
✅ Using API URL: https://vaad-m-h.onrender.com
```

ואז הקריאות צריכות להיות:
```
GET https://vaad-m-h.onrender.com/api/media ✅
POST https://vaad-m-h.onrender.com/api/messages ✅
```

## אם עדיין יש בעיה

### בדיקת Backend

```bash
curl https://vaad-m-h.onrender.com/api/health
```

אמור להחזיר: `{"status":"ok","message":"Server is running"}`

### בדיקת CORS

פתחו את הקונסול (F12) ונסו:
```javascript
fetch('https://vaad-m-h.onrender.com/api/media')
  .then(r => r.json())
  .then(console.log)
```

אם יש שגיאת CORS, תראו:
```
Access to fetch at '...' from origin '...' has been blocked by CORS policy
```

**פתרון:** ודאו ש-`FRONTEND_URL` מוגדר ב-Render וה-origin של Vercel נמצא ב-`allowedOrigins`.

### בדיקת Network

פתחו את Network tab (F12) ובדקו:
- מה ה-URL המלא של הבקשה
- מה ה-status code
- מה ה-response

## סיכום התיקונים

1. ✅ `baseURL` עכשיו בלי `/api` (כי הקריאות כבר כוללות `/api/...`)
2. ✅ CORS מאפשר את ה-origin של Vercel
3. ✅ תמיכה ב-wildcard patterns ל-Vercel preview URLs
4. ✅ לוגים מפורטים יותר

---

**תאריך עדכון:** ינואר 2025
