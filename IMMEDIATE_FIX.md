# תיקון מיידי - בעיות מייל ואימות

## הבעיות

1. **האימייל לא מאומת** - גורם לשגיאת 403
2. **מייל לא נשלח** - צריך לבדוק למה

## תיקון מיידי

### שלב 1: אמתו את האימייל ידנית

הריצו:

```bash
cd backend
node verify-user.js
```

זה יאמת את האימייל `e0548451274@gmail.com` במסד הנתונים.

### שלב 2: בדקו את המייל

ודאו שיש ב-`backend/.env`:

```env
RESEND_API_KEY=re_Hiqap1sX_FToWDnhbeYJ3eoFmPHLyU2P7
EMAIL_FROM=onboarding@resend.dev
ADMIN_EMAIL=e0548451274@gmail.com
```

### שלב 3: הפעילו מחדש את השרת

```bash
# עצרו את השרת (Ctrl+C)
# הפעילו מחדש:
npm run dev
```

### שלב 4: נסו איפוס סיסמה

1. לכו ל: http://localhost:3000/admin/login
2. לחצו "שכחתי סיסמה"
3. הזינו את האימייל: e0548451274@gmail.com
4. בדקו את הלוגים בשרת - אמורים לראות:
   ```
   📧 Sending password reset email to ... via Resend...
   ✅ Password reset email sent successfully via Resend
   ```

## אם המייל עדיין לא נשלח

### בדקו את הלוגים בשרת

חפשו שגיאות כמו:
- `❌ Resend error:`
- `Error sending password reset email:`

### בדיקת Resend API Key

הריצו:

```bash
cd backend
node -e "require('dotenv').config(); const { Resend } = require('resend'); const resend = new Resend(process.env.RESEND_API_KEY); resend.emails.send({ from: 'onboarding@resend.dev', to: 'e0548451274@gmail.com', subject: 'Test', html: '<p>Test</p>' }).then(r => console.log('✅ Success:', r)).catch(e => console.error('❌ Error:', e.message))"
```

אם זה עובד, Resend תקין. אם לא, יש בעיה עם ה-API Key.

## אחרי התיקון

לאחר שתריצו `node verify-user.js`, האימייל יהיה מאומת ותוכלו להתחבר!
