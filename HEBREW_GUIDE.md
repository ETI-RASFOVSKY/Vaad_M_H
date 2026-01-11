# מדריך מלא - אתר ועד מבקשי ה'

## מבוא

נבנה עבורך אתר תדמיתי מלא עבור ארגון "ועד מבקשי ה'" עם כל התכונות שביקשת:
- אתר ציבורי עם כל העמודים
- מערכת ניהול תוכן (Admin Panel)
- מסד נתונים מלא
- הגדרות Docker לפריסה
- הגדרות Git

## מה נבנה - סקירה כללית

### ✅ Frontend (חלק המשתמש)
1. **עמוד הבית** - עם וידאו רקע, סטטיסטיקות, כפתורי תרומה
2. **אודותינו** - מידע מפורט על הארגון
3. **גלריה** - תמונות וסרטונים עם סינון
4. **צור קשר** - טופס יצירת קשר
5. **תרומה** - הפניה לנדרים פלוס
6. **Admin Panel** - מערכת ניהול מלאה

### ✅ Backend (שרת)
1. **API מלא** - כל ה-endpoints הנדרשים
2. **Authentication** - התחברות מנהלים
3. **Media Management** - העלאת תמונות/סרטונים
4. **Messages** - ניהול הודעות

### ✅ Database
1. **PostgreSQL** - מסד נתונים מלא
2. **Prisma ORM** - ניהול מסד נתונים
3. **3 טבלאות**: users, messages, media

### ✅ DevOps
1. **Docker** - הגדרות מלאות
2. **Git** - מוכן ל-commit
3. **מדריכי פריסה** - AWS ו-Render

## התחלה מהירה

### שלב 1: התקנת תלויות

```bash
# מהתיקייה הראשית
npm install

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### שלב 2: הגדרת מסד נתונים

1. התקן PostgreSQL (אם עדיין לא)
2. צור מסד נתונים:
```sql
CREATE DATABASE vaad_db;
```

### שלב 3: הגדרת משתני סביבה

**Backend** - צור `backend/.env`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/vaad_db"
JWT_SECRET="your-secret-key-here"
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
PORT=5000
NODE_ENV=development
```

**Frontend** - צור `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000
```

### שלב 4: הגדרת מסד נתונים

```bash
cd backend
npx prisma migrate dev
npx prisma generate
```

### שלב 5: יצירת מנהל

```bash
cd backend
npm run create-admin
```

### שלב 6: הרצה

```bash
# מהתיקייה הראשית
npm run dev
```

האתר יהיה זמין ב:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Admin: http://localhost:3000/admin/login

## מבנה הפרויקט

```
Vaad_M_H/
├── frontend/                    # React Frontend
│   ├── src/
│   │   ├── components/          # קומפוננטות
│   │   │   ├── Header.tsx       # תפריט עליון
│   │   │   ├── Footer.tsx       # תחתית
│   │   │   ├── VideoHero.tsx    # וידאו רקע
│   │   │   └── Statistics.tsx   # סטטיסטיקות
│   │   ├── pages/               # עמודים
│   │   │   ├── Home.tsx
│   │   │   ├── About.tsx
│   │   │   ├── Gallery.tsx
│   │   │   ├── Contact.tsx
│   │   │   ├── Donate.tsx
│   │   │   └── admin/           # עמודי ניהול
│   │   ├── context/             # React Context
│   │   └── api/                 # API client
│   └── public/
│       └── logo.svg             # הלוגו
│
├── backend/                     # Express Backend
│   ├── src/
│   │   ├── routes/              # נתיבי API
│   │   │   ├── auth.js          # התחברות
│   │   │   ├── media.js         # מדיה
│   │   │   └── messages.js      # הודעות
│   │   ├── middleware/          # Middleware
│   │   └── scripts/            # סקריפטים
│   └── prisma/
│       └── schema.prisma        # סכמת מסד נתונים
│
├── docker-compose.yml           # Docker setup
├── README.md                    # תיעוד ראשי
├── SETUP.md                     # מדריך התקנה
├── DEPLOYMENT.md                # מדריך פריסה
└── PROJECT_SUMMARY.md          # סיכום טכני
```

## תכונות מיוחדות

### 1. עיצוב בהשראת ישיבת מיר
- צבעים דומים (זהב, אפור, לבן)
- טיפוגרפיה: Assistant, Frank Ruhl Libre
- אנימציות עדינות עם Framer Motion
- עיצוב נקי ורגוע

### 2. וידאו רקע
- תמיכה בוידאו רקע אוטומטי
- נטען אוטומטית, ללא קול, בלולאה
- Fallback לצבע אם הוידאו לא נטען

### 3. גלריה מתקדמת
- Lightbox לתמונות וסרטונים
- סינון לפי: הכל, תמונות, סרטונים, חגים
- Grid responsive
- Infinite scroll מוכן

### 4. מערכת ניהול
- התחברות מאובטחת
- העלאת תמונות/סרטונים
- ניהול הודעות
- לוח בקרה עם סטטיסטיקות

## שימוש ב-Admin Panel

### התחברות
1. לך ל: http://localhost:3000/admin/login
2. הזן את פרטי המנהל שיצרת

### העלאת מדיה
1. לך ל-"גלריה" בתפריט
2. לחץ על "העלה מדיה חדשה"
3. בחר קובץ (תמונה או סרטון)
4. בחר קטגוריה (אופציונלי)
5. הוסף כותרת ותיאור (אופציונלי)
6. לחץ על הקובץ להעלאה

### ניהול הודעות
1. לך ל-"הודעות" בתפריט
2. צפה בכל ההודעות
3. סנן לפי: הכל, לא נקראו, נקראו
4. לחץ על "סמן כטופל" לאחר טיפול

## פריסה לענן

### אפשרות 1: Render.com (מומלץ למתחילים)

1. **Backend:**
   - יצירת Web Service
   - חיבור ל-repository
   - הגדרת משתני סביבה
   - Build: `npm install && npx prisma generate && npx prisma migrate deploy`
   - Start: `npm start`

2. **Frontend:**
   - יצירת Static Site
   - Build: `npm install && npm run build`
   - Publish: `dist`

3. **Database:**
   - יצירת PostgreSQL database
   - העתק connection string

### אפשרות 2: Docker

```bash
docker-compose up -d
```

## הערות חשובות

### 1. Cloudinary
נדרש חשבון Cloudinary להעלאת מדיה:
1. הירשם ב-[cloudinary.com](https://cloudinary.com)
2. קבל: Cloud Name, API Key, API Secret
3. הוסף ל-`backend/.env`

### 2. וידאו רקע
להוספת וידאו רקע:
1. הוסף קובץ `hero-video.mp4` ל-`frontend/public/`
2. הוידאו יטען אוטומטית

### 3. JWT Secret
**חשוב!** החלף את `JWT_SECRET` ב-production:
```bash
# יצירת secret אקראי
openssl rand -base64 32
```

### 4. Database Migrations
לאחר שינויים ב-schema:
```bash
cd backend
npx prisma migrate dev --name your-migration-name
```

## פתרון בעיות

### שגיאת חיבור למסד נתונים
- ודא ש-PostgreSQL רץ
- בדוק את `DATABASE_URL` ב-`.env`
- ודא הרשאות משתמש

### שגיאת Prisma
```bash
cd backend
npx prisma generate
npx prisma migrate reset  # רק אם צריך לאפס
```

### Port כבר בשימוש
שנה את הפורט ב-`.env`:
```env
PORT=5001
```

## צעדים הבאים

1. ✅ התקן את כל התלויות
2. ✅ הגדר את מסד הנתונים
3. ✅ צור משתמש מנהל
4. ✅ הרץ את האפליקציה
5. ✅ העלה תוכן דרך Admin Panel
6. ✅ התאם עיצוב לפי הצרכים
7. ✅ פרוס לענן

## תמיכה

לשאלות או בעיות:
- עיין ב-`SETUP.md` לפתרון בעיות נפוצות
- בדוק את ה-logs ב-console
- ודא שכל התלויות מותקנות

---

**האתר מוכן לשימוש! 🎉**

כל הקבצים נוצרו, המבנה מוכן, וכל מה שצריך זה להתקין תלויות ולהגדיר משתני סביבה.

**בהצלחה!**
