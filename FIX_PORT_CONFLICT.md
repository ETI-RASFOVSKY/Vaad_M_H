# פתרון בעיית פורט 5432

## הבעיה

יש PostgreSQL מקומי שרץ על פורט 5432, ו-Prisma מנסה להתחבר אליו במקום ל-Docker.

## פתרון: שינוי פורט Docker

שיניתי את פורט Docker ל-5433 כדי למנוע התנגשות.

### שלב 1: עצרו את Docker PostgreSQL

```bash
docker-compose down
```

### שלב 2: עדכנו את ה-DATABASE_URL

פתחו את `backend/.env` ועדכנו:

```env
DATABASE_URL="postgresql://vaad_user:vaad_password@localhost:5433/vaad_db"
```

**שימו לב:** הפורט השתנה מ-5432 ל-5433!

### שלב 3: הפעילו את Docker מחדש

```bash
docker-compose up -d postgres
```

### שלב 4: בדקו חיבור

```bash
docker exec vaad_postgres psql -U vaad_user -d vaad_db -c "SELECT 1;"
```

### שלב 5: הריצו מיגרציה

```bash
cd backend
npx prisma migrate dev --name init
```

## אם עדיין לא עובד

נסו לבדוק את החיבור:

```bash
cd backend
node test-connection.js
```

אם זה עובד, תראו: `✅ Connected successfully!`

## אופציה חלופית: עצירת PostgreSQL המקומי

אם תרצו להשתמש בפורט 5432, תוכלו לעצור את PostgreSQL המקומי:

1. פתחו Services (Win+R → services.msc)
2. חפשו "PostgreSQL"
3. לחצו ימני → Stop
4. עדכנו את ה-DATABASE_URL חזרה ל-5432

אבל הפתרון עם פורט 5433 יותר בטוח כי לא משפיע על PostgreSQL המקומי.
