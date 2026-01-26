# הגדרת Google OAuth (אופציונלי)

## הבעיה

אם אתם רואים שגיאה `Missing required parameter: client_id`, זה אומר שה-Google Client ID לא מוגדר.

## פתרון

### אפשרות 1: להשאיר בלי Google Login (מומלץ)

**כלום!** הכפתור של Google Login יוצג רק אם יש Client ID מוגדר. אם אין, הוא פשוט לא יופיע.

### אפשרות 2: להוסיף Google Login

אם תרצו להוסיף Google Login:

1. **צרו קובץ `frontend/.env`:**
   ```env
   VITE_GOOGLE_CLIENT_ID=your-google-client-id-here
   ```

2. **איך להשיג Google Client ID:**
   - לכו ל: https://console.cloud.google.com/
   - צרו פרויקט חדש (או השתמשו בפרויקט קיים)
   - לכו ל: APIs & Services → Credentials
   - לחצו "Create Credentials" → "OAuth client ID"
   - בחרו "Web application"
   - הוסיפו את ה-URLs:
     - Authorized JavaScript origins: `http://localhost:3000`
     - Authorized redirect URIs: `http://localhost:3000`
   - העתיקו את ה-Client ID

3. **הפעילו מחדש את השרת:**
   ```bash
   # עצרו (Ctrl+C)
   npm run dev
   ```

## אם לא תרצו Google Login

פשוט אל תוסיפו את `VITE_GOOGLE_CLIENT_ID` - הכפתור לא יופיע והכל יעבוד בלי שגיאות!
