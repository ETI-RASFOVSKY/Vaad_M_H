# מדריך מנהל - אתר ועד מבקשי ה'

## 🔐 איך להתחבר למנהל?

### שלב 1: הרץ את האפליקציה

פתח טרמינל והרץ:
```bash
cd C:\Users\PC\Desktop\vaad_2\Vaad_M_H
npm run dev
```

או בנפרד:
- טרמינל 1: `cd backend && npm run dev`
- טרמינל 2: `cd frontend && npm run dev`

### שלב 2: פתח את הדפדפן

לך לכתובת:
```
http://localhost:3000/admin/login
```

### שלב 3: התחבר

**אימייל:** `admin@vaad.org`  
**סיסמה:** `admin123`

לחץ על "התחבר" ותועבר ללוח הבקרה.

---

## 📸 איך להעלות תמונות?

### דרך Admin Panel:

1. **התחבר** ל-Admin Panel (כמו שלמעלה)
2. בתפריט העליון, לחץ על **"גלריה"**
3. לחץ על הכפתור **"העלה מדיה חדשה"**
4. תופיע טופס:
   - **בחר קובץ** - לחץ ובחר תמונה או סרטון מהמחשב
   - **קטגוריה** (אופציונלי) - בחר: חנוכה, ל"ג בעומר, שבת גיבוש, או כללי
   - **כותרת** (אופציונלי) - הוסף כותרת לתמונה
   - **תיאור** (אופציונלי) - הוסף תיאור קצר
5. לחץ על הקובץ - הוא יתחיל להעלות אוטומטית
6. התמונה תופיע בגלריה!

### ⚠️ חשוב - Cloudinary:

כדי להעלות תמונות, צריך חשבון Cloudinary (שירות אחסון תמונות).

**איך להשיג את הפרטים:**

1. היכנס ל-[cloudinary.com](https://cloudinary.com)
2. הירשם (חינם) או התחבר
3. לך ל-Dashboard
4. תמצא שם:
   - **Cloud Name** - זה השם של החשבון שלך
   - **API Key** - מפתח API
   - **API Secret** - סוד API

5. העתק את הפרטים לקובץ `backend/.env`:
   ```
   CLOUDINARY_CLOUD_NAME=your-cloud-name-here
   CLOUDINARY_API_KEY=your-api-key-here
   CLOUDINARY_API_SECRET=your-api-secret-here
   ```

6. הפעל מחדש את ה-backend

---

## 🗄️ איך לשלוט במסד הנתונים?

### דרך Prisma Studio (הכי קל):

Prisma Studio הוא כלי ויזואלי לניהול המסד.

**איך להריץ:**

1. פתח טרמינל
2. הרץ:
   ```bash
   cd C:\Users\PC\Desktop\vaad_2\Vaad_M_H\backend
   npx prisma studio
   ```

3. הדפדפן יפתח אוטומטית בכתובת: `http://localhost:5555`

4. תראה 3 טבלאות:
   - **users** - משתמשי מנהל
   - **messages** - הודעות מהמבקרים
   - **media** - תמונות וסרטונים

**מה אפשר לעשות:**
- ✅ לראות את כל הנתונים
- ✅ להוסיף רשומות חדשות
- ✅ לערוך רשומות קיימות
- ✅ למחוק רשומות
- ✅ לסנן ולחפש

### דרך SQL ישירות:

אם אתה מכיר SQL, אפשר להתחבר ישירות:

```bash
docker exec -it vaad_postgres psql -U vaad_user -d vaad_db
```

---

## 📝 מה למלא ב-.env?

### קובץ: `backend/.env`

```env
# מסד נתונים (כבר מוגדר)
DATABASE_URL="postgresql://vaad_user:vaad_password@localhost:5432/vaad_db"

# מפתח אבטחה (כבר מוגדר)
JWT_SECRET="vaad-mevakshei-hashem-secret-key-change-in-production-2024"

# Cloudinary - צריך למלא!
CLOUDINARY_CLOUD_NAME="הכנס-כאן-את-Cloud-Name-שלך"
CLOUDINARY_API_KEY="הכנס-כאן-את-API-Key-שלך"
CLOUDINARY_API_SECRET="הכנס-כאן-את-API-Secret-שלך"

# פורט (כבר מוגדר)
PORT=5000

# סביבה (כבר מוגדר)
NODE_ENV=development
```

### קובץ: `frontend/.env`

```env
# כתובת ה-API (כבר מוגדר)
VITE_API_URL=http://localhost:5000
```

---

## 🎯 סיכום - מה לעשות עכשיו:

### אפשרות 1: בלי Cloudinary (להתחלה)
1. הרץ את האפליקציה: `npm run dev`
2. לך ל: `http://localhost:3000/admin/login`
3. התחבר עם: `admin@vaad.org` / `admin123`
4. תוכל לראות את כל העמודים, אבל העלאת תמונות לא תעבוד עד שתגדיר Cloudinary

### אפשרות 2: עם Cloudinary (מלא)
1. הירשם ל-Cloudinary
2. העתק את הפרטים ל-`backend/.env`
3. הפעל מחדש את ה-backend
4. עכשיו תוכל להעלות תמונות!

---

## 🔍 איפה כל דבר נמצא?

### Admin Panel:
- **URL:** http://localhost:3000/admin/login
- **פונקציות:**
  - לוח בקרה - סטטיסטיקות
  - הודעות - ניהול הודעות מהמבקרים
  - גלריה - העלאת תמונות/סרטונים

### מסד נתונים:
- **Prisma Studio:** `npx prisma studio` (מ-backend)
- **URL:** http://localhost:5555
- **טבלאות:**
  - users - מנהלים
  - messages - הודעות
  - media - תמונות וסרטונים

### קבצי הגדרה:
- `backend/.env` - הגדרות backend
- `frontend/.env` - הגדרות frontend

---

## ❓ שאלות נפוצות:

**Q: למה אני לא רואה תמונות בגלריה?**  
A: כי עדיין לא העלית תמונות דרך Admin Panel.

**Q: למה העלאת תמונה לא עובדת?**  
A: צריך להגדיר Cloudinary ב-`.env` ולהפעיל מחדש את ה-backend.

**Q: איך אני מוסיפה עוד מנהל?**  
A: דרך Prisma Studio - הוסף רשומה חדשה בטבלת `users`, או הרץ:
```bash
cd backend
node src/scripts/createDefaultAdmin.js
```
(תצטרך לשנות את האימייל והסיסמה בקובץ)

**Q: איך אני משנה סיסמה?**  
A: דרך Prisma Studio - ערוך את הרשומה ב-`users` והחלף את `passwordHash` (אבל צריך להצפין עם bcrypt).  
או פשוט צור מנהל חדש עם סיסמה חדשה.

**Q: איך אני רואה הודעות מהמבקרים?**  
A: התחבר ל-Admin Panel → לחץ על "הודעות" בתפריט

---

**בהצלחה! 🎉**
