const express = require("express");
const router = express.Router();
const placeofficeController = require("../controllers/Placeofficecontroller");
const { protect } = require("../middleware/authMiddleware");

// Create a drive
router.post("/drive", placeofficeController.createDrive);

// Delete a drive
router.delete("/drive/:id", placeofficeController.deleteDrive);

// Add selected student
router.post("/drive/:driveId/selected", placeofficeController.addSelectedStudent);

// Add rejected student
router.post("/drive/:driveId/rejected", placeofficeController.addRejectedStudent);

// Send email
router.post("/email",placeofficeController.sendEmail);

// Send offer letter
router.post("/offerletter",  placeofficeController.sendOfferLetter);

module.exports = router;