const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Send application confirmation email
const sendApplicationConfirmation = async (email, firstName) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Application Received - CreativeSocially',
      html: `
        <h1>Thank you for your application, ${firstName}!</h1>
        <p>We have received your application to join CreativeSocially as a model.</p>
        <p>Our team will review your application and get back to you soon.</p>
        <p>Best regards,<br>The CreativeSocially Team</p>
      `
    });
  } catch (error) {
    console.error('Error sending application confirmation email:', error);
  }
};

// Send application status update email
const sendStatusUpdateEmail = async (email, firstName, status) => {
  try {
    const subject = status === 'approved' 
      ? 'Congratulations! Your Application is Approved'
      : 'Update on Your Application';

    const message = status === 'approved'
      ? `We are pleased to inform you that your application to join CreativeSocially has been approved.`
      : `We regret to inform you that we cannot proceed with your application at this time.`;

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject,
      html: `
        <h1>Hello ${firstName},</h1>
        <p>${message}</p>
        <p>Best regards,<br>The CreativeSocially Team</p>
      `
    });
  } catch (error) {
    console.error('Error sending status update email:', error);
  }
};

module.exports = {
  sendApplicationConfirmation,
  sendStatusUpdateEmail
}; 