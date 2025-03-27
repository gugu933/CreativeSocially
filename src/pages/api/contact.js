import sgMail from '@sendgrid/mail';

// Initialize SendGrid with your API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false,
      message: 'Method not allowed' 
    });
  }

  try {
    const { firstName, phone, email, company, description } = req.body;

    // Validate required fields
    if (!firstName || !email || !company || !description) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Log the request (without sensitive data)
    console.log('Received contact form submission:', { firstName, email, company });

    const msg = {
      to: 'info@creativesocially.com',
      from: 'info@creativesocially.com',
      subject: `New Contact Request from ${firstName}`,
      text: `
        Name: ${firstName}
        Phone: ${phone}
        Email: ${email}
        Company: ${company}
        
        Description:
        ${description}
      `,
      html: `
        <h2>New Contact Request</h2>
        <p><strong>Name:</strong> ${firstName}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company:</strong> ${company}</p>
        <p><strong>Description:</strong></p>
        <p>${description}</p>
      `,
    };

    // Log the attempt to send email
    console.log('Attempting to send email...');
    
    await sgMail.send(msg);
    
    // Log success
    console.log('Email sent successfully');
    
    return res.status(200).json({ 
      success: true,
      message: 'Email sent successfully' 
    });
  } catch (error) {
    // Log detailed error information
    console.error('Error sending email:', {
      message: error.message,
      code: error.code,
      response: error.response?.body
    });
    
    return res.status(500).json({ 
      success: false,
      message: 'Error sending email', 
      error: error.message,
      details: error.response?.body
    });
  }
} 