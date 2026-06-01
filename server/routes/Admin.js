const express = require("express");
const router = express.Router();
const adminController = require("../controllers/Admin");
const { auth, isAdmin } = require("../middlewares/auth");

router.get("/getAllUsers", auth, isAdmin, adminController.getAllUsers);
router.get("/getAllBookings", auth, isAdmin, adminController.getAllBookings);
router.delete("/deleteUser", auth, isAdmin, adminController.deleteUser);
router.put("/allotBooking", auth, isAdmin, adminController.allotBooking);
router.put("/approveCancellation", auth, isAdmin, adminController.approveCancellation);

module.exports = router;
