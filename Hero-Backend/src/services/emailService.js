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
    from: `Our Hero At 70<noreply@${process.env.MAILGUN_SENDING_DOMAIN}>`,
    to: email,
    subject: "Your Login OTP for #OurHeroAt70 🎉",
    html: `
<div class="container">
    <h1>Your Login OTP for #OurHeroAt70 🎉</h1>
    <p>
      Thank you for joining us in celebrating this special milestone of Dr.
      Pawan Munjal's 70th birthday! 🎂
    </p>
    <p>Here's your login OTP: <strong>${otp}</strong></p>
    <p>Use it to access the site and be part of this story.</p>
    <div class="footer">
      <p>#OurHeroAt70</p>
    </div>
  </div> `,
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
