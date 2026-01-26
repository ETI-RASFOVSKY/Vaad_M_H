# תיקון API URL ב-Vercel (Frontend)

## הבעיה

הפרונטאנד ב-Vercel לא יכול להתחבר ל-Backend:
```
✅ Using API URL: (ריק!)
Failed to load resource: the server responded with a status of 404 (Not Found)
```

## מה תוקן

1. **עדכנתי את ה-URL הישן** - מ-`vaad-backend-i96q.onrender.com` ל-`vaad-m-h.onrender.com`
2. **הוספתי הוראות להגדרת משתנה סביבה** ב-Vercel

## מה לעשות עכשיו

### אופציה 1: הגדרת משתנה סביבה ב-Vercel (מומלץ)

1. לכו ל-Vercel Dashboard: https://vercel.com/dashboard
2. בחרו את הפרויקט `vaad-m-h-frontend`
3. לכו ל-Settings → Environment Variables
4. הוסיפו משתנה חדש:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://vaad-m-h.onrender.com`
   - **Environment:** Production, Preview, Development (סמנו את כולם)
5. שמרו
6. פרסו מחדש (Redeploy)

### אופציה 2: הקוד כבר מתוקן

אם לא תוסיפו את `VITE_API_URL`, הקוד ישתמש ב-URL החדש:
- `https://vaad-m-h.onrender.com` (בפרודקשן)

## בדיקה

אחרי הפריסה, בדקו בקונסול (F12):
```
🔗 API Configuration:
  - API_URL: https://vaad-m-h.onrender.com
  - VITE_API_URL env: (not set) או https://vaad-m-h.onrender.com
  - PROD mode: true
✅ Using API URL: https://vaad-m-h.onrender.com
```

## אם עדיין יש בעיה

אם עדיין מקבלים 404:

1. **בדקו שה-Backend רץ:**
   ```bash
   curl https://vaad-m-h.onrender.com/api/health
   ```
   אמור להחזיר: `{"status":"ok","message":"Server is running"}`

2. **בדקו את ה-CORS:**
   - ודאו ש-`https://vaad-m-h-frontend-*.vercel.app` נמצא ב-`allowedOrigins` ב-Backend
   - או הוסיפו `FRONTEND_URL` ב-Render

3. **בדקו את הלוגים:**
   - בקונסול של הדפדפן
   - בלוגים של Vercel
   - בלוגים של Render

## הערות חשובות

1. **VITE_API_URL:** אם מוגדר, הוא תמיד יגבר על ה-URL הקבוע בקוד
2. **URL חדש:** עדכנתי מ-`vaad-backend-i96q` ל-`vaad-m-h`
3. **CORS:** ודאו שה-Backend מאפשר את ה-origin של Vercel

---

**תאריך עדכון:** ינואר 2025
