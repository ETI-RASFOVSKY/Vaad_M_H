# מדריך הגדרת מערכת המיילים

## אפשרויות הגדרה

יש לכם 3 אפשרויות:

1. **Resend (מומלץ - הכי קל)** - שירות שליחת מיילים חיצוני, אין צורך ב-App Password
2. **Gmail עם App Password** - דורש יצירת App Password
3. **ללא הגדרה** - המערכת תעבוד אבל מיילים לא יישלחו (קודי אימות יופיעו בקונסול)

---

## אפשרות 1: Resend (מומלץ) ⭐

### יתרונות:
- ✅ אין צורך ב-App Password
- ✅ קל להגדרה
- ✅ חינם עד 3,000 מיילים בחודש
- ✅ אמין ומהיר

### שלב 1: יצירת חשבון Resend

1. היכנסו ל-[Resend.com](https://resend.com)
2. לחצו "Sign Up" ויצרו חשבון (חינמי)
3. אחרי ההרשמה, לכו ל-"API Keys"
4. לחצו "Create API Key"
5. תנו שם כמו "Vaad Website"
6. העתיקו את ה-API Key (מתחיל ב-`re_`)

### שלב 2: הגדרת משתני סביבה

הוסיפו לקובץ `.env` בתיקיית `backend`:

```env
# Resend Configuration (הדרך הקלה ביותר)
RESEND_API_KEY=re_your_api_key_here
EMAIL_FROM=noreply@yourdomain.com
# או אם אין לכם דומיין:
EMAIL_FROM=onboarding@resend.dev

# Email Configuration
ADMIN_EMAIL=e0548451274@gmail.com
```

**הערה:** אם אין לכם דומיין משלכם, תוכלו להשתמש ב-`onboarding@resend.dev` לבדיקות, אבל מומלץ להוסיף דומיין משלכם.

---

## אפשרות 2: Gmail עם App Password

### שלב 1: יצירת App Password ב-Gmail

1. היכנסו לחשבון Google שלכם
2. לכו להגדרות: https://myaccount.google.com/
3. בחרו "אבטחה" (Security)
4. הפעילו "אימות דו-שלבי" (2-Step Verification) אם עדיין לא מופעל
5. גללו למטה למצא "סיסמאות אפליקציות" (App passwords)
6. לחצו על "סיסמאות אפליקציות"
7. בחרו "דוא"ל" ו"מכשיר אחר" (או "אפליקציה אחרת")
8. הזינו שם כמו "Vaad Website"
9. לחצו "צור"
10. העתיקו את הסיסמה בת 16 תווים שנוצרה (ללא רווחים)

### שלב 2: הגדרת משתני סביבה

הוסיפו לקובץ `.env` בתיקיית `backend`:

```env
# Gmail Configuration
EMAIL_USER=e0548451274@gmail.com
EMAIL_PASSWORD=your-16-character-app-password-here
ADMIN_EMAIL=e0548451274@gmail.com
```

**חשוב:** 
- `EMAIL_PASSWORD` הוא ה-App Password שיצרתם בשלב 1, לא הסיסמה הרגילה של Gmail
- `ADMIN_EMAIL` הוא המייל שיקבל הודעות מהטופס יצירת קשר

---

## אפשרות 3: ללא הגדרה (לא מומלץ)

אם לא תגדירו מייל:
- ✅ המערכת תעבוד
- ⚠️ מיילים לא יישלחו
- ⚠️ קודי אימות יופיעו בקונסול של השרת (רק למנהלים)
- ❌ משתמשים לא יקבלו מייל אישור

**הערה:** אם תבחרו באפשרות זו, ודאו שאתם בודקים את הלוגים של השרת כדי לראות קודי אימות.

---

## הגדרת Google OAuth (אופציונלי)

אם תרצו לאפשר התחברות עם Google:

1. לכו ל- [Google Cloud Console](https://console.cloud.google.com/)
2. צרו פרויקט חדש או בחרו פרויקט קיים
3. הפעילו את "Google+ API"
4. לכו ל-"Credentials" > "Create Credentials" > "OAuth client ID"
5. בחרו "Web application"
6. הוסיפו את ה-URL של האתר שלכם ב-"Authorized JavaScript origins"
7. העתיקו את ה-Client ID

הוסיפו לקובץ `.env` של ה-backend (`backend/.env`):
```env
GOOGLE_CLIENT_ID=your-google-client-id-here
```

הוסיפו לקובץ `.env` של ה-frontend (`frontend/.env`):
```env
VITE_GOOGLE_CLIENT_ID=your-google-client-id-here
```

---

## שינוי כתובת המייל של הלקוח

כדי לשנות את כתובת המייל שמקבלת הודעות מהטופס יצירת קשר:

1. עדכנו את `ADMIN_EMAIL` בקובץ `.env` של ה-backend
2. או ערכו את `backend/src/services/email.js` ושינוי את המייל הקבוע

---

## בדיקת הפעלה

לאחר ההגדרה, בדקו:

1. שלחו הודעה דרך טופס יצירת קשר
2. בדקו שהמייל הגיע לכתובת המנהל
3. בדקו שהמייל אישור הגיע למשתמש ששלח את ההודעה

---

## פתרון בעיות

### המיילים לא נשלחים

**עם Resend:**
1. ודאו שה-API Key נכון
2. ודאו שה-`EMAIL_FROM` מוגדר נכון
3. בדקו את הלוגים בשרת לזיהוי שגיאות

**עם Gmail:**
1. ודאו ש-App Password נכון
2. ודאו שאימות דו-שלבי מופעל
3. בדקו את הלוגים בשרת לזיהוי שגיאות

### שגיאת "Invalid login" (Gmail)

- ודאו שאתם משתמשים ב-App Password ולא בסיסמה הרגילה
- ודאו שהמייל נכון

### קודי אימות לא מגיעים

אם לא הגדרתם מייל, קודי האימות יופיעו בקונסול של השרת. בדקו את הלוגים.

---

## המלצה

**מומלץ להשתמש ב-Resend** כי:
- קל יותר להגדרה
- אין צורך ב-App Password
- אמין יותר
- חינמי עד 3,000 מיילים בחודש
