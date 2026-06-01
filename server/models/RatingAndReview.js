const mongoose=require("mongoose");

const ratingAndReviewSchema = new mongoose.Schema({
    rating:{
        type:Number,
        require:true,
        min:1,
        max:5
    },
    review:{
        type:String,
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    turf:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Turf"
    },
    createdAt:{
        type:Date,
        default: Date.now()
    },
});

const RatingAndReview=mongoose.model("RatingAndReview",ratingAndReviewSchema);

module.exports=RatingAndReview;