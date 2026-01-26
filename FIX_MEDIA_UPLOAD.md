# תיקון שגיאת העלאת מדיה (500)

## הבעיה

שגיאת 500 בעת העלאת מדיה. זה עבד בעבר, אז זה לא קשור ל-env.

## מה תוקן

1. **לוגים מפורטים** - עכשיו תראו בדיוק איפה הבעיה:
   - אם הקובץ לא הגיע
   - אם Cloudinary לא מוגדר
   - אם יש בעיה בהעלאה ל-Cloudinary
   - אם יש בעיה בשמירה למסד הנתונים

2. **הודעות שגיאה ברורות יותר** - עכשיו תראו מה הבעיה המדויקת

## איך לבדוק

1. **הפעילו מחדש את השרת:**
   ```bash
   # עצרו (Ctrl+C)
   npm run dev
   ```

2. **נסו להעלות מדיה** - עכשיו תראו בלוגים של השרת:
   ```
   📤 Upload request received
   File: { name: ..., size: ..., mimetype: ... }
   📹 Media type: image/video
   ☁️ Uploading to Cloudinary...
   ✅ Cloudinary upload successful
   💾 Saving to database...
   ✅ Media saved
   ```

3. **אם יש שגיאה**, תראו:
   ```
   ❌ Upload error: ...
   Error details: { message: ..., code: ..., name: ... }
   ```

## בעיות נפוצות

### 1. Cloudinary לא מוגדר
אם תראו: `Cloudinary configuration missing`
**פתרון:** ודאו שיש ב-`backend/.env`:
```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### 2. בעיית מסד נתונים
אם תראו: `Database connection error` או `Database tables not found`
**פתרון:** 
- ודאו ש-Docker PostgreSQL רץ: `docker ps`
- ודאו שה-DATABASE_URL נכון ב-`backend/.env`
- הריצו: `cd backend && npx prisma migrate dev`

### 3. בעיית Cloudinary
אם תראו: `Cloudinary error: ...`
**פתרון:** בדקו את ה-credentials ב-Cloudinary dashboard

## בדיקה מהירה

הריצו בשרת ונסו להעלות מדיה. תראו בלוגים בדיוק מה הבעיה!
