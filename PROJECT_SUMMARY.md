# סיכום פרויקט - אתר ועד מבקשי ה'

## סקירה כללית

נבנה אתר תדמיתי מלא עבור ארגון "ועד מבקשי ה'" עם מערכת ניהול תוכן מלאה.

## מה נבנה

### 1. Frontend (React + TypeScript)

#### עמודים ציבוריים:
- **עמוד הבית**: וידאו רקע, סטטיסטיקות, כפתורי CTA
- **אודותינו**: מידע מפורט על הארגון, הפעילות והצוות
- **גלריה**: תצוגת תמונות וסרטונים עם סינון לפי קטגוריות
- **צור קשר**: טופס יצירת קשר עם ולידציה
- **תרומה**: עמוד הפניה לנדרים פלוס

#### מערכת ניהול (Admin):
- **התחברות**: מסך login עם JWT authentication
- **לוח בקרה**: סטטיסטיקות וסקירה כללית
- **ניהול גלריה**: העלאת תמונות/סרטונים, מחיקה, שיוך לקטגוריות
- **ניהול הודעות**: צפייה בהודעות, סימון כטופל

### 2. Backend (Node.js + Express)

#### API Endpoints:
- **Auth**: `/api/auth/login`, `/api/auth/verify`
- **Media**: `/api/media/upload`, `/api/media`, `/api/media/:id` (DELETE)
- **Messages**: `/api/messages` (POST, GET), `/api/messages/:id/handle`

#### תכונות:
- JWT Authentication
- Prisma ORM עם PostgreSQL
- Cloudinary integration להעלאת מדיה
- Validation עם express-validator
- Error handling מרכזי

### 3. Database (PostgreSQL + Prisma)

#### טבלאות:
- **users**: משתמשי מנהל
- **messages**: הודעות מהמבקרים
- **media**: תמונות וסרטונים

### 4. DevOps & Deployment

- Docker & Docker Compose
- Nginx configuration
- מדריכי פריסה ל-AWS ו-Render
- Git configuration

## טכנולוגיות

### Frontend
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- Framer Motion (animations)
- React Router (routing)
- React Hook Form + Zod (forms)
- Axios (HTTP client)

### Backend
- Node.js 20
- Express.js
- Prisma ORM
- PostgreSQL
- JWT (authentication)
- Cloudinary (media storage)
- Multer (file uploads)
- bcryptjs (password hashing)

### DevOps
- Docker
- Docker Compose
- Nginx
- Git

## מבנה הקבצים

```
Vaad_M_H/
├── frontend/              # React application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context (Auth)
│   │   └── api/           # API client
│   ├── public/            # Static assets
│   └── package.json
├── backend/               # Express API
│   ├── src/
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Express middleware
│   │   └── scripts/       # Utility scripts
│   ├── prisma/            # Database schema
│   └── package.json
├── docker-compose.yml     # Docker setup
├── README.md              # Main documentation
├── SETUP.md               # Installation guide
└── DEPLOYMENT.md          # Deployment guide
```

## תכונות מיוחדות

1. **עיצוב בהשראת ישיבת מיר**: צבעים, טיפוגרפיה ואנימציות דומות
2. **וידאו רקע**: תמיכה בוידאו רקע אוטומטי בעמוד הבית
3. **גלריה אינטראקטיבית**: Lightbox, סינון, infinite scroll
4. **מערכת ניהול מלאה**: העלאת מדיה, ניהול הודעות
5. **Responsive Design**: מותאם למובייל וטאבלט
6. **RTL Support**: תמיכה מלאה בעברית מימין לשמאל

## אבטחה

- JWT tokens עם expiration
- Password hashing עם bcrypt
- Input validation
- CORS configuration
- Rate limiting (מוכן להגדרה)
- Environment variables למידע רגיש

## צעדים הבאים

1. **הוספת וידאו רקע**: העלה קובץ `hero-video.mp4` ל-`frontend/public/`
2. **הגדרת Cloudinary**: קבל credentials והגדר ב-`.env`
3. **יצירת משתמש מנהל**: הרץ `npm run create-admin` ב-backend
4. **העלאת תוכן**: השתמש ב-Admin Panel להעלאת תמונות וסרטונים
5. **פריסה**: עיין ב-`DEPLOYMENT.md` לפרטי פריסה

## הערות חשובות

- **JWT_SECRET**: החלף ב-production למפתח אקראי חזק
- **Database**: ודא ש-PostgreSQL רץ לפני הרצת האפליקציה
- **Cloudinary**: נדרש לחשבון Cloudinary להעלאת מדיה
- **Environment Variables**: ודא שכל המשתנים מוגדרים ב-`.env`

## תמיכה

לשאלות או בעיות:
1. עיין ב-`SETUP.md` לפתרון בעיות נפוצות
2. בדוק את ה-logs ב-console
3. ודא שכל התלויות מותקנות

---

**נבנה עם ❤️ עבור ועד מבקשי ה'**
