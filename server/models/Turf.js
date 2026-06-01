const mongoose  = require("mongoose");

const turfSchema = new mongoose.Schema({
    turfName:{
        type:String,
        trim:true,
    },
    turfShortDesc:{
        type:String,
        trim:true,
    },

    owner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},

    image:{ // we have a functionality to add more than one images
        type:String,
    },

    reviews:[  // one turf have multiple reviews
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"RatingAndReview",
        }
    ],
    area:{
        type:String,
    },
    city:{
        type:String,
        trim:true,
    },
    address: {
        type: String,
        trim: true,
    },
    contactNumber: {
        type: String,
        trim: true,
    },
    pinCode:{
        type:Number,
        require:true,
    },
    priceTime:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Pricetime"
    },
    createdAt:{
        type:Date,
        default:Date.now,
    },
    price:{
        type:String
    },
    time:{
        type:String
    }
});

const Turf = mongoose.model("Turf",turfSchema);
module.exports=Turf;