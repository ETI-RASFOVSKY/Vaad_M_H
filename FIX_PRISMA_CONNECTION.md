# פתרון בעיית Prisma עם Docker

## הבעיה

החיבור הידני ל-Docker עובד, אבל Prisma לא מצליח להתחבר. זה אומר שה-DATABASE_URL ב-`.env` לא נכון או שיש בעיה עם Prisma Client.

## פתרון מהיר

### שלב 1: ודאו שה-DATABASE_URL נכון

פתחו את `backend/.env` וודאו שיש בדיוק:

```env
DATABASE_URL="postgresql://vaad_user:vaad_password@localhost:5432/vaad_db"
```

**חשוב מאוד:**
- ללא רווחים לפני או אחרי
- עם גרשיים כפולים מסביב
- הפרטים בדיוק כך: `vaad_user:vaad_password`

### שלב 2: רעננו את Prisma Client

```bash
cd backend
npx prisma generate
```

### שלב 3: נסו שוב את המיגרציה

```bash
npx prisma migrate dev --name init
```

## אם עדיין לא עובד

### פתרון 1: מחקו את Prisma Client והתקינו מחדש

```bash
cd backend

# מחקו את node_modules/.prisma
rmdir /s /q node_modules\.prisma

# רעננו
npx prisma generate
```

### פתרון 2: בדקו את ה-.env

ודאו שאין רווחים או תווים מוזרים:

```env
DATABASE_URL="postgresql://vaad_user:vaad_password@localhost:5432/vaad_db"
```

**לא:**
- `DATABASE_URL = "..."` (רווחים סביב =)
- `DATABASE_URL="postgresql://vaad_user :vaad_password@..."` (רווחים בתוך)
- `DATABASE_URL=postgresql://...` (ללא גרשיים)

### פתרון 3: נסו עם URL מקודד

אם יש תווים מיוחדים בסיסמה, נסו:

```env
DATABASE_URL="postgresql://vaad_user:vaad_password@localhost:5432/vaad_db?sslmode=prefer"
```

### פתרון 4: בדיקת ה-.env

הדפיסו את ה-DATABASE_URL (ללא הסיסמה):

```bash
cd backend
node -e "require('dotenv').config(); console.log(process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':****@'))"
```

זה יראה לכם מה Prisma רואה.

## בדיקה מהירה

לאחר התיקון, נסו:

```bash
cd backend
npx prisma db pull
```

אם זה עובד, Prisma מתחבר בהצלחה!

## אם עדיין לא עובד

נסו להריץ את זה:

```bash
cd backend
node -e "const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient(); prisma.$connect().then(() => console.log('Connected!')).catch(e => console.error('Error:', e.message))"
```

זה יראה לכם את השגיאה המדויקת.
