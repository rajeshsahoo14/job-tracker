const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false, // false for port 587, true for 465
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: {
        rejectUnauthorized: false // Add this for development
      }
    });

    // Verify transporter configuration
    await transporter.verify();
    console.log('📧 Email server is ready');

    // Email options
    const mailOptions = {
      from: `"Job Tracker" <${process.env.EMAIL_FROM}>`, // Professional format
      to: options.email,
      subject: options.subject,
      html: options.html
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.messageId);
    console.log('📨 Sent to:', options.email);
    return true;
  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
    console.error('Full error:', error);
    return false;
  }
};

module.exports = sendEmail;