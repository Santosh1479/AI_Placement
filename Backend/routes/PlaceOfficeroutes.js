const express = require("express");
const router = express.Router();
const placeofficeController = require("../controllers/Placeofficecontroller");
const { protect, authPlaceOfficer } = require("../middleware/authMiddleware");

// Create a drive
router.post("/drive",authPlaceOfficer, placeofficeController.createDrive);

// Delete a drive
router.delete("/drive/:id",authPlaceOfficer, placeofficeController.deleteDrive);

// Add selected student
router.post("/drive/:driveId/selected",authPlaceOfficer, placeofficeController.addSelectedStudent);

// Add rejected student
router.post("/drive/:driveId/rejected",authPlaceOfficer, placeofficeController.addRejectedStudent);

// Send email
router.post("/email",authPlaceOfficer, placeofficeController.sendEmail);

// Send offer letter
router.post("/offerletter",authPlaceOfficer, placeofficeController.sendOfferLetter);

router.post("/register", placeofficeController.register);

router.post("/login", placeofficeController.login);

module.exports = router;