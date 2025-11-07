const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    usn: {
        type: String,
        required: true,
        ref: "Student" // Reference to Student model
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    read: {
        type: Boolean,
        default: false // Track if notification has been read
    },
    type: {
        type: String,
        enum: ["drive", "approval", "result", "other"],
        default: "other"
    },
    round: {
        type: String,
        enum: ["aptitude", "gd", "interview", "selected", "rejected"],
        required: function() {
            return this.type === "result";
        }
    },
    driveId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Drive",
        required: function() {
            return this.type === "drive" || this.type === "result";
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create index for faster queries on USN and read status
notificationSchema.index({ usn: 1, read: 1 });
notificationSchema.index({ driveId: 1, type: 1 }); // Add index for drive-related queries

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;