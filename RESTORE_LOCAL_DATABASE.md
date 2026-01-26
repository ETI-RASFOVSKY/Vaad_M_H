# החזרת מסד הנתונים המקומי

## הבעיה

לפני הפריסה לענן, הבקאנד עבד עם PostgreSQL מקומי. עכשיו יש בעיית אימות.

## פתרון מהיר - 2 אפשרויות

### אפשרות 1: שימוש ב-PostgreSQL מקומי (אם מותקן)

אם יש לכם PostgreSQL מותקן מקומית:

1. **עצרו את Docker PostgreSQL:**
   ```bash
   docker stop vaad_postgres
   ```

2. **עדכנו את `backend/.env`:**
   ```env
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/vaad_db"
   ```
   
   **החלפו `YOUR_PASSWORD` בסיסמה של PostgreSQL המקומי שלכם.**

3. **אם המסד נתונים לא קיים, צרו אותו:**
   ```bash
   psql -U postgres
   ```
   
   ואז:
   ```sql
   CREATE DATABASE vaad_db;
   \q
   ```

4. **הריצו מיגרציה:**
   ```bash
   cd backend
   npx prisma migrate dev --name init
   ```

### אפשרות 2: שימוש ב-Docker (אם אין PostgreSQL מקומי)

אם אין PostgreSQL מותקן מקומית:

1. **ודאו ש-Docker PostgreSQL רץ:**
   ```bash
   docker ps
   ```
   
   אם לא רץ:
   ```bash
   docker-compose up -d postgres
   ```

2. **עדכנו את `backend/.env` בדיוק כך:**
   ```env
   DATABASE_URL="postgresql://vaad_user:vaad_password@localhost:5432/vaad_db"
   ```
   
   **חשוב מאוד:** הפרטים חייבים להיות בדיוק כך!

3. **בדקו חיבור:**
   ```bash
   docker exec -it vaad_postgres psql -U vaad_user -d vaad_db
   ```
   
   אם זה עובד, תראו `vaad_db=#`

4. **הריצו מיגרציה:**
   ```bash
   cd backend
   npx prisma migrate dev --name init
   ```

## איך לדעת איזה אפשרות להשתמש?

### בדיקה מהירה:

```bash
# נסו להתחבר ל-PostgreSQL מקומי
psql -U postgres
```

**אם זה עובד** → יש PostgreSQL מקומי → השתמשו באפשרות 1

**אם זה לא עובד** → אין PostgreSQL מקומי → השתמשו באפשרות 2 (Docker)

## דוגמה לקובץ .env מלא (Docker)

```env
# מסד נתונים - Docker
DATABASE_URL="postgresql://vaad_user:vaad_password@localhost:5432/vaad_db"

# מפתח אבטחה
JWT_SECRET="your-secret-key-here"

# Cloudinary (אופציונלי)
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""

# פורט
PORT=5000

# סביבה
NODE_ENV=development
```

## דוגמה לקובץ .env מלא (PostgreSQL מקומי)

```env
# מסד נתונים - PostgreSQL מקומי
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/vaad_db"

# מפתח אבטחה
JWT_SECRET="your-secret-key-here"

# Cloudinary (אופציונלי)
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""

# פורט
PORT=5000

# סביבה
NODE_ENV=development
```

## אחרי התיקון

לאחר שהמיגרציה תצליח:

1. **הפעילו את השרת:**
   ```bash
   npm run dev
   ```

2. **בדקו שהכל עובד:**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000/api/health

## אם עדיין לא עובד

### בדיקת חיבור ידני:

**עם Docker:**
```bash
docker exec -it vaad_postgres psql -U vaad_user -d vaad_db -c "SELECT 1;"
```

**עם PostgreSQL מקומי:**
```bash
psql -U postgres -d vaad_db -c "SELECT 1;"
```

אם זה עובד, החיבור תקין והבעיה היא ב-Prisma. נסו:
```bash
cd backend
npx prisma generate
npx prisma migrate dev --name init
```
