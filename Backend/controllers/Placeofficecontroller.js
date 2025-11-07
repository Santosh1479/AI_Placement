const placeofficeService = require("../services/placeofficeservice");
const PlacementOfficer = require("../models/PlaceOfficer");

exports.createDrive = async (req, res) => {
    try {
        const drive = await placeofficeService.createDrive(req.body);
        res.status(201).json(drive);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteDrive = async (req, res) => {
    try {
        await placeofficeService.deleteDrive(req.params.id);
        res.json({ message: "Drive deleted" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.addSelectedStudent = async (req, res) => {
    try {
        const drive = await placeofficeService.addSelectedStudent(req.params.driveId, req.body.usn);
        res.json(drive);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.addRejectedStudent = async (req, res) => {
    try {
        const drive = await placeofficeService.addRejectedStudent(req.params.driveId, req.body.usn);
        res.json(drive);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.sendEmail = async (req, res) => {
    try {
        await placeofficeService.sendEmail(req.body.to, req.body.subject, req.body.text);
        res.json({ message: "Email sent" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.sendOfferLetter = async (req, res) => {
    try {
        await placeofficeService.sendOfferLetter(req.body.to, req.body.offerDetails);
        res.json({ message: "Offer letter sent" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Call the register service
    const officer = await placeofficeService.register({ name, email, password });

    res.status(201).json({ message: "Placement Officer registered successfully", officer });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Call the login service
    const officer = await placeofficeService.login(email, password);

    // Generate a JWT token
    const token = officer.generateAuthToken();

    res.json({ message: "Login successful", token, role: "placeofficers" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};