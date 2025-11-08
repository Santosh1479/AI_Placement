// filepath: d:\AI_Placement\Backend\utils\emailService.js
const nodemailer = require("nodemailer");
const { generateEmail } = require("./geminiService"); 
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

exports.sendEmail = async (to, subject, text, html, eventType, data) => {
  try {
    // console.log("[emailService] Preparing to send email:", { to, subject });

    // Use geminiService to enhance or generate the email content
    console.log("[emailService] Enhancing email content using geminiService...");
    const enhancedEmail = await generateEmail(eventType, data);

    // Assuming the response from geminiService contains the subject and HTML body
    const { subject: enhancedSubject, html: enhancedHtml } = JSON.parse(enhancedEmail);

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject: enhancedSubject || subject, // Use enhanced subject if available
      text, // Plain text fallback
      html: enhancedHtml || html // Use enhanced HTML if available
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