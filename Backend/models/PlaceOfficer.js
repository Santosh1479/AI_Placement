const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const placementOfficerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    }
});

placementOfficerSchema.methods.generateAuthToken = function () {
    return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: "24h" });
};

placementOfficerSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

placementOfficerSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10);
};

const PlacementOfficer = mongoose.model("PlacementOfficer", placementOfficerSchema);
module.exports = PlacementOfficer;