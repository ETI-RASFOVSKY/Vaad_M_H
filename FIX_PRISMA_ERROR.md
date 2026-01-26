# פתרון שגיאת Prisma EPERM

## הבעיה

שגיאת `EPERM: operation not permitted` מתרחשת כאשר Windows לא יכול לשנות/למחוק קובץ שכבר בשימוש.

## פתרונות (בסדר עדיפות)

### פתרון 1: עצרו את השרת

אם השרת רץ, עצרו אותו (Ctrl+C) ואז נסו שוב:

```bash
cd backend
npx prisma generate
```

### פתרון 2: סגרו את כל התהליכים

1. סגרו את כל החלונות של הטרמינל
2. סגרו את VS Code / IDE אם הוא פתוח
3. פתחו טרמינל חדש
4. נסו שוב:

```bash
cd backend
npx prisma generate
```

### פתרון 3: הרצה עם הרשאות מנהל

1. לחצו ימני על PowerShell/Command Prompt
2. בחרו "Run as administrator"
3. הרצו:

```bash
cd C:\Users\PC\Desktop\vaad_2\Vaad_M_H\backend
npx prisma generate
```

### פתרון 4: מחקו ידנית את התיקייה

1. עצרו את השרת (אם רץ)
2. סגרו את כל ה-IDEs
3. מחקו את התיקייה:
   ```
   C:\Users\PC\Desktop\vaad_2\Vaad_M_H\node_modules\.prisma
   ```
4. נסו שוב:

```bash
cd backend
npx prisma generate
```

### פתרון 5: מחקו את node_modules והתקינו מחדש

```bash
cd backend

# מחקו את node_modules
rmdir /s /q node_modules

# התקינו מחדש
npm install

# נסו שוב
npx prisma generate
```

### פתרון 6: בדקו אנטי-וירוס

אם יש לכם אנטי-וירוס, הוא עלול לחסום את הפעולה. נסו:
1. הוסיפו את תיקיית הפרויקט לרשימת החריגים
2. או השביתו זמנית את האנטי-וירוס

## אחרי שהצלחתם

לאחר ש-`prisma generate` עובד, הריצו:

```bash
cd backend
npx prisma migrate dev --name init
```

או אם כבר יש מיגרציות:

```bash
npx prisma migrate deploy
```

## בדיקה

לאחר שהכל עובד, בדקו:

```bash
cd backend
npx prisma studio
```

זה אמור לפתוח דפדפן עם כל הטבלאות.

## אם עדיין לא עובד

נסו להריץ את זה מתיקיית ה-root של הפרויקט:

```bash
cd C:\Users\PC\Desktop\vaad_2\Vaad_M_H
npx prisma generate --schema=backend/prisma/schema.prisma
```
