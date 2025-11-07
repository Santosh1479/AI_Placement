const Drive = require("../models/Drivemodel");

exports.createDrive = async (data) => {
    const drive = new Drive(data);
    return await drive.save();
};

exports.editDrive = async (id, data) => {
    return await Drive.findByIdAndUpdate(id, data, { new: true });
};

exports.deleteDrive = async (id) => {
    return await Drive.findByIdAndDelete(id);
};

exports.updateOfferMoney = async (id, offerMoney) => {
    return await Drive.findByIdAndUpdate(id, { offerMoney }, { new: true });
};

exports.addStudentToRound = async (id, round, usn) => {
    return await Drive.findByIdAndUpdate(
        id,
        { $addToSet: { [`rounds.${round}`]: usn } },
        { new: true }
    );
};

exports.removeStudentFromRound = async (id, round, usn) => {
    return await Drive.findByIdAndUpdate(
        id,
        { $pull: { [`rounds.${round}`]: usn } },
        { new: true }
    );
};

exports.getDrive = async (id) => {
    return await Drive.findById(id);
};