// filepath: d:\AI_Placement\Backend\utils\emailService.js
const nodemailer = require("nodemailer");
require("dotenv").config();

console.log("[emailService] Initializing with config:", {
  user: process.env.EMAIL_USER ? "SET" : "NOT SET",
  pass: process.env.EMAIL_PASSWORD ? "SET" : "NOT SET"
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  },
  debug: true // Enable debug logs
});

exports.sendEmail = async (to, subject, text, html) => {
  try {
    // console.log("[emailService] Attempting to send email:", { to, subject });
    
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html
    });

    console.log("[emailService] Email sent successfully:", {
      messageId: info.messageId,
      to: to
    });

    return info;
  } catch (error) {
    console.error("[emailService] Failed to send email:", error);
    throw error;
  }
};