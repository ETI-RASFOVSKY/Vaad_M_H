# מדריך התקנה והגדרה - אתר ועד מבקשי ה'

## דרישות מוקדמות

- Node.js 20+ ([הורדה](https://nodejs.org/))
- PostgreSQL 15+ ([הורדה](https://www.postgresql.org/download/))
- Git ([הורדה](https://git-scm.com/downloads))
- npm או yarn

## התקנה שלב אחר שלב

### 1. שכפול הפרויקט

```bash
git clone <repository-url>
cd Vaad_M_H
```

### 2. התקנת תלויות

```bash
# התקנת תלויות root
npm install

# התקנת תלויות backend
cd backend
npm install

# התקנת תלויות frontend
cd ../frontend
npm install
```

### 3. הגדרת מסד הנתונים

#### יצירת מסד נתונים

```bash
# התחברות ל-PostgreSQL
psql -U postgres

# יצירת מסד נתונים
CREATE DATABASE vaad_db;

# יצירת משתמש (אופציונלי)
CREATE USER vaad_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE vaad_db TO vaad_user;

# יציאה
\q
```

### 4. הגדרת משתני סביבה

#### Backend

צור קובץ `.env` בתיקיית `backend`:

```env
DATABASE_URL="postgresql://vaad_user:your_password@localhost:5432/vaad_db"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
CLOUDINARY_CLOUD_NAME="your-cloudinary-cloud-name"
CLOUDINARY_API_KEY="your-cloudinary-api-key"
CLOUDINARY_API_SECRET="your-cloudinary-api-secret"
PORT=5000
NODE_ENV=development
```

**הערות:**
- `JWT_SECRET`: השתמש במפתח אקראי חזק (למשל: `openssl rand -base64 32`)
- `CLOUDINARY_*`: קבל מחשבון Cloudinary שלך ב-[cloudinary.com](https://cloudinary.com)

#### Frontend

צור קובץ `.env` בתיקיית `frontend`:

```env
VITE_API_URL=http://localhost:5000
```

### 5. הגדרת Prisma

```bash
cd backend

# יצירת migrations
npx prisma migrate dev --name init

# יצירת Prisma Client
npx prisma generate
```

### 6. יצירת משתמש מנהל

```bash
cd backend
npm run create-admin
```

הזן:
- אימייל מנהל
- סיסמה מנהל

### 7. הרצת הפרויקט

#### פיתוח (Development)

```bash
# מהתיקייה הראשית
npm run dev
```

זה יריץ:
- Backend על פורט 5000
- Frontend על פורט 3000

או בנפרד:

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

#### ייצור (Production)

```bash
# Build
npm run build

# Start
npm start
```

### 8. גישה לאתר

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Admin Panel**: http://localhost:3000/admin/login

## מבנה הפרויקט

```
Vaad_M_H/
├── backend/                 # Express.js Backend
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Middleware functions
│   │   └── scripts/        # Utility scripts
│   ├── prisma/
│   │   └── schema.prisma  # Database schema
│   └── package.json
├── frontend/               # React Frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context
│   │   └── api/           # API client
│   └── package.json
├── docker-compose.yml      # Docker configuration
└── README.md
```

## פתרון בעיות

### שגיאת חיבור למסד נתונים

1. ודא ש-PostgreSQL רץ:
   ```bash
   # Linux/Mac
   sudo systemctl status postgresql
   
   # Windows
   # בדוק ב-Services
   ```

2. ודא שה-`DATABASE_URL` נכון ב-`.env`

3. בדוק הרשאות משתמש

### שגיאת Prisma

```bash
cd backend
npx prisma generate
npx prisma migrate reset  # רק אם צריך לאפס את המסד
```

### שגיאת Port כבר בשימוש

שנה את הפורט ב-`.env`:
```env
PORT=5001  # במקום 5000
```

### שגיאת Cloudinary

1. ודא שיש לך חשבון Cloudinary
2. העתק את הפרטים הנכונים מ-Dashboard
3. ודא שה-API key ו-secret נכונים

## צעדים הבאים

1. **העלאת וידאו רקע**: הוסף קובץ `hero-video.mp4` ל-`frontend/public/`
2. **התאמת עיצוב**: ערוך את `frontend/tailwind.config.js` לפי הצרכים
3. **הוספת תוכן**: השתמש ב-Admin Panel להעלאת תמונות וסרטונים
4. **הגדרת פריסה**: עיין ב-`DEPLOYMENT.md` לפרטים

## תמיכה

לשאלות או בעיות, אנא צרו issue ב-repository או השתמשו בטופס יצירת הקשר באתר.
