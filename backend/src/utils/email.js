const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendConfirmationEmail = async (application) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: application.email,
    subject: 'Application Received - CreativeSocially',
    html: `
      <h1>Thank you for your application!</h1>
      <p>Dear ${application.name},</p>
      <p>We have received your application to become a model at CreativeSocially. Our team will review your application and get back to you soon.</p>
      <p>Application Details:</p>
      <ul>
        <li>Name: ${application.name}</li>
        <li>Email: ${application.email}</li>
        <li>Phone: ${application.phone}</li>
        <li>Age: ${application.age}</li>
      </ul>
      <p>Best regards,<br>CreativeSocially Team</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Confirmation email sent successfully');
  } catch (error) {
    console.error('Error sending confirmation email:', error);
  }
};

const sendAdminNotification = async (application) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'info@creativesocially.com',
    subject: 'New Model Application Received',
    html: `
      <h1>New Model Application</h1>
      <p>A new application has been received:</p>
      <ul>
        <li>Name: ${application.name}</li>
        <li>Email: ${application.email}</li>
        <li>Phone: ${application.phone}</li>
        <li>Age: ${application.age}</li>
        <li>Experience: ${application.experience || 'Not provided'}</li>
        <li>Message: ${application.message || 'Not provided'}</li>
      </ul>
      <p>Please review this application in the admin dashboard.</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Admin notification sent successfully');
  } catch (error) {
    console.error('Error sending admin notification:', error);
  }
};

module.exports = {
  sendConfirmationEmail,
  sendAdminNotification
}; 