# הגדרת מסד נתונים עם Docker

## PostgreSQL רץ ב-Docker ✅

PostgreSQL רץ במיכל Docker. עכשיו צריך להגדיר את החיבור.

## שלב 1: עדכנו את backend/.env

פתחו את `backend/.env` והוסיפו/עדכנו:

```env
DATABASE_URL="postgresql://vaad_user:vaad_password@localhost:5432/vaad_db"
```

**זה חשוב!** זה הפרטים מה-docker-compose.yml.

## שלב 2: הריצו מיגרציה

```bash
cd backend
npx prisma migrate dev --name init
```

## שלב 3: בדיקה

```bash
cd backend
npx prisma studio
```

זה אמור לפתוח דפדפן עם כל הטבלאות.

## אם יש שגיאה

### שגיאת חיבור

אם אתם מקבלים שגיאת חיבור, ודאו ש:

1. **PostgreSQL רץ:**
   ```bash
   docker ps
   ```
   אתם צריכים לראות `vaad_postgres` ברשימה.

2. **ה-DATABASE_URL נכון:**
   ```env
   DATABASE_URL="postgresql://vaad_user:vaad_password@localhost:5432/vaad_db"
   ```

3. **הפורט פתוח:**
   ```bash
   netstat -an | findstr 5432
   ```
   אתם צריכים לראות משהו.

### אם PostgreSQL לא רץ

```bash
# בדיקה
docker ps -a

# הפעלה
docker-compose up -d postgres

# או
docker start vaad_postgres
```

## עצירת PostgreSQL

אם תרצו לעצור את PostgreSQL:

```bash
docker-compose stop postgres
```

או:

```bash
docker stop vaad_postgres
```

## מחיקת הכל והתחלה מחדש

אם תרצו לאפס הכל:

```bash
# עצירה ומחיקה
docker-compose down -v

# הפעלה מחדש
docker-compose up -d postgres
```

**אזהרה:** זה ימחק את כל הנתונים!
