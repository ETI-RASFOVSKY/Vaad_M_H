# תיקון מהיר - בעיית Prisma

## הבעיה

החיבור הידני ל-Docker עובד, אבל Prisma לא מצליח להתחבר.

## פתרון מהיר (3 שלבים)

### שלב 1: עברו לתיקיית backend

```bash
cd backend
```

**חשוב:** כל הפקודות הבאות צריכות להיות מתיקיית `backend`!

### שלב 2: מחקו את Prisma Client הישן

```bash
rmdir /s /q node_modules\.prisma
```

### שלב 3: רעננו והריצו מיגרציה

```bash
npx prisma generate
npx prisma migrate dev --name init
```

## אם עדיין לא עובד

### בדקו את ה-DATABASE_URL

פתחו את `backend/.env` וודאו שיש בדיוק:

```env
DATABASE_URL="postgresql://vaad_user:vaad_password@localhost:5432/vaad_db"
```

**חשוב:**
- ללא רווחים
- עם גרשיים כפולים
- הפרטים בדיוק כך

### נסו שוב

```bash
cd backend
npx prisma generate
npx prisma migrate dev --name init
```

## בדיקה

לאחר שהמיגרציה תצליח:

```bash
cd backend
npx prisma studio
```

זה אמור לפתוח דפדפן עם כל הטבלאות.

## אם עדיין לא עובד

הריצו:

```bash
cd backend
node -e "require('dotenv').config(); console.log('DATABASE_URL:', process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':****@'))"
```

זה יראה מה Prisma רואה. אם זה לא נכון, עדכנו את ה-`.env`.
