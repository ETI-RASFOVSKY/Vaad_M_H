# אתר ועד מבקשי ה'

אתר תדמיתי מלא עבור ארגון "ועד מבקשי ה'"

## טכנולוגיות

### Frontend
- React 18 + TypeScript
- Vite
- Tailwind CSS
- React Router
- Framer Motion
- React Hook Form + Zod

### Backend
- Node.js 20
- Express.js
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Cloudinary (for media)

### DevOps
- Docker
- Nginx
- Git

## התקנה והרצה

### דרישות מוקדמות
- Node.js 20+
- PostgreSQL 15+
- Docker (אופציונלי)

### התקנה

1. שכפול הפרויקט:
```bash
git clone <repository-url>
cd Vaad_M_H
```

2. התקנת תלויות:
```bash
npm install
cd frontend && npm install
cd ../backend && npm install
```

3. הגדרת משתני סביבה:

צור קובץ `.env` בתיקיית `backend`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/vaad_db"
JWT_SECRET="your-secret-key-here"
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
PORT=5000
NODE_ENV=development
```

צור קובץ `.env` בתיקיית `frontend`:
```env
VITE_API_URL=http://localhost:5000
```

4. הגדרת מסד הנתונים:
```bash
cd backend
npx prisma migrate dev
npx prisma generate
```

5. יצירת משתמש מנהל:
```bash
cd backend
npm run create-admin
```

6. הרצת הפרויקט:

פיתוח:
```bash
npm run dev
```

ייצור:
```bash
npm run build
npm start
```

## מבנה הפרויקט

```
Vaad_M_H/
├── frontend/          # React frontend
├── backend/           # Express backend
├── docker-compose.yml # Docker configuration
└── README.md
```

## עמודים

- **עמוד הבית**: וידאו רקע, סטטיסטיקות, כפתור תרומה
- **אודותינו**: מידע על הארגון, הצוות, תחומי פעילות
- **גלריה**: תמונות וסרטונים עם סינון
- **צור קשר**: טופס יצירת קשר
- **תרומה**: הפניה לנדרים פלוס
- **Admin Panel**: ניהול תוכן ומסרים

## רישיון

© 2024 ועד מבקשי ה'
