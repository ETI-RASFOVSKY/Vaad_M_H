# 🚀 התחלה מהירה - מדריך קצר

## שלב 1: הרצת האפליקציה

פתח טרמינל והרץ:
```bash
cd C:\Users\PC\Desktop\vaad_2\Vaad_M_H
npm run dev
```

חכה שהכל נטען (תראה הודעות בטרמינל).

---

## שלב 2: התחברות למנהל

1. **פתח דפדפן** (Chrome, Edge, Firefox)
2. **לך לכתובת:** `http://localhost:3000/admin/login`
3. **הזן:**
   - אימייל: `admin@vaad.org`
   - סיסמה: `admin123`
4. **לחץ "התחבר"**

✅ עכשיו אתה במערכת הניהול!

---

## שלב 3: העלאת תמונות

### ⚠️ קודם כל - הגדר Cloudinary:

**מה זה?** Cloudinary הוא שירות אחסון תמונות. **חינמי!**

**איך להגדיר:**

1. **הירשם ל-Cloudinary:**
   - לך ל: https://cloudinary.com
   - לחץ "Sign Up" (הירשם)
   - מלא פרטים (חינמי)

2. **קבל את הפרטים:**
   - לאחר ההתחברות, תראה ב-Dashboard:
     - **Cloud Name** (למשל: `abc123`)
     - **API Key** (מספר ארוך)
     - **API Secret** (מפתח סודי)

3. **העתק לקובץ:**
   - פתח: `C:\Users\PC\Desktop\vaad_2\Vaad_M_H\backend\.env`
   - מצא את השורות:
     ```
     CLOUDINARY_CLOUD_NAME=""
     CLOUDINARY_API_KEY=""
     CLOUDINARY_API_SECRET=""
     ```
   - מלא את הפרטים (בין המרכאות):
     ```
     CLOUDINARY_CLOUD_NAME="abc123"
     CLOUDINARY_API_KEY="1234567890"
     CLOUDINARY_API_SECRET="secret-key-here"
     ```
   - **שמור את הקובץ**

4. **הפעל מחדש את ה-backend:**
   - בטרמינל, לחץ `Ctrl+C` (לעצור)
   - הרץ שוב: `cd backend && npm run dev`

### עכשיו להעלות תמונות:

1. **במערכת הניהול**, לחץ על **"גלריה"** בתפריט העליון
2. לחץ על **"העלה מדיה חדשה"**
3. **בחר קובץ** - לחץ ובחר תמונה מהמחשב
4. (אופציונלי) בחר קטגוריה: חנוכה, ל"ג בעומר, וכו'
5. (אופציונלי) הוסף כותרת ותיאור
6. **הקובץ יתחיל להעלות אוטומטית!**
7. התמונה תופיע בגלריה הציבורית

---

## שלב 4: ניהול מסד הנתונים

### דרך Prisma Studio (הכי קל):

1. **פתח טרמינל חדש**
2. **הרץ:**
   ```bash
   cd C:\Users\PC\Desktop\vaad_2\Vaad_M_H\backend
   npx prisma studio
   ```

3. **הדפדפן יפתח אוטומטית** בכתובת: `http://localhost:5555`

4. **תראה 3 טבלאות:**
   - **users** - משתמשי מנהל
   - **messages** - הודעות מהמבקרים
   - **media** - תמונות וסרטונים

### מה אפשר לעשות:

- ✅ **לראות הכל** - כל הנתונים במסד
- ✅ **להוסיף** - לחץ על טבלה → "Add record"
- ✅ **לערוך** - לחץ על רשומה → ערוך → שמור
- ✅ **למחוק** - לחץ על רשומה → מחק
- ✅ **לחפש** - השתמש בחיפוש למעלה

---

## 📋 סיכום - מה צריך למלא ב-.env?

### קובץ: `backend/.env`

```env
# מסד נתונים - כבר מוכן! ✅
DATABASE_URL="postgresql://vaad_user:vaad_password@localhost:5432/vaad_db"

# מפתח אבטחה - כבר מוכן! ✅
JWT_SECRET="vaad-mevakshei-hashem-secret-key-change-in-production-2024"

# Cloudinary - צריך למלא! ⚠️
CLOUDINARY_CLOUD_NAME="הכנס-כאן-Cloud-Name-שלך"
CLOUDINARY_API_KEY="הכנס-כאן-API-Key-שלך"
CLOUDINARY_API_SECRET="הכנס-כאן-API-Secret-שלך"

# פורט - כבר מוכן! ✅
PORT=5000

# סביבה - כבר מוכן! ✅
NODE_ENV=development
```

**רק 3 שורות צריך למלא (3-5):**
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

**איפה לקבל?** מ-Cloudinary Dashboard (ראה למעלה)

---

## 🎯 דוגמה מלאה:

אם הפרטים שלך מ-Cloudinary הם:
- Cloud Name: `dxy8k9abc`
- API Key: `123456789012345`
- API Secret: `abcdefghijklmnop`

אז ב-`.env` תכתוב:
```env
CLOUDINARY_CLOUD_NAME="dxy8k9abc"
CLOUDINARY_API_KEY="123456789012345"
CLOUDINARY_API_SECRET="abcdefghijklmnop"
```

**⚠️ חשוב:** 
- שמור את המרכאות `""`
- אל תוסיף רווחים מיותרים
- העתק בדיוק כמו שמופיע ב-Cloudinary

---

## ✅ בדיקה שהכל עובד:

1. ✅ האפליקציה רצה: `npm run dev`
2. ✅ אפשר להתחבר: `http://localhost:3000/admin/login`
3. ✅ Cloudinary מוגדר: העלה תמונה דרך Admin Panel
4. ✅ מסד נתונים נגיש: `npx prisma studio`

---

## 🆘 בעיות נפוצות:

**"לא יכול להתחבר למנהל"**
- ודא שהאפליקציה רצה
- בדוק שהאימייל והסיסמה נכונים: `admin@vaad.org` / `admin123`

**"העלאת תמונה לא עובדת"**
- ודא שהגדרת Cloudinary ב-`.env`
- ודא שהפעלת מחדש את ה-backend
- בדוק שיש חיבור לאינטרנט

**"Prisma Studio לא נפתח"**
- ודא ש-PostgreSQL רץ: `docker ps`
- אם לא, הרץ: `docker-compose up -d postgres`

---

**בהצלחה! 🎉**

לשאלות נוספות, עיין ב-`ADMIN_GUIDE.md` או `CLOUDINARY_SETUP.md`
