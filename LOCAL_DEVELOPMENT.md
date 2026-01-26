# הגדרת פיתוח מקומי

## בעיית חיבור לבקאנד

אם אין לכם חיבור לבקאנד, זה כנראה כי הקוד מוגדר ל-URL של הענן.

## פתרון מהיר

### 1. צרו קובץ `.env` ב-frontend

צרו קובץ `frontend/.env` והוסיפו:

```env
VITE_API_URL=http://localhost:5000
```

### 2. ודאו שהבקאנד רץ מקומית

הריצו את הבקאנד בטרמינל:

```bash
cd backend
npm run dev
```

הבקאנד צריך לרוץ על `http://localhost:5000`

### 3. הפעילו מחדש את ה-frontend

אחרי יצירת קובץ ה-`.env`, הפעילו מחדש את ה-frontend:

```bash
cd frontend
npm run dev
```

## איך זה עובד עכשיו?

הקוד עובד כך:
1. **אם יש `VITE_API_URL` ב-`.env`** - משתמש בו
2. **אם אין** - משתמש ב-`http://localhost:5000` (פיתוח מקומי)
3. **בפרודקשן** - משתמש ב-URL של Render

## בדיקה

פתחו את הקונסול בדפדפן (F12) ותראו:
```
🔗 API Configuration:
  - API_URL: http://localhost:5000
  - VITE_API_URL env: http://localhost:5000
  ✅ Using API URL: http://localhost:5000
```

אם אתם רואים את זה, הכל עובד! ✅

## אם עדיין לא עובד

1. **ודאו שהבקאנד רץ:**
   - פתחו `http://localhost:5000/api/health` בדפדפן
   - אתם צריכים לראות: `{"status":"ok","message":"Server is running"}`

2. **ודאו שאין שגיאות CORS:**
   - בדקו את הקונסול בדפדפן
   - אם יש שגיאות CORS, ודאו שה-backend מאפשר את זה

3. **נסו להפעיל מחדש:**
   - עצרו את ה-frontend (Ctrl+C)
   - הפעילו מחדש: `npm run dev`

## מעבר בין מקומי לענן

**לפיתוח מקומי:**
```env
VITE_API_URL=http://localhost:5000
```

**לשימוש בענן:**
```env
VITE_API_URL=https://vaad-backend-i96q.onrender.com
```

או פשוט מחקו את השורה והקוד ישתמש ב-URL של Render בפרודקשן.
