# סיכום השינויים - שיפורי האתר

## 1. מערכת שליחת מיילים ✅

### מה נוסף:
- התקנת `nodemailer` לשליחת מיילים
- שליחת מייל למנהל כאשר מתקבלת הודעה דרך טופס יצירת קשר
- שליחת מייל אישור למשתמש ששלח את ההודעה
- שליחת קודי אימות במייל

### קבצים שנוספו/שונו:
- `backend/src/services/email.js` - שירות שליחת מיילים
- `backend/src/routes/messages.js` - עדכון לשליחת מיילים
- `EMAIL_SETUP.md` - מדריך הגדרה מפורט

### הגדרה נדרשת:
- **מומלץ:** Resend (קל ומהיר, אין צורך ב-App Password) - ראה `QUICK_EMAIL_SETUP.md`
- **אופציונלי:** Gmail עם App Password - ראה `EMAIL_SETUP.md`
- **אופציונלי:** ללא הגדרה - המערכת תעבוד אבל מיילים לא יישלחו

## 2. מערכת הרשמת מנהל מאובטחת ✅

### מה נוסף:
- הרשמת מנהל חדש עם אימות מייל (קוד 6 ספרות)
- אימות מייל חובה לפני התחברות
- אפשרות לשלוח קוד אימות מחדש
- אימות Google OAuth (התחברות/הרשמה עם Google)
- איפוס סיסמה מאובטח עם קוד אימות

### קבצים שנוספו/שונו:
- `backend/prisma/schema.prisma` - הוספת שדות אימות
- `backend/src/routes/auth.js` - הוספת כל הנתיבים החדשים:
  - `POST /api/auth/register` - הרשמה
  - `POST /api/auth/verify-email` - אימות מייל
  - `POST /api/auth/resend-verification` - שליחת קוד מחדש
  - `POST /api/auth/google` - התחברות עם Google
  - `POST /api/auth/forgot-password` - בקשת איפוס סיסמה
  - `POST /api/auth/reset-password` - איפוס סיסמה עם קוד
- `frontend/src/pages/admin/AdminLogin.tsx` - דף התחברות/הרשמה מלא
- `frontend/src/App.tsx` - הוספת GoogleOAuthProvider

### אבטחה:
- סיסמאות מוצפנות עם bcrypt
- קודי אימות תקפים ל-10 דקות בלבד
- אימות מייל חובה לפני התחברות
- אימות Google מאובטח

## 3. הוספת קטגוריית "וידיאו" לגלריה ✅

### מה נוסף:
- אפשרות לסווג מדיה כקטגוריה "וידיאו"
- הקטגוריה מופיעה בתפריט הבחירה בעת העלאת מדיה

### קבצים שנוספו/שונו:
- `frontend/src/pages/admin/MediaManager.tsx` - הוספת אופציה "וידיאו"

## הגדרות נדרשות

### Backend (.env):
```env
# Email - אפשרות 1: Resend (מומלץ - הכי קל)
RESEND_API_KEY=re_your_api_key_here
EMAIL_FROM=onboarding@resend.dev
ADMIN_EMAIL=e0548451274@gmail.com

# Email - אפשרות 2: Gmail (דורש App Password)
# EMAIL_USER=e0548451274@gmail.com
# EMAIL_PASSWORD=your-app-password-here
# ADMIN_EMAIL=e0548451274@gmail.com

# Google OAuth (אופציונלי)
GOOGLE_CLIENT_ID=your-google-client-id

# קיימים
DATABASE_URL=...
JWT_SECRET=...
CLOUDINARY_*=...
```

**הערה:** בחרו רק אחת מהאפשרויות למייל (Resend או Gmail). Resend מומלץ כי הוא קל יותר.

### Frontend (.env):
```env
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

## מיגרציה של מסד הנתונים

לאחר השינויים, יש להריץ מיגרציה:

```bash
cd backend
npx prisma migrate dev --name add_email_verification
npx prisma generate
```

## שינוי כתובת המייל של הלקוח

כדי לשנות את כתובת המייל שמקבלת הודעות:

1. עדכנו את `ADMIN_EMAIL` בקובץ `.env` של ה-backend
2. או ערכו את `backend/src/services/email.js` ושינוי את המייל הקבוע

ראה `EMAIL_SETUP.md` לפרטים נוספים.

## הערות חשובות

1. **App Password**: יש להשתמש ב-App Password של Gmail, לא בסיסמה הרגילה
2. **Google OAuth**: אופציונלי - אם לא מוגדר, התחברות עם Google לא תעבוד
3. **אימות מייל**: מנהלים חדשים חייבים לאמת את המייל לפני התחברות
4. **איפוס סיסמה**: דורש ידיעת המייל והסיסמה הנוכחית + קוד אימות
