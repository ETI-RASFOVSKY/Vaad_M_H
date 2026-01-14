import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

async function testEmail() {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.EMAIL_FROM || 'onboarding@resend.dev';
  const toEmail = 'e0548451274@gmail.com';

  console.log('🔍 Testing email configuration...');
  console.log('RESEND_API_KEY:', apiKey ? `${apiKey.substring(0, 15)}...` : 'NOT SET');
  console.log('EMAIL_FROM:', fromEmail);
  console.log('TO:', toEmail);

  if (!apiKey) {
    console.error('❌ RESEND_API_KEY not set in .env');
    process.exit(1);
  }

  try {
    const resend = new Resend(apiKey);
    console.log('\n📧 Sending test email...');
    
    const result = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: 'בדיקת מייל - ועד מבקשי ה\'',
      html: '<div dir="rtl"><h2>זה מייל בדיקה</h2><p>אם קיבלת את זה, המייל עובד!</p></div>',
    });

    console.log('✅ Email sent successfully!');
    console.log('Result:', result);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error sending email:');
    console.error('Message:', error.message);
    if (error.response) {
      console.error('Response:', error.response);
    }
    process.exit(1);
  }
}

testEmail();
