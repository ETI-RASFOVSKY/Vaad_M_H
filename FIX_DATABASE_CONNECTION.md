# פתרון בעיית חיבור למסד נתונים

## הבעיה

שגיאת `P1001: Can't reach database server` אומרת ש-PostgreSQL לא רץ או לא נגיש.

## פתרון מהיר

### שלב 1: הפעילו את PostgreSQL

**Windows:**

1. לחצו `Win + R`
2. הקלידו: `services.msc` ולחצו Enter
3. חפשו "PostgreSQL" ברשימה
4. אם הסטטוס הוא "Stopped" (עצור):
   - לחצו ימני על השירות
   - בחרו "Start" (התחל)
5. אם הסטטוס הוא "Running" (רץ) - הכל בסדר, עברו לשלב הבא

**או בטרמינל (PowerShell כמנהל):**
```powershell
# בדיקה אם PostgreSQL רץ
Get-Service -Name postgresql*

# הפעלה (אם לא רץ)
Start-Service -Name postgresql*
```

### שלב 2: בדקו את ה-DATABASE_URL

פתחו את `backend/.env` וודאו שה-`DATABASE_URL` נכון:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/vaad_db"
```

**חשוב:**
- החליפו `username` בשם המשתמש שלכם (בדרך כלל `postgres`)
- החליפו `password` בסיסמה שלכם
- החליפו `vaad_db` בשם מסד הנתונים (אם שונה)

### שלב 3: בדקו חיבור ידני

נסו להתחבר למסד הנתונים:

```bash
psql -U postgres
```

אם זה לא עובד, נסו:

```bash
psql -U postgres -h localhost -p 5432
```

אם זה עדיין לא עובד, PostgreSQL כנראה לא מותקן או לא רץ.

### שלב 4: אם PostgreSQL לא מותקן

אם PostgreSQL לא מותקן, הורידו והתקינו:

1. היכנסו ל: https://www.postgresql.org/download/windows/
2. הורידו את הגרסה האחרונה
3. התקינו (בחרו פורט 5432 כברירת מחדל)
4. זכרו את הסיסמה שיצרתם למשתמש `postgres`

### שלב 5: יצירת מסד נתונים

אם PostgreSQL רץ אבל מסד הנתונים לא קיים:

```bash
# התחברו ל-PostgreSQL
psql -U postgres

# בתוך psql, צרו את מסד הנתונים:
CREATE DATABASE vaad_db;

# יציאה
\q
```

### שלב 6: נסו שוב את המיגרציה

```bash
cd backend
npx prisma migrate dev --name init
```

## פתרון חלופי: Docker

אם אין לכם PostgreSQL מותקן, תוכלו להשתמש ב-Docker:

```bash
# מהתיקייה הראשית של הפרויקט
docker-compose up -d postgres
```

זה יפתח PostgreSQL במיכל Docker.

## בדיקה

לאחר שהכל עובד:

```bash
cd backend

# בדיקת חיבור
npx prisma db pull

# או
npx prisma studio
```

## אם עדיין לא עובד

### בדקו את הלוגים

1. פתחו את Services (services.msc)
2. חפשו PostgreSQL
3. לחצו ימני > Properties
4. לכו ל-"Log On" וודאו שהשירות רץ תחת חשבון נכון

### בדקו את הפורט

```bash
# בדיקה אם פורט 5432 בשימוש
netstat -an | findstr 5432
```

אם אתם רואים משהו, הפורט בשימוש (זה טוב - זה אומר ש-PostgreSQL רץ).

### נסו פורט אחר

אם PostgreSQL רץ על פורט אחר, עדכנו את ה-`DATABASE_URL`:

```env
DATABASE_URL="postgresql://username:password@localhost:5433/vaad_db"
```

(החלפו 5433 בפורט הנכון)

## עזרה נוספת

אם עדיין יש בעיות, שלחו:
1. האם PostgreSQL מותקן?
2. מה הסטטוס ב-Services?
3. מה ה-DATABASE_URL ב-.env? (ללא הסיסמה!)
