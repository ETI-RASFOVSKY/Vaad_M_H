# תיקון בעיות SSL וסיסמה

## הבעיות

1. **שגיאת SSL ב-Cloudinary**: `self-signed certificate in certificate chain`
2. **סיסמה לא נשמרת**: ה-token לא נשמר ב-localStorage

## מה תוקן

### 1. תיקון SSL של Cloudinary

הוספתי קוד שמתעלם מ-SSL verification ב-development עבור Cloudinary. זה פותר את בעיית ה-certificate chain.

### 2. בדיקת שמירת Token

ה-token כבר נשמר ב-localStorage בקוד. אם הוא לא נשמר, זה יכול להיות בגלל:
- בעיית CORS
- בעיית verify endpoint
- בעיית JWT secret

## איך לבדוק

### 1. הפעילו מחדש את השרת:
```bash
# עצרו (Ctrl+C)
npm run dev
```

### 2. נסו להעלות מדיה:
- השגיאת SSL אמורה להיעלם
- תראו בלוגים: `⚠️  SSL verification disabled for Cloudinary in development`

### 3. בדקו את ה-Token:
1. התחברו
2. פתחו DevTools → Application → Local Storage
3. בדקו אם יש `token` עם ערך

## אם הסיסמה עדיין לא נשמרת

### בדקו את ה-verify endpoint:

הריצו:
```bash
cd backend
node -e "const jwt = require('jsonwebtoken'); const token = 'YOUR_TOKEN_HERE'; const decoded = jwt.verify(token, process.env.JWT_SECRET); console.log(decoded);"
```

### בדקו את ה-localStorage:

פתחו DevTools → Console והריצו:
```javascript
localStorage.getItem('token')
```

אם זה מחזיר `null`, ה-token לא נשמר.

## פתרון חלופי ל-SSL

אם עדיין יש בעיית SSL, הוסיפו ל-`backend/.env`:
```env
NODE_TLS_REJECT_UNAUTHORIZED=0
```

**אזהרה:** זה רק ל-development! אל תשתמשו בזה ב-production!
