const Drive = require("../models/Drivemodel");
const nodemailer = require("nodemailer");

exports.createDrive = async (data) => {
    const drive = new Drive(data);
    return await drive.save();
};

exports.deleteDrive = async (id) => {
    return await Drive.findByIdAndDelete(id);
};

exports.addSelectedStudent = async (driveId, usn) => {
    return await Drive.findByIdAndUpdate(
        driveId,
        { $addToSet: { "rounds.appointed": usn } },
        { new: true }
    );
};

exports.addRejectedStudent = async (driveId, usn) => {
    return await Drive.findByIdAndUpdate(
        driveId,
        { $addToSet: { "rounds.rejected": usn } },
        { new: true }
    );
};

exports.sendEmail = async (to, subject, text) => {
    // Configure your SMTP transporter
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
    };

    return await transporter.sendMail(mailOptions);
};

exports.sendOfferLetter = async (to, offerDetails) => {
    const subject = "Offer Letter";
    const text = `Congratulations! You have been selected.\n\nDetails:\n${offerDetails}`;
    return await exports.sendEmail(to, subject, text);
};