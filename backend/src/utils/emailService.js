const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // 1. Transporter Create Karein (Email Service Provider settings)
  // (Abhi hum testing ke liye standard settings use kar rahe hain)
  const transporter = nodemailer.createTransport({
    service: "gmail", // Ya koi bhi service (SendGrid, Mailgun etc.)
    auth: {
      user: process.env.EMAIL_USER, // .env file se aayega
      pass: process.env.EMAIL_PASS, // .env file se aayega
    },
  });

  // 2. Email Details Set Karein
  const mailOptions = {
    from: `"WatchStore Admin" <${process.env.EMAIL_USER}>`, // Bhejne wala
    to: options.email, // Jisko bhejna hai
    subject: options.subject, // Subject line
    text: options.message, // Email ka content (Password yahan hoga)
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Welcome to WatchStore! ⌚</h2>
        <p>Your account has been approved by the Super Admin.</p>
        <p><strong>Login Details:</strong></p>
        <ul>
            <li>Email: ${options.email}</li>
            <li>Temporary Password: <b>${options.message}</b></li>
        </ul>
        <p>Please login and change your password immediately.</p>
      </div>
    `, 
  };

  // 3. Email Bhejein
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
