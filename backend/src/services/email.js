import { sendEmail } from './emailService.js';

// Get admin email from environment or use default
const getAdminEmail = () => {
  return process.env.ADMIN_EMAIL || process.env.EMAIL_FROM || 'admin@vaad.org';
};

// Send contact email to admin
export const sendContactEmailToAdmin = async ({ name, email, content }) => {
  try {
    const adminEmail = getAdminEmail();
    
    const html = `
      <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #d4af37;">הודעה חדשה מאתר ועד מבקשי ה'</h2>
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>שם:</strong> ${name}</p>
          <p><strong>אימייל:</strong> ${email}</p>
          <p><strong>תוכן ההודעה:</strong></p>
          <div style="background-color: white; padding: 15px; border-radius: 4px; margin-top: 10px;">
            ${content.replace(/\n/g, '<br>')}
          </div>
        </div>
        <p style="color: #666; font-size: 14px;">
          ניתן להגיב דרך מערכת הניהול באתר.
        </p>
      </div>
    `;

    const result = await sendEmail({
      to: adminEmail,
      subject: `הודעה חדשה מאתר - ${name}`,
      html,
    });

    return result?.success || false;
  } catch (error) {
    console.error('Error sending contact email to admin:', error);
    return false;
  }
};

// Send confirmation email to user
export const sendContactConfirmationToUser = async (userEmail, userName) => {
  try {
    const html = `
      <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #d4af37;">תודה על פנייתך!</h2>
        <p>שלום ${userName},</p>
        <p>קיבלנו את הודעתך ונחזור אליך בהקדם האפשרי.</p>
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #666;">
            <strong>ועד מבקשי ה'</strong><br>
            נשמח לעמוד לרשותך בכל שאלה או בקשה.
          </p>
        </div>
        <p style="color: #666; font-size: 14px; margin-top: 20px;">
          זהו אימייל אוטומטי, אנא אל תשיב למייל זה.
        </p>
      </div>
    `;

    const result = await sendEmail({
      to: userEmail,
      subject: 'תודה על פנייתך - ועד מבקשי ה\'',
      html,
    });

    return result?.success || false;
  } catch (error) {
    console.error('Error sending confirmation email to user:', error);
    return false;
  }
};

// Send reply email to user
export const sendReplyToUser = async (userEmail, userName, subject, content) => {
  try {
    const html = `
      <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #d4af37;">תגובה מהודעה שלך</h2>
        <p>שלום ${userName},</p>
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          ${content}
        </div>
        <p style="color: #666; font-size: 14px; margin-top: 20px;">
          בברכה,<br>
          <strong>ועד מבקשי ה'</strong>
        </p>
      </div>
    `;

    const result = await sendEmail({
      to: userEmail,
      subject: subject || 'תגובה מהודעה שלך - ועד מבקשי ה\'',
      html,
    });

    return result?.success || false;
  } catch (error) {
    console.error('Error sending reply email to user:', error);
    return false;
  }
};

// Send verification email
export const sendVerificationEmail = async (userEmail, verificationCode) => {
  try {
    const html = `
      <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #d4af37;">אימות אימייל - ועד מבקשי ה'</h2>
        <p>שלום,</p>
        <p>תודה שנרשמת למערכת הניהול של ועד מבקשי ה'.</p>
        <p>קוד האימות שלך הוא:</p>
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
          <h1 style="color: #d4af37; font-size: 32px; margin: 0; letter-spacing: 5px;">${verificationCode}</h1>
        </div>
        <p style="color: #666; font-size: 14px;">
          הקוד תקף ל-10 דקות בלבד.
        </p>
        <p style="color: #666; font-size: 14px; margin-top: 20px;">
          אם לא ביקשת קוד זה, אנא התעלם מהאימייל.
        </p>
      </div>
    `;

    const result = await sendEmail({
      to: userEmail,
      subject: 'קוד אימות - ועד מבקשי ה\'',
      html,
    });

    return result?.success || false;
  } catch (error) {
    console.error('Error sending verification email:', error);
    return false;
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (userEmail, resetCode) => {
  try {
    const html = `
      <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #d4af37;">איפוס סיסמה - ועד מבקשי ה'</h2>
        <p>שלום,</p>
        <p>קיבלנו בקשה לאיפוס הסיסמה שלך.</p>
        <p>קוד האיפוס שלך הוא:</p>
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
          <h1 style="color: #d4af37; font-size: 32px; margin: 0; letter-spacing: 5px;">${resetCode}</h1>
        </div>
        <p style="color: #666; font-size: 14px;">
          הקוד תקף ל-10 דקות בלבד.
        </p>
        <p style="color: #666; font-size: 14px; margin-top: 20px;">
          אם לא ביקשת איפוס סיסמה, אנא התעלם מהאימייל והסיסמה שלך תישאר ללא שינוי.
        </p>
      </div>
    `;

    const result = await sendEmail({
      to: userEmail,
      subject: 'איפוס סיסמה - ועד מבקשי ה\'',
      html,
    });

    return result?.success || false;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return false;
  }
};
