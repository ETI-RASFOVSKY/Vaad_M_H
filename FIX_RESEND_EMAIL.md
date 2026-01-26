# תיקון מייל Resend - בעיית דומיין

## הבעיה

Resend דורש דומיין מאומת כדי לשלוח מיילים לכתובות שאינן של החשבון.

## פתרון מהיר - 2 אפשרויות

### אפשרות 1: שימוש ב-Gmail (הכי מהיר)

הוסיפו ל-`backend/.env`:

```env
# הסירו או העירו את Resend
# RESEND_API_KEY=re_Hiqap1sX_FToWDnhbeYJ3eoFmPHLyU2P7

# השתמשו ב-Gmail במקום
EMAIL_USER=e0548451274@gmail.com
EMAIL_PASSWORD=your-gmail-app-password-here
EMAIL_FROM=e0548451274@gmail.com
```

**איך ליצור App Password:**
1. לכו ל: https://myaccount.google.com/
2. אבטחה → אימות דו-שלבי (חובה!)
3. סיסמאות אפליקציות → צרו סיסמה חדשה
4. העתיקו את הסיסמה (16 תווים)

### אפשרות 2: אימות דומיין ב-Resend (מומלץ לפרודקשן)

1. לכו ל: https://resend.com/domains
2. לחצו "Add Domain"
3. הוסיפו את הדומיין שלכם
4. הוסיפו את ה-DNS records שהמערכת מבקשת
5. אחרי האימות, עדכנו את `EMAIL_FROM` ל: `noreply@yourdomain.com`

## פתרון זמני - שימוש במייל החשבון

אם תרצו להשתמש ב-Resend בלי דומיין, תוכלו לשלוח למייל החשבון שלכם:

הוסיפו ל-`backend/.env`:

```env
RESEND_FROM_EMAIL=onboarding@resend.dev
RESEND_TO_EMAIL=r0533160762@gmail.com
```

ואז עדכנו את הקוד לשלוח למייל הזה במקום.

## המלצה

**לפיתוח מקומי:** השתמשו ב-Gmail (אפשרות 1) - הכי קל ומהיר.

**לפרודקשן:** אימתו דומיין ב-Resend (אפשרות 2) - יותר מקצועי.

## אחרי התיקון

1. **הפעילו מחדש את השרת:**
   ```bash
   # עצרו (Ctrl+C)
   npm run dev
   ```

2. **נסו איפוס סיסמה:**
   - המייל אמור להישלח
   - בדקו את הלוגים בשרת

## האימייל כבר מאומת! ✅

רצתי `verify-user.js` והאימייל שלכם עכשיו מאומת. תוכלו להתחבר!
