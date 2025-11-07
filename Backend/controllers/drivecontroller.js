const driveService = require("../services/driveservices");
const Drive = require("../models/Drivemodel");

exports.createDrive = async (req, res) => {
    try {
        const drive = await driveService.createDrive(req.body);
        res.status(201).json(drive);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.editDrive = async (req, res) => {
    try {
        const drive = await Drive.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(drive);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteDrive = async (req, res) => {
    try {
        await driveService.deleteDrive(req.params.id);
        res.json({ message: "Drive deleted" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getAllDrives = async (req, res) => {
    try {
        const drives = await Drive.find();
        res.json(drives);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getActiveDrives = async (req, res) => {
    try {
        const drives = await Drive.find({ completed: false });
        res.json(drives);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updateOfferMoney = async (req, res) => {
    try {
        const drive = await driveService.updateOfferMoney(req.params.id, req.body.offerMoney);
        res.json(drive);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.addStudentToRound = async (req, res) => {
    try {
        const drive = await driveService.addStudentToRound(req.params.id, req.body.round, req.body.usn);
        res.json(drive);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.removeStudentFromRound = async (req, res) => {
    try {
        const drive = await driveService.removeStudentFromRound(req.params.id, req.body.round, req.body.usn);
        res.json(drive);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getDrive = async (req, res) => {
    try {
        const drive = await driveService.getDrive(req.params.id);
        res.json(drive);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};