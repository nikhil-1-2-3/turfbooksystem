// Import the required modules
const express = require("express");
const router = express.Router()

// Import the Controllers

// Turf Controllers Import
const turfControllers = require("../controllers/Turf");

// Searched controllers
const serachControllers = require("../controllers/SearchQuery");
// Rating Controllers Import
const reviewControllers = require("../controllers/RatingAndReview");

// Importing Middlewares
const { auth, isOwner, isUser, isAdmin } = require("../middlewares/auth")

// ********************************************************************************************************
//                                      Turf routes
// ********************************************************************************************************

// turfs can Only be Created by Instructors
router.post("/createTurf", auth, isOwner, turfControllers.createTurf);


// Get all Registered Turf
// router.get("/getAllTurfs",turfControllers.getAllTurfs);

// Edit a turf
router.post("/editTurf", auth, isOwner,turfControllers.editTurf);

// getfullTurfDetails
router.post("/fullturfdetails",turfControllers.getFullTurfDetails);

// add price time
router.post("/addpricetime",auth,isOwner,turfControllers.addPriceTime);

// edit price time
router.post("/editpricetime",auth,isOwner,turfControllers.editPriceTime);

//Get full course details
// router.post("/getFullTurfsDetails", auth)
// Delete a Course
router.delete("/deleteTurf",auth,isOwner, turfControllers.deleteTurf);
// Search Turf
router.post("/searchTurf", serachControllers.searchTurf);

// fetch cities
router.get("/fetchcities",serachControllers.fetchCities);

// fetch specific city turfs
router.post("/specificCityTurfs",serachControllers.searchSpecificCityTurfs);

// get owner turf details
router.get("/getownerturfdetails",auth,turfControllers.getOwnerTurf);

// search turf
router.post("/searchTurf",serachControllers.searchTurf);

// ********************************************************************************************************
//                                      Rating and Review
// ********************************************************************************************************
router.post("/createRating", auth, isUser, reviewControllers.createRating)
router.get("/getReviews", reviewControllers.getAllRating);

module.exports = router;