# עדכון קובץ .env

## הבעיה

ה-RESEND_API_KEY לא נמצא ב-`backend/.env`, ולכן המיילים לא נשלחים.

## פתרון

פתחו את `backend/.env` והוסיפו את השורות הבאות בסוף הקובץ:

```env
RESEND_API_KEY=re_Hiqap1sX_FToWDnhbeYJ3eoFmPHLyU2P7
EMAIL_FROM=onboarding@resend.dev
ADMIN_EMAIL=e0548451274@gmail.com
```

## קובץ .env מלא

הקובץ `backend/.env` צריך להראות כך:

```env
DATABASE_URL="postgresql://vaad_user:vaad_password@localhost:5433/vaad_db"
JWT_SECRET="vaad-mevakshei-hashem-secret-key-change-in-production-2024"
CLOUDINARY_CLOUD_NAME="dpllumkct"
CLOUDINARY_API_KEY="822177552481135"
CLOUDINARY_API_SECRET="tg45h9KNHs8jpO6RKQbQHd42468"
PORT=5000
NODE_ENV=development

# Email Configuration
RESEND_API_KEY=re_Hiqap1sX_FToWDnhbeYJ3eoFmPHLyU2P7
EMAIL_FROM=onboarding@resend.dev
ADMIN_EMAIL=e0548451274@gmail.com
```

## אחרי העדכון

1. **הפעילו מחדש את השרת:**
   ```bash
   # עצרו את השרת (Ctrl+C)
   # הפעילו מחדש:
   npm run dev
   ```

2. **בדקו את הלוגים:**
   - כשתבקשו איפוס סיסמה, אמורים לראות:
     ```
     📧 Sending password reset email to ... via Resend...
     ✅ Password reset email sent successfully via Resend: ...
     ```

3. **אם עדיין לא עובד:**
   - בדקו את הלוגים בשרת
   - ודאו שה-RESEND_API_KEY נכון
   - ודאו שה-EMAIL_FROM נכון

## לגבי הקוד שמופיע אוטומטית

אם המייל לא נשלח, הקוד יופיע בקונסול של השרת. זה נורמלי במצב development. אחרי שתוסיפו את ה-RESEND_API_KEY, המיילים יישלחו והקוד לא יופיע בקונסול.
