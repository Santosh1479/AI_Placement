const express = require("express");
const router = express.Router();
const placeofficeController = require("../controllers/Placeofficecontroller");
const { protect } = require("../middleware/authMiddleware");

// Create a drive
router.post("/drive", protect, placeofficeController.createDrive);

// Delete a drive
router.delete("/drive/:id", protect, placeofficeController.deleteDrive);

// Add selected student
router.post("/drive/:driveId/selected", protect, placeofficeController.addSelectedStudent);

// Add rejected student
router.post("/drive/:driveId/rejected", protect, placeofficeController.addRejectedStudent);

// Send email
router.post("/email", protect, placeofficeController.sendEmail);

// Send offer letter
router.post("/offerletter", protect, placeofficeController.sendOfferLetter);

module.exports = router;