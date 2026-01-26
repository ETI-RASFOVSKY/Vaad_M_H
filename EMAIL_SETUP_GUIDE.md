# 📧 מדריך הגדרת מערכת אימייל

## סקירה כללית

האתר כולל מערכת אימייל מלאה שמאפשרת:
- ✅ שליחת אימיילים למשתמשים
- ✅ תגובה להודעות מהמבקרים
- ✅ דומיין מותאם אישית

---

## אפשרויות הגדרה

### אפשרות 1: Resend.com (מומלץ - קל ומהיר)

**יתרונות:**
- ✅ חינמי עד 3,000 אימיילים/חודש
- ✅ קל להגדרה
- ✅ תמיכה בדומיין מותאם אישית
- ✅ API פשוט

**איך להגדיר:**

1. **הירשם ל-Resend:**
   - לך ל: https://resend.com
   - הירשם (חינמי)

2. **קבל API Key:**
   - לך ל-Dashboard
   - לחץ על "API Keys"
   - צור API Key חדש
   - העתק את ה-Key

3. **הגדר דומיין (אופציונלי):**
   - לך ל-"Domains"
   - לחץ "Add Domain"
   - הוסף את הדומיין שלך (למשל: `vaad.org`)
   - עקוב אחרי ההוראות להוספת DNS records
   - חכה לאימות (יכול לקחת כמה שעות)

4. **הוסף ל-Render Environment Variables:**
   ```
   EMAIL_SERVICE=resend
   RESEND_API_KEY=re_your_api_key_here
   EMAIL_FROM=noreply@vaad.org
   EMAIL_FROM_NAME=ועד מבקשי ה'
   ```

---

### אפשרות 2: SendGrid

**יתרונות:**
- ✅ חינמי עד 100 אימיילים/יום
- ✅ אמין מאוד
- ✅ תמיכה בדומיין מותאם

**איך להגדיר:**

1. **הירשם ל-SendGrid:**
   - לך ל: https://sendgrid.com
   - הירשם (חינמי)

2. **קבל API Key:**
   - לך ל-Settings → API Keys
   - צור API Key חדש
   - בחר "Full Access" או "Mail Send"
   - העתק את ה-Key

3. **הגדר דומיין:**
   - לך ל-Settings → Sender Authentication
   - הוסף Domain Authentication
   - עקוב אחרי ההוראות

4. **הוסף ל-Render Environment Variables:**
   ```
   EMAIL_SERVICE=sendgrid
   SENDGRID_API_KEY=SG.your_api_key_here
   EMAIL_FROM=noreply@vaad.org
   EMAIL_FROM_NAME=ועד מבקשי ה'
   ```

---

### אפשרות 3: SMTP כללי (Gmail, Outlook, וכו')

**יתרונות:**
- ✅ עובד עם כל ספק אימייל
- ✅ אין צורך בשירות חיצוני

**איך להגדיר:**

1. **קבל פרטי SMTP מהספק שלך:**
   - Gmail: smtp.gmail.com, Port 587
   - Outlook: smtp-mail.outlook.com, Port 587
   - וכו'

2. **צור App Password (אם צריך):**
   - Gmail: Settings → Security → 2-Step Verification → App Passwords
   - Outlook: Security → Advanced Security → App Passwords

3. **הוסף ל-Render Environment Variables:**
   ```
   EMAIL_SERVICE=smtp
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-email@gmail.com
   SMTP_PASSWORD=your-app-password
   EMAIL_FROM=your-email@gmail.com
   EMAIL_FROM_NAME=ועד מבקשי ה'
   ```

---

## שימוש במערכת

### דרך Admin Panel:

1. **התחבר ל-Admin Panel:**
   ```
   https://your-site.com/admin/login
   ```

2. **לך ל-"הודעות"**

3. **לחץ על הודעה**

4. **לחץ על "שלח תגובה"**

5. **מלא:**
   - נושא
   - תוכן (HTML)
   - לחץ "שלח"

### דרך API:

**שליחת אימייל כללי:**
```bash
POST /api/email/send
Headers: Authorization: Bearer YOUR_TOKEN
Body: {
  "to": "user@example.com",
  "subject": "נושא",
  "html": "<p>תוכן HTML</p>"
}
```

**תגובה להודעה:**
```bash
POST /api/email/reply/:messageId
Headers: Authorization: Bearer YOUR_TOKEN
Body: {
  "subject": "נושא",
  "html": "<p>תגובה</p>"
}
```

---

## הגדרת דומיין מותאם אישית

### עם Resend:

1. **הוסף דומיין ב-Resend Dashboard**
2. **הוסף DNS Records:**
   - SPF Record
   - DKIM Records
   - DMARC Record (אופציונלי)
3. **חכה לאימות** (יכול לקחת עד 48 שעות)
4. **עדכן את `EMAIL_FROM`** ל: `noreply@yourdomain.com`

### עם SendGrid:

1. **הוסף Domain Authentication**
2. **הוסף DNS Records** לפי ההוראות
3. **חכה לאימות**
4. **עדכן את `EMAIL_FROM`**

---

## בדיקה

### בדיקת הגדרות:

1. **בדוק שה-Environment Variables מוגדרים:**
   - Render Dashboard → Backend → Environment
   - ודא שכל המשתנים קיימים

2. **בדוק את ה-Logs:**
   - Render Dashboard → Backend → Logs
   - חפש שגיאות הקשורות לאימייל

3. **נסה לשלוח אימייל:**
   - דרך Admin Panel
   - בדוק את ה-Logs אם יש שגיאות

---

## פתרון בעיות

### "Email service is not configured"
- ודא שה-`EMAIL_SERVICE` מוגדר
- ודא שה-API Key מוגדר (RESEND_API_KEY או SENDGRID_API_KEY)

### "Authentication failed"
- בדוק שה-API Key נכון
- ודא שה-API Key לא פג תוקף

### "Domain not verified"
- חכה לאימות הדומיין
- בדוק שה-DNS Records נכונים
- ודא שעברו לפחות 24 שעות

### "Email not sending"
- בדוק את ה-Logs ב-Render
- ודא שה-`EMAIL_FROM` נכון
- בדוק שה-`to` address תקין

---

## סיכום

1. ✅ בחר שירות אימייל (Resend מומלץ)
2. ✅ קבל API Key
3. ✅ הוסף ל-Render Environment Variables
4. ✅ הגדר דומיין (אופציונלי)
5. ✅ בדוק שהכל עובד

**הכל מוכן! 🎉**
