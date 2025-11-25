const sgMail = require('@sendgrid/mail');

const sendEmail = async (options) => {
  try {
    // Set API key
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
      to: options.email,
      from: process.env.EMAIL_FROM, // Must be verified in SendGrid
      subject: options.subject,
      html: options.html,
    };

    console.log('📧 Sending email via SendGrid...');
    console.log('📧 To:', options.email);
    console.log('📧 From:', process.env.EMAIL_FROM);
    
    const response = await sgMail.send(msg);
    
    console.log('✅ Email sent successfully via SendGrid!');
    console.log('📧 Status:', response[0].statusCode);
    console.log('📧 Message ID:', response[0].headers['x-message-id']);
    
    return true;
  } catch (error) {
    console.error('❌ SendGrid email failed:', error.message);
    
    if (error.response) {
      console.error('SendGrid error details:', error.response.body);
      console.error('Error code:', error.code);
    }
    
    return false;
  }
};

module.exports = sendEmail;