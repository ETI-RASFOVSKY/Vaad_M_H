# איך לשנות את המייל שמקבל קודי אימות והודעות

## פתרון מהיר

### שלב 1: עדכנו את `backend/.env`

פתחו את `backend/.env` ועדכנו את `ADMIN_EMAIL` למייל שבו תרצו לקבל את הקודים:

```env
ADMIN_EMAIL=your-email@example.com
```

**שימו לב:** אם יש לכם גם `RESEND_ACCOUNT_EMAIL`, המערכת תשתמש ב-`ADMIN_EMAIL` קודם.

### שלב 2: הפעילו מחדש את השרת

```bash
# עצרו את השרת (Ctrl+C)
npm run dev
```

## איך זה עובד

המערכת עכשיו משתמשת ב-`ADMIN_EMAIL` כמייל לקבלת:
- **קודי איפוס סיסמה**
- **קודי אימות אימייל**
- **הודעות יצירת קשר**

אם Resend לא יכול לשלוח למייל שביקשתם (כי אין דומיין מאומת), הוא ישלח ל-`ADMIN_EMAIL` במקום.

## דוגמה

אם תרצו שכל הקודים יישלחו ל-`myadmin@example.com`:

```env
ADMIN_EMAIL=myadmin@example.com
RESEND_API_KEY=re_Hiqap1sX_FToWDnhbeYJ3eoFmPHLyU2P7
EMAIL_FROM=onboarding@resend.dev
```

## אם תרצו לשלוח ישירות למיילים אחרים

אם תרצו לשלוח ישירות למיילים אחרים (לא רק ל-`ADMIN_EMAIL`), תצטרכו:
- לאמת דומיין ב-Resend: https://resend.com/domains
- או להשתמש ב-Gmail עם App Password

לעת עתה, כל הקודים יישלחו ל-`ADMIN_EMAIL` אם לא ניתן לשלוח למייל המקורי.
