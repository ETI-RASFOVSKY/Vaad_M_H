# פתרון שגיאת 500 - Internal Server Error

## הבעיה

אם אתם מקבלים שגיאת 500 כאשר מנסים לגשת ל-`/api/media` או נתיבים אחרים, זה כנראה כי:

1. **המיגרציה של Prisma לא רצה** - הטבלאות לא קיימות במסד הנתונים
2. **Prisma Client לא מעודכן** - הקוד לא תואם לסכמה
3. **המסד נתונים לא מחובר** - בעיית חיבור ל-PostgreSQL

## פתרון מהיר

### שלב 1: ודאו שהמסד נתונים רץ

**Windows:**
- פתחו Services (שירותים)
- חפשו "PostgreSQL"
- ודאו שהוא רץ (Running)

**או בטרמינל:**
```bash
# נסו להתחבר למסד הנתונים
psql -U postgres
```

אם זה לא עובד, הפעילו את PostgreSQL.

### שלב 2: ודאו שיש קובץ `.env` ב-backend

צרו/עדכנו קובץ `backend/.env`:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/vaad_db"
JWT_SECRET="your-secret-key"
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
PORT=5000
NODE_ENV=development
```

**חשוב:** החליפו `username`, `password`, ו-`vaad_db` בערכים הנכונים שלכם.

### שלב 3: הריצו מיגרציה

```bash
cd backend

# יצירת Prisma Client
npx prisma generate

# הרצת מיגרציה (יוצר את הטבלאות)
npx prisma migrate dev --name init

# או אם כבר יש מיגרציות:
npx prisma migrate deploy
```

### שלב 4: הפעילו מחדש את השרת

```bash
cd backend
npm run dev
```

## בדיקה

1. **בדקו את הלוגים של השרת:**
   - אמורים לראות: `Server running on port 5000`
   - אין שגיאות Prisma

2. **בדקו את המסד נתונים:**
   ```bash
   cd backend
   npx prisma studio
   ```
   זה יפתח דפדפן עם כל הטבלאות. אם אתם רואים את הטבלאות `users`, `messages`, `media` - הכל בסדר!

3. **בדקו את ה-API:**
   - פתחו: `http://localhost:5000/api/health`
   - אמורים לראות: `{"status":"ok","message":"Server is running"}`

## אם עדיין לא עובד

### בדקו את הלוגים של השרת

השגיאה המדויקת תופיע בקונסול של השרת. חפשו שגיאות כמו:
- `P1001: Can't reach database server`
- `P2025: Record not found`
- `Table does not exist`

### פתרון בעיות נפוצות

**שגיאת חיבור למסד נתונים:**
```bash
# ודאו שה-DATABASE_URL נכון
# נסו להתחבר ידנית:
psql -U postgres -d vaad_db
```

**שגיאת Prisma:**
```bash
cd backend
npx prisma generate
npx prisma migrate reset  # רק אם צריך לאפס הכל
npx prisma migrate dev
```

**שגיאת Cloudinary:**
- ודאו שה-CLOUDINARY_* מוגדרים ב-`.env`
- אם אין לכם Cloudinary, זה לא אמור להשפיע על GET /api/media

## אם צריך לאפס הכל

```bash
cd backend

# איפוס המסד נתונים (מזהיר: מוחק הכל!)
npx prisma migrate reset

# יצירת מחדש
npx prisma migrate dev --name init
npx prisma generate
```

## עזרה נוספת

אם עדיין יש בעיות, שלחו את הלוגים המלאים מהקונסול של השרת.
