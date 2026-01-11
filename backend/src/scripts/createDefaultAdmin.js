import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function createDefaultAdmin() {
  try {
    const email = 'admin@vaad.org';
    const password = 'admin123';

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log('משתמש מנהל כבר קיים עם אימייל זה');
      console.log(`אימייל: ${email}`);
      return;
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: 'admin',
      },
    });

    console.log('\n✅ משתמש מנהל נוצר בהצלחה!');
    console.log(`📧 אימייל: ${user.email}`);
    console.log(`🔑 סיסמה: ${password}`);
    console.log(`🆔 ID: ${user.id}`);
    console.log('\n⚠️  חשוב: שנה את הסיסמה לאחר ההתחברות הראשונה!');
    console.log('\nעכשיו תוכל להתחבר ב: http://localhost:3000/admin/login\n');
  } catch (error) {
    console.error('שגיאה ביצירת מנהל:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createDefaultAdmin();
