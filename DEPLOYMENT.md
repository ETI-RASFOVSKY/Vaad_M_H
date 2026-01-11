# מדריך פריסה - אתר ועד מבקשי ה'

## פריסה לענן (AWS / Render)

### אפשרות 1: Render.com

#### Backend (Node.js)

1. יצירת שירות חדש ב-Render:
   - בחר "New Web Service"
   - חבר את ה-repository שלך
   - בחר את תיקיית `backend`

2. הגדרות סביבה:
   ```
   DATABASE_URL=<your-postgres-url>
   JWT_SECRET=<generate-random-secret>
   CLOUDINARY_CLOUD_NAME=<your-cloud-name>
   CLOUDINARY_API_KEY=<your-api-key>
   CLOUDINARY_API_SECRET=<your-api-secret>
   NODE_ENV=production
   PORT=5000
   ```

3. Build Command:
   ```
   npm install && npx prisma generate && npx prisma migrate deploy
   ```

4. Start Command:
   ```
   npm start
   ```

#### Frontend (React)

1. יצירת שירות Static Site:
   - בחר "New Static Site"
   - חבר את ה-repository שלך
   - בחר את תיקיית `frontend`

2. Build Command:
   ```
   npm install && npm run build
   ```

3. Publish Directory:
   ```
   dist
   ```

4. Environment Variables:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com
   ```

#### Database (PostgreSQL)

1. יצירת PostgreSQL database ב-Render
2. העתק את ה-connection string ל-`DATABASE_URL` ב-backend

### אפשרות 2: AWS

#### EC2 + RDS

1. **הקמת EC2 Instance:**
   ```bash
   # התחברות ל-EC2
   ssh -i your-key.pem ubuntu@your-ec2-ip
   
   # התקנת Docker
   sudo apt update
   sudo apt install docker.io docker-compose -y
   sudo usermod -aG docker ubuntu
   ```

2. **הקמת RDS PostgreSQL:**
   - יצירת RDS instance
   - הגדרת Security Group
   - העתקת connection string

3. **הגדרת משתני סביבה:**
   ```bash
   # ב-EC2
   nano .env
   # הוסף את כל המשתנים הנדרשים
   ```

4. **הרצת האפליקציה:**
   ```bash
   git clone <your-repo>
   cd Vaad_M_H
   docker-compose up -d
   ```

#### S3 + CloudFront (Frontend)

1. בניית ה-frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. העלאה ל-S3:
   ```bash
   aws s3 sync dist/ s3://your-bucket-name
   ```

3. הגדרת CloudFront:
   - יצירת distribution
   - הצבעה ל-S3 bucket
   - הגדרת custom domain (אופציונלי)

## פריסה מקומית עם Docker

### דרישות
- Docker
- Docker Compose

### הוראות

1. שכפול הפרויקט:
   ```bash
   git clone <repository-url>
   cd Vaad_M_H
   ```

2. הגדרת משתני סביבה:
   ```bash
   # Backend
   cp backend/.env.example backend/.env
   # ערוך את backend/.env עם הערכים שלך
   
   # Frontend
   cp frontend/.env.example frontend/.env
   # ערוך את frontend/.env
   ```

3. הרצת הפרויקט:
   ```bash
   docker-compose up -d
   ```

4. יצירת משתמש מנהל:
   ```bash
   docker-compose exec backend npm run create-admin
   ```

5. גישה לאתר:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Admin: http://localhost:3000/admin/login

## הגדרת Git

### יצירת Repository

```bash
git init
git add .
git commit -m "Initial commit - Vaad Mevakshei Hashem website"
git branch -M main
git remote add origin <your-repository-url>
git push -u origin main
```

### .gitignore

הקובץ `.gitignore` כבר מוגדר וכולל:
- node_modules
- .env files
- build/dist directories
- logs

## בדיקות לאחר פריסה

1. **בדיקת Frontend:**
   - פתח את האתר בדפדפן
   - בדוק ניווט בין עמודים
   - בדוק טופס יצירת קשר

2. **בדיקת Backend:**
   - בדוק `/api/health`
   - נסה התחברות מנהל
   - העלה מדיה

3. **בדיקת Database:**
   - ודא שהטבלאות נוצרו
   - בדוק חיבור

## תחזוקה

### עדכון האפליקציה

```bash
git pull
docker-compose down
docker-compose build
docker-compose up -d
```

### גיבוי Database

```bash
docker-compose exec postgres pg_dump -U vaad_user vaad_db > backup.sql
```

### שחזור Database

```bash
docker-compose exec -T postgres psql -U vaad_user vaad_db < backup.sql
```

## תמיכה

לשאלות ותמיכה, אנא צרו קשר דרך טופס יצירת הקשר באתר.
