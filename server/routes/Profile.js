const express = require("express");
const router = express.Router();


const profileControllers = require("../controllers/Profile");
const {auth, isOwner} = require("../middlewares/auth");


// Router For Updating User
router.put("/updateProfile",auth,profileControllers.updateProfile);

//Router For Deleting User
router.delete("/deleteProfile",auth,profileControllers.deleteAccount);

// Router for Getting Buy Turf
router.get("/getBuyTurf",auth,profileControllers.getBuyTurf);

// Router For Updating Profile Picture
router.put("/updateDisplayPicture", auth, profileControllers.updateDisplayPicture);

// total earning
router.get("/getTotalEarning",auth,isOwner,profileControllers.TotalEarning);
module.exports=router;