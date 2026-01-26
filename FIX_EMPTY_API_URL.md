# תיקון API_URL ריק ב-Vercel

## הבעיה

ה-`API_URL` ריק בפרודקשן, מה שגורם ל-calls לעבור לפרונטאנד עצמו:
```
✅ Using API URL: (ריק!)
GET https://vaad-m-h-frontend-realy-*.vercel.app/api/media 404
```

## מה תוקן

### 1. Fallback בטוח ✅

הוספתי `FALLBACK_API_URL` קבוע שיופעל תמיד אם `API_URL` ריק:
```typescript
const FALLBACK_API_URL = 'https://vaad-m-h.onrender.com'
```

### 2. שיפור זיהוי Production ✅

עכשיו הקוד בודק את hostname כדי לזהות פרודקשן:
- אם hostname כולל `vercel.app` → פרודקשן
- אם hostname כולל `netlify.app` → פרודקשן
- אם hostname כולל `render.com` → פרודקשן
- אם hostname לא localhost → פרודקשן

### 3. Fallback ב-axios.create ✅

עכשיו `baseURL` ב-axios.create משתמש ב-fallback אם `API_URL` ריק:
```typescript
baseURL: API_URL || FALLBACK_API_URL
```

### 4. Fallback ב-Interceptor ✅

גם ב-request interceptor יש fallback אם baseURL ריק.

## מה לעשות עכשיו

### שלב 1: בנייה מחדש ופריסה

1. **בנו מחדש את הפרויקט:**
   ```bash
   cd frontend
   npm run build
   ```

2. **פרסו ל-Vercel** (או Commit & Push ל-Git)

### שלב 2: בדיקה

אחרי הפריסה, בדקו בקונסול (F12):
```
🔗 API Configuration:
  - API_URL: https://vaad-m-h.onrender.com (או empty עם fallback)
  - FALLBACK_API_URL: https://vaad-m-h.onrender.com
✅ Using API URL: https://vaad-m-h.onrender.com
```

### שלב 3: הגדרת VITE_API_URL (אופציונלי, מומלץ)

אם תרצו, הוסיפו ב-Vercel:
- **Key:** `VITE_API_URL`
- **Value:** `https://vaad-m-h.onrender.com` (ללא `/api`!)
- **Environment:** Production, Preview, Development

## בדיקה

אחרי הפריסה, בדקו שהקריאות עכשיו:
```
GET https://vaad-m-h.onrender.com/api/media ✅
POST https://vaad-m-h.onrender.com/api/messages ✅
```

## סיכום התיקונים

1. ✅ Fallback בטוח - `FALLBACK_API_URL` קבוע
2. ✅ זיהוי פרודקשן לפי hostname (אמין יותר)
3. ✅ Fallback ב-`axios.create` - אם `API_URL` ריק, משתמש ב-fallback
4. ✅ Fallback ב-interceptor - double safety

---

**תאריך עדכון:** ינואר 2025
