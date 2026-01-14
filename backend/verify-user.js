import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function verifyUser() {
  try {
    const email = 'e0548451274@gmail.com';
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.error('❌ User not found:', email);
      process.exit(1);
    }

    console.log('📧 Found user:', user.email);
    console.log('📊 Current status:', {
      emailVerified: user.emailVerified,
      hasPassword: !!user.passwordHash,
    });

    // Verify email
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationCode: null,
        verificationCodeExpires: null,
      },
    });

    console.log('✅ Email verified successfully!');
    console.log('📊 New status:', {
      emailVerified: updated.emailVerified,
    });

    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

verifyUser();
