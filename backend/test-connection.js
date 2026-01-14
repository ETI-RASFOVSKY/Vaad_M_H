import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection() {
  try {
    await prisma.$connect();
    console.log('✅ Connected successfully!');
    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection failed:');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    if (error.meta) {
      console.error('Meta:', error.meta);
    }
    await prisma.$disconnect();
    process.exit(1);
  }
}

testConnection();
