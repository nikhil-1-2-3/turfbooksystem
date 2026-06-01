const express = require("express")
const router = express.Router()
const contactController=require("../controllers/contactUs");

router.post("/contactUs", contactController.contactUs);

module.exports = router;