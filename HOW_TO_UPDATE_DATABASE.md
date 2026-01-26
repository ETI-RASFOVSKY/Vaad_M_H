# איך לעדכן את מסד הנתונים

## שלבים לעדכון המסד נתונים

### שלב 1: ודאו ש-Docker PostgreSQL רץ

```bash
docker ps
```

אתם צריכים לראות `vaad_postgres` ברשימה.

אם לא רץ:
```bash
docker-compose up -d postgres
```

### שלב 2: ודאו שה-DATABASE_URL נכון

פתחו את `backend/.env` וודאו שיש:

```env
DATABASE_URL="postgresql://vaad_user:vaad_password@localhost:5433/vaad_db"
```

**שימו לב:** הפורט הוא 5433 (לא 5432)!

### שלב 3: עברו לתיקיית backend

```bash
cd backend
```

### שלב 4: רעננו את Prisma Client

```bash
npx prisma generate
```

### שלב 5: הריצו מיגרציה

**אם זו הפעם הראשונה (אין טבלאות):**
```bash
npx prisma migrate dev --name init
```

**אם יש כבר מיגרציות קודמות:**
```bash
npx prisma migrate deploy
```

### שלב 6: בדיקה

```bash
npx prisma studio
```

זה יפתח דפדפן עם כל הטבלאות. אם אתם רואים את הטבלאות `users`, `messages`, `media` - הכל עובד! ✅

## אם יש שגיאה

### שגיאת חיבור

אם אתם מקבלים שגיאת חיבור:
1. ודאו ש-Docker רץ: `docker ps`
2. ודאו שה-DATABASE_URL נכון (פורט 5433!)
3. נסו חיבור ידני: `docker exec vaad_postgres psql -U vaad_user -d vaad_db -c "SELECT 1;"`

### שגיאת Prisma

אם יש שגיאת Prisma:
```bash
cd backend
npx prisma generate
npx prisma migrate dev --name init
```

## סיכום - פקודות מהירות

```bash
# 1. ודאו ש-Docker רץ
docker ps

# 2. עברו לתיקיית backend
cd backend

# 3. רעננו Prisma Client
npx prisma generate

# 4. הריצו מיגרציה
npx prisma migrate dev --name init

# 5. בדיקה
npx prisma studio
```

זה הכל! 🎉
