const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const hodSchema = new mongoose.Schema({
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
    },
    department: {
        type: String,
        required: true,
    }
});

hodSchema.methods.generateAuthToken = function () {
    return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: "24h" });
};

hodSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

hodSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10);
};

const HOD = mongoose.model("HOD", hodSchema);
module.exports = HOD;