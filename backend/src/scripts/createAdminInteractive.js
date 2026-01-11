import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import readline from 'readline';

dotenv.config();

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query) => {
  return new Promise((resolve) => rl.question(query, resolve));
};

async function createAdmin() {
  try {
    console.log('\n=== יצירת משתמש מנהל ===\n');

    const email = await question('הזן אימייל למנהל: ');
    if (!email) {
      console.error('אימייל נדרש');
      process.exit(1);
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.error('משתמש עם אימייל זה כבר קיים');
      process.exit(1);
    }

    const password = await question('הזן סיסמה למנהל: ');
    if (!password) {
      console.error('סיסמה נדרשת');
      process.exit(1);
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
    console.log(`🆔 ID: ${user.id}`);
    console.log('\nעכשיו תוכל להתחבר ב: http://localhost:3000/admin/login\n');
  } catch (error) {
    console.error('שגיאה ביצירת מנהל:', error);
    process.exit(1);
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

createAdmin();
