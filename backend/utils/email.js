const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  try {
    // Create transporter with port 465 (SSL)
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT), // Parse to integer
      secure: true, // true for port 465
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: {
        rejectUnauthorized: false
      },
      // Add these for better connection handling
      connectionTimeout: 10000, // 10 seconds
      greetingTimeout: 10000,
      socketTimeout: 10000
    });

    // Verify connection
    console.log('📧 Verifying email connection...');
    await transporter.verify();
    console.log('✅ Email server connection verified');

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: options.email,
      subject: options.subject,
      html: options.html
    };

    // Send email
    console.log('📧 Sending email to:', options.email);
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully!');
    console.log('📧 Message ID:', info.messageId);
    console.log('📧 Recipient:', options.email);
    return true;
  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
    console.error('Error code:', error.code);
    console.error('Full error:', error);
    return false;
  }
};

module.exports = sendEmail;