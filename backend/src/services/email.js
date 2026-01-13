import nodemailer from 'nodemailer';
import { Resend } from 'resend';

// Check if email is enabled
const isEmailEnabled = () => {
  return !!(process.env.RESEND_API_KEY || (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD));
};

// Create Resend client if API key is available
const getResendClient = () => {
  if (process.env.RESEND_API_KEY) {
    return new Resend(process.env.RESEND_API_KEY);
  }
  return null;
};

// Create transporter - using Gmail as default (if no Resend)
const createTransporter = () => {
  if (process.env.RESEND_API_KEY) {
    return null; // Use Resend instead
  }
  
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'e0548451274@gmail.com',
      pass: process.env.EMAIL_PASSWORD, // App password from Gmail
    },
  });
};

// Send email to admin when contact form is submitted
export const sendContactEmailToAdmin = async (messageData) => {
  if (!isEmailEnabled()) {
    console.log('Email not configured - skipping email to admin');
    return false;
  }

  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'e0548451274@gmail.com';
    const fromEmail = process.env.EMAIL_FROM || process.env.EMAIL_USER || 'e0548451274@gmail.com';
    
    const htmlContent = `
      <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">הודעה חדשה מאתר</h2>
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <p><strong>שם:</strong> ${messageData.name}</p>
          <p><strong>אימייל:</strong> ${messageData.email}</p>
          <p><strong>תוכן ההודעה:</strong></p>
          <p style="white-space: pre-wrap;">${messageData.content}</p>
        </div>
        <p style="color: #666; font-size: 12px;">תאריך: ${new Date().toLocaleString('he-IL')}</p>
      </div>
    `;

    // Use Resend if available
    const resend = getResendClient();
    if (resend) {
      await resend.emails.send({
        from: fromEmail,
        to: adminEmail,
        subject: `הודעה חדשה מאתר - ${messageData.name}`,
        html: htmlContent,
      });
      return true;
    }

    // Fallback to nodemailer
    const transporter = createTransporter();
    if (transporter) {
      await transporter.sendMail({
        from: fromEmail,
        to: adminEmail,
        subject: `הודעה חדשה מאתר - ${messageData.name}`,
        html: htmlContent,
      });
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error sending email to admin:', error);
    return false;
  }
};

// Send confirmation email to user when contact form is submitted
export const sendContactConfirmationToUser = async (userEmail, userName) => {
  if (!isEmailEnabled()) {
    console.log('Email not configured - skipping confirmation email');
    return false;
  }

  try {
    const fromEmail = process.env.EMAIL_FROM || process.env.EMAIL_USER || 'e0548451274@gmail.com';
    
    const htmlContent = `
      <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">שלום ${userName},</h2>
        <p>תודה על פנייתך. קיבלנו את הודעתך ונחזור אליך בהקדם האפשרי.</p>
        <p>ברכות,<br>צוות ועד מבקשי ה\'</p>
      </div>
    `;

    // Use Resend if available
    const resend = getResendClient();
    if (resend) {
      await resend.emails.send({
        from: fromEmail,
        to: userEmail,
        subject: 'תודה על פנייתך - ועד מבקשי ה\'',
        html: htmlContent,
      });
      return true;
    }

    // Fallback to nodemailer
    const transporter = createTransporter();
    if (transporter) {
      await transporter.sendMail({
        from: fromEmail,
        to: userEmail,
        subject: 'תודה על פנייתך - ועד מבקשי ה\'',
        html: htmlContent,
      });
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error sending confirmation email to user:', error);
    return false;
  }
};

// Send verification code email
export const sendVerificationEmail = async (email, code) => {
  if (!isEmailEnabled()) {
    console.log('Email not configured - verification code:', code);
    console.log('⚠️  WARNING: Email verification is not configured. Code is:', code);
    return false;
  }

  try {
    const fromEmail = process.env.EMAIL_FROM || process.env.EMAIL_USER || 'e0548451274@gmail.com';
    
    const htmlContent = `
      <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">קוד אימות</h2>
        <p>שלום,</p>
        <p>קוד האימות שלך הוא:</p>
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; text-align: center; margin: 20px 0;">
          <h1 style="color: #333; font-size: 32px; letter-spacing: 5px;">${code}</h1>
        </div>
        <p>קוד זה תקף ל-10 דקות.</p>
        <p>אם לא ביקשת קוד זה, אנא התעלם מהודעה זו.</p>
      </div>
    `;

    // Use Resend if available
    const resend = getResendClient();
    if (resend) {
      await resend.emails.send({
        from: fromEmail,
        to: email,
        subject: 'קוד אימות - ועד מבקשי ה\'',
        html: htmlContent,
      });
      return true;
    }

    // Fallback to nodemailer
    const transporter = createTransporter();
    if (transporter) {
      await transporter.sendMail({
        from: fromEmail,
        to: email,
        subject: 'קוד אימות - ועד מבקשי ה\'',
        html: htmlContent,
      });
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error sending verification email:', error);
    return false;
  }
};

// Send password reset code email
export const sendPasswordResetEmail = async (email, code) => {
  if (!isEmailEnabled()) {
    console.log('Email not configured - reset code:', code);
    console.log('⚠️  WARNING: Email reset is not configured. Code is:', code);
    return false;
  }

  try {
    const fromEmail = process.env.EMAIL_FROM || process.env.EMAIL_USER || 'e0548451274@gmail.com';
    
    const htmlContent = `
      <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">איפוס סיסמה</h2>
        <p>שלום,</p>
        <p>ביקשת לאפס את הסיסמה שלך. קוד האימות שלך הוא:</p>
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; text-align: center; margin: 20px 0;">
          <h1 style="color: #333; font-size: 32px; letter-spacing: 5px;">${code}</h1>
        </div>
        <p>קוד זה תקף ל-10 דקות.</p>
        <p>אם לא ביקשת לאפס את הסיסמה, אנא התעלם מהודעה זו.</p>
      </div>
    `;

    // Use Resend if available
    const resend = getResendClient();
    if (resend) {
      await resend.emails.send({
        from: fromEmail,
        to: email,
        subject: 'איפוס סיסמה - ועד מבקשי ה\'',
        html: htmlContent,
      });
      return true;
    }

    // Fallback to nodemailer
    const transporter = createTransporter();
    if (transporter) {
      await transporter.sendMail({
        from: fromEmail,
        to: email,
        subject: 'איפוס סיסמה - ועד מבקשי ה\'',
        html: htmlContent,
      });
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return false;
  }
};
