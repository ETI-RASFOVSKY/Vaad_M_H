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
    console.log('Creating admin user...\n');

    const email = await question('Enter admin email: ');
    const password = await question('Enter admin password: ');

    if (!email || !password) {
      console.error('Email and password are required');
      process.exit(1);
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.error('User with this email already exists');
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

    console.log('\nAdmin user created successfully!');
    console.log(`Email: ${user.email}`);
    console.log(`ID: ${user.id}`);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

createAdmin();
