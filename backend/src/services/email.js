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
      const accountEmail = process.env.ADMIN_EMAIL || process.env.RESEND_ACCOUNT_EMAIL || 'r0533160762@gmail.com';
      
      try {
        const result = await resend.emails.send({
          from: fromEmail,
          to: adminEmail,
          subject: `הודעה חדשה מאתר - ${messageData.name}`,
          html: htmlContent,
        });
        
        // If error about verified domain, send to account email
        if (result.error && (result.error.message?.includes('own email address') || result.error.message?.includes('verified domain'))) {
          console.log(`⚠️  Cannot send to ${adminEmail}. Sending to account email ${accountEmail} instead...`);
          await resend.emails.send({
            from: fromEmail,
            to: accountEmail,
            subject: `הודעה חדשה מאתר - ${messageData.name}`,
            html: htmlContent,
          });
          console.log(`✅ Contact email sent to account email: ${accountEmail}`);
          return true;
        }
        
        if (result.error) {
          throw new Error(result.error.message || 'Resend API error');
        }
        
        return true;
      } catch (error) {
        console.error('Error sending email to admin:', error);
        return false;
      }
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
      const accountEmail = process.env.ADMIN_EMAIL || process.env.RESEND_ACCOUNT_EMAIL || 'r0533160762@gmail.com';
      
      try {
        const result = await resend.emails.send({
          from: fromEmail,
          to: userEmail,
          subject: 'תודה על פנייתך - ועד מבקשי ה\'',
          html: htmlContent,
        });
        
        // If error about verified domain, send to account email (but log that it's for the user)
        if (result.error && (result.error.message?.includes('own email address') || result.error.message?.includes('verified domain'))) {
          console.log(`⚠️  Cannot send confirmation to ${userEmail}. Email would be sent to account email ${accountEmail} if needed.`);
          // For confirmation emails, we'll just skip if we can't send to the user
          return false;
        }
        
        if (result.error) {
          throw new Error(result.error.message || 'Resend API error');
        }
        
        return true;
      } catch (error) {
        console.error('Error sending confirmation email to user:', error);
        return false;
      }
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
      const accountEmail = process.env.ADMIN_EMAIL || process.env.RESEND_ACCOUNT_EMAIL || 'r0533160762@gmail.com';
      
      try {
        const result = await resend.emails.send({
          from: fromEmail,
          to: email,
          subject: 'קוד אימות - ועד מבקשי ה\'',
          html: htmlContent,
        });
        
        // If error about verified domain, send to account email
        if (result.error && (result.error.message?.includes('own email address') || result.error.message?.includes('verified domain'))) {
          console.log(`⚠️  Cannot send to ${email}. Sending to account email ${accountEmail} instead...`);
          
          const htmlWithInfo = htmlContent.replace(
            '<h2 style="color: #333;">קוד אימות</h2>',
            `<h2 style="color: #333;">קוד אימות</h2>
            <p style="background-color: #fff3cd; padding: 10px; border-radius: 5px; margin: 10px 0;">
              <strong>מייל מקורי:</strong> ${email}
            </p>`
          );
          
          await resend.emails.send({
            from: fromEmail,
            to: accountEmail,
            subject: `קוד אימות - ${email}`,
            html: htmlWithInfo,
          });
          console.log(`✅ Verification code sent to account email: ${accountEmail}`);
          return true;
        }
        
        if (result.error) {
          throw new Error(result.error.message || 'Resend API error');
        }
        
        return true;
      } catch (error) {
        console.error('Error sending verification email:', error);
        return false;
      }
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
    console.log('⚠️  Email not configured - reset code:', code);
    console.log('⚠️  WARNING: Email reset is not configured. Code is:', code);
    console.log('⚠️  Please check your RESEND_API_KEY or EMAIL_USER/EMAIL_PASSWORD in .env');
    return false;
  }

  try {
    // For Resend, we need to use the account email or verified domain
    // Try account email first, then fallback to configured EMAIL_FROM
    const resendFromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
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
      // Resend allows sending to account email without domain verification
      // Use ADMIN_EMAIL or RESEND_ACCOUNT_EMAIL as fallback recipient
      const accountEmail = process.env.ADMIN_EMAIL || process.env.RESEND_ACCOUNT_EMAIL || 'r0533160762@gmail.com';
      const targetEmail = email;
      
      console.log(`📧 Sending password reset email to ${targetEmail} via Resend...`);
      console.log(`📧 From: ${resendFromEmail}`);
      
      try {
        // Try sending to the requested email first
        const result = await resend.emails.send({
          from: resendFromEmail,
          to: targetEmail,
          subject: 'איפוס סיסמה - ועד מבקשי ה\'',
          html: htmlContent,
        });
        
        // Check if there's an error in the response
        if (result.error) {
          console.error('❌ Resend returned error:', result.error);
          
          // If it's a validation error about email address, send to account email instead
          if (result.error.message?.includes('own email address') || result.error.message?.includes('verified domain')) {
            console.log(`⚠️  Cannot send to ${targetEmail}. Sending to account email ${accountEmail} instead...`);
            
            // Update HTML to include the original email address
            const htmlWithInfo = htmlContent.replace(
              '<h2 style="color: #333;">איפוס סיסמה</h2>',
              `<h2 style="color: #333;">איפוס סיסמה</h2>
              <p style="background-color: #fff3cd; padding: 10px; border-radius: 5px; margin: 10px 0;">
                <strong>מייל מקורי:</strong> ${targetEmail}
              </p>`
            );
            
            // Send to account email
            const accountResult = await resend.emails.send({
              from: resendFromEmail,
              to: accountEmail,
              subject: `איפוס סיסמה - ${targetEmail}`,
              html: htmlWithInfo,
            });
            
            if (accountResult.error) {
              console.error('❌ Failed to send to account email too:', accountResult.error);
              return false;
            }
            
            console.log('✅ Password reset email sent to account email:', accountEmail);
            console.log('📧 Email ID:', accountResult.data?.id || accountResult.id);
            console.log(`📧 Original request was for: ${targetEmail}`);
            return true;
          }
          
          throw new Error(result.error.message || 'Resend API error');
        }
        
        console.log('✅ Password reset email sent successfully via Resend');
        console.log('📧 Email ID:', result.data?.id || result.id);
        return true;
      } catch (resendError) {
        console.error('❌ Resend error:', resendError.message || resendError);
        // Don't throw - fallback to showing code in console for development
        return false;
      }
    }

    // Fallback to nodemailer
    const transporter = createTransporter();
    if (transporter) {
      console.log(`📧 Sending password reset email to ${email} via Nodemailer...`);
      const result = await transporter.sendMail({
        from: fromEmail,
        to: email,
        subject: 'איפוס סיסמה - ועד מבקשי ה\'',
        html: htmlContent,
      });
      console.log('✅ Password reset email sent successfully via Nodemailer:', result.messageId);
      return true;
    }

    console.error('❌ No email service available');
    return false;
  } catch (error) {
    console.error('❌ Error sending password reset email:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      response: error.response?.data,
    });
    return false;
  }
};
