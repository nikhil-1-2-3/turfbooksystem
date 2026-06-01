const reviewSchema = require("../models/RatingAndReview");
const turfSchema = require("../models/Turf");
const userSchema = require("../models/User");


module.exports.createRating = async (req,res)=>{
    try {
      const userId=req.user.id;
      const {rating, review,turfId} = req.body;
      const turfDetails= await turfSchema.find({_id: turfId,
        });

        const userDetails = await userSchema.find({_id:userId,history: {$elemMatch:{$eq:userId}}})
   
       if(!userDetails){
           return res.status(404).json({success:false,emessage: "User Not Booked This Turf"});
       };
       const alreadyReviewed =await reviewSchema.findOne({user:userId,
        turf:turfId});
   
       if(alreadyReviewed){
           return res.status(404).json({success: false,message: "Already reviewed"});
       }
       const ratingReview= await reviewSchema.create({rating,
           review,
           turf:turfId,
           user:userId});
   
   
           await turfSchema.findByIdAndUpdate({_id:turfId},
               {
               $push:{
                reviews: ratingReview._id
           }});
   
   
       res.status(200).json({
          success: true,
          message: "Rating added successfully",
          ratingReview});
      
    } catch (error) {
      console.log(error);
      res.status(500).json({message: error.message}); 
    }
  }
  

// get all review and rating 

module.exports.getAllRating = async (req,res) => {
    //get sorted by rating
    try {
        const allReviews = await reviewSchema.find(
            ).sort({rating: -1})
            .populate({path: "user",
            select: "firstName lastName email image"})
            .populate({path: "turf",
            select: "turfName city"})
            .exec();
            
        return res.status(200).json({
            success: true,
            message:"all reviews fetched successfully",
            data:allReviews,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message});
    }
}