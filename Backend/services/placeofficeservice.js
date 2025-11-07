const Drive = require("../models/Drivemodel");
const nodemailer = require("nodemailer");
const PlacementOfficer = require("../models/PlaceOfficer");

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

exports.register = async (data) => {
  // Validate required fields
  if (!data.name || !data.email || !data.password) {
    throw new Error("All fields (name, email, password) are required");
  }

  // Hash the password
  data.password = await PlacementOfficer.hashPassword(data.password);

  // Create and save the Placement Officer
  const officer = new PlacementOfficer({
    name: data.name,
    email: data.email,
    password: data.password,
  });

  return await officer.save();
};

exports.login = async (email, password) => {
  // Find the Placement Officer by email and include the password field
  const officer = await PlacementOfficer.findOne({ email }).select("+password");
  if (!officer) throw new Error("Invalid credentials");

  // Compare the provided password with the hashed password
  const isMatch = await officer.comparePassword(password);
  if (!isMatch) throw new Error("Invalid credentials");

  return officer; // Return the Placement Officer object
};