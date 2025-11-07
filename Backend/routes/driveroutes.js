const express = require("express");
const router = express.Router();
const driveController = require("../controllers/drivecontroller");

// Create a drive
router.post("/", driveController.createDrive);

// Edit a drive
router.put("/:id", driveController.editDrive);

// Delete a drive
router.delete("/:id", driveController.deleteDrive);

// Update offer money
router.put("/:id/offer", driveController.updateOfferMoney);

// Add student to round
router.post("/:id/round/add", driveController.addStudentToRound);

// Remove student from round
router.post("/:id/round/remove", driveController.removeStudentFromRound);

// Get drive details
router.get("/:id", driveController.getDrive);

module.exports = router;