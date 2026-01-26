# פתרון שגיאת אימות מסד נתונים

## הבעיה

שגיאת `P1000: Authentication failed` אומרת שה-DATABASE_URL ב-`backend/.env` לא תואם למה ש-Docker יצר.

## פתרון מהיר

### שלב 1: פתחו את `backend/.env`

### שלב 2: ודאו שה-DATABASE_URL בדיוק כך:

```env
DATABASE_URL="postgresql://vaad_user:vaad_password@localhost:5432/vaad_db"
```

**חשוב מאוד:**
- המשתמש חייב להיות: `vaad_user` (לא `postgres`!)
- הסיסמה חייבת להיות: `vaad_password` (לא משהו אחר!)
- המסד נתונים חייב להיות: `vaad_db`

### שלב 3: שמרו את הקובץ

### שלב 4: נסו שוב את המיגרציה

```bash
cd backend
npx prisma migrate dev --name init
```

## דוגמה לקובץ .env מלא

```env
# מסד נתונים - חשוב שהפרטים יהיו בדיוק כך!
DATABASE_URL="postgresql://vaad_user:vaad_password@localhost:5432/vaad_db"

# מפתח אבטחה
JWT_SECRET="your-secret-key-here"

# Cloudinary (אופציונלי כרגע)
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""

# פורט
PORT=5000

# סביבה
NODE_ENV=development
```

## אם עדיין לא עובד

### בדקו ש-PostgreSQL רץ:

```bash
docker ps
```

אתם צריכים לראות `vaad_postgres` ברשימה.

### אם PostgreSQL לא רץ:

```bash
docker-compose up -d postgres
```

### בדיקת חיבור ידני:

```bash
docker exec -it vaad_postgres psql -U vaad_user -d vaad_db
```

אם זה עובד, אתם תראו משהו כמו:
```
psql (15.x)
Type "help" for help.

vaad_db=#
```

זה אומר שהחיבור עובד!

## שגיאת 404 בדפדפן

אם אתם רואים שגיאת 404, זה כנראה כי:

1. **השרת לא רץ** - ודאו שהריצתם:
   ```bash
   npm run dev
   ```

2. **הכתובת לא נכונה** - נסו:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api/health

3. **הפורט תפוס** - בדקו:
   ```bash
   netstat -an | findstr "3000 5000"
   ```

## אחרי שהמיגרציה עובדת

לאחר שהמיגרציה תצליח, תוכלו:

1. **להפעיל את השרת:**
   ```bash
   npm run dev
   ```

2. **לבדוק את המסד נתונים:**
   ```bash
   cd backend
   npx prisma studio
   ```

3. **לגשת לאתר:**
   - Frontend: http://localhost:3000
   - Admin: http://localhost:3000/admin/login
