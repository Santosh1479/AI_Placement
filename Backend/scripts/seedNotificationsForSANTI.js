const mongoose = require("mongoose");
require("dotenv").config();
const Notification = require("../models/Notifications");

async function run() {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/placement";
    await mongoose.connect(mongoUri);

    const now = Date.now();
    const seed = [
      {
        usn: "1AI23CS140",
        title: "Welcome to Placement Portal",
        message: "Your profile is created. Update your resume and apply to drives.",
        type: "other",
        read: false,
        createdAt: new Date(now - 1000 * 60 * 60 * 24 * 7) // 7 days ago
      },
      {
        usn: "1AI23CS140",
        title: "New Drive Posted: Google",
        message: "Google drive is open. Minimum CGPA 8.0. Apply before deadline.",
        type: "drive",
        read: false,
        driveId: new mongoose.Types.ObjectId(),
        createdAt: new Date(now - 1000 * 60 * 60 * 24 * 5) // 5 days ago
      },
      {
        usn: "1AI23CS140",
        title: "Google - Aptitude Result",
        message: "Congratulations — you cleared the Aptitude round for Google. Proceed to Group Discussion.",
        type: "result",
        round: "aptitude",
        read: false,
        driveId: new mongoose.Types.ObjectId(),
        createdAt: new Date(now - 1000 * 60 * 60 * 24 * 3) // 3 days ago
      },
      {
        usn: "1AI23CS140",
        title: "Google - Group Discussion Result",
        message: "Good job — you cleared the Group Discussion. Next: Technical Interview.",
        type: "result",
        round: "gd",
        read: false,
        driveId: new mongoose.Types.ObjectId(),
        createdAt: new Date(now - 1000 * 60 * 60 * 24 * 2) // 2 days ago
      },
      {
        usn: "1AI23CS140",
        title: "Google - Technical Interview Result",
        message: "We regret to inform you that you were rejected in the Technical Interview round.",
        type: "result",
        round: "interview",
        read: false,
        driveId: new mongoose.Types.ObjectId(),
        createdAt: new Date(now - 1000 * 60 * 60 * 24 * 1) // 1 day ago
      },
      {
        usn: "1AI23CS140",
        title: "Offer Letter: Infosys",
        message: "Congratulations! You have been selected by Infosys. Offer details were emailed to you.",
        type: "result",
        round: "selected",
        read: false,
        driveId: new mongoose.Types.ObjectId(),
        createdAt: new Date(now - 1000 * 60 * 60 * 6) // 6 hours ago
      }
    ];

    const inserted = await Notification.insertMany(seed);
    console.log(`Inserted ${inserted.length} notifications for 1AI23CS140`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
}

run();