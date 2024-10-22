const FormData = require("form-data");
const Mailgun = require("mailgun.js");

const mailgun = new Mailgun(FormData);
const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY,
  url: process.env.MAILGUN_URL || "https://api.mailgun.net",
});

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendConfirmationEmail = async (email, userId) => {
  const otp = generateOTP();

  const messageData = {
    from: `Wheels of Time <noreply@${process.env.MAILGUN_SENDING_DOMAIN}>`,
    to: email,
    subject: "Confirm Your Wheels of Time Email",
    html: `
      <h1>Welcome to Wheels of Time!</h1>
      <p>Your email verification code is: <strong>${otp}</strong></p>
      <p>This code will expire in 15 minutes.</p>
    `,
  };

  try {
    const result = await mg.messages.create(
      process.env.MAILGUN_DOMAIN,
      messageData
    );
    console.log("Confirmation email sent successfully:", result);
    return { otp, userId }; // Return the OTP and userId for saving in the database
  } catch (error) {
    console.error("Error sending confirmation email:", error);
    throw error;
  }
};

module.exports = {
  sendConfirmationEmail,
};
