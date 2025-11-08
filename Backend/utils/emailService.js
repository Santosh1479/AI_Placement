// filepath: d:\AI_Placement\Backend\utils\emailService.js
const nodemailer = require("nodemailer");
const { generateEmail } = require("./geminiService");
require("dotenv").config();

console.log("[emailService] Initializing with config:", {
  user: process.env.EMAIL_USER ? "SET" : "NOT SET",
  pass: process.env.EMAIL_PASSWORD ? "SET" : "NOT SET",
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  debug: true, // Enable debug logs
});

exports.sendEmail = async (to, subject, text, html, eventType, data) => {
  try {
    console.log("[emailService] Enhancing email content using geminiService...");
    const enhancedEmail = await generateEmail(eventType, data);

    // Use the subject and HTML body from the enhanced email
    const enhancedSubject = enhancedEmail.subject || subject;
    const enhancedHtml = enhancedEmail.html || html;

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject: enhancedSubject,
      text, // Plain text fallback
      html: enhancedHtml,
    });

    console.log("[emailService] Email sent successfully:", {
      messageId: info.messageId,
      to: to,
    });

    return info;
  } catch (error) {
    console.error("[emailService] Failed to send email:", error);
    throw error;
  }
};