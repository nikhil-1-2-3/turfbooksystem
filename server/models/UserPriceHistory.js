const mongoose = require("mongoose");


const userPriceHistorySchema = new mongoose.Schema({
    price:{
        type:String,
        default:null
    },
    time:{
        type:String,
        default:null,
    },
    turfId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Turf"
    },
    bookingToken: {
        type: String,
        required: true,
    },
    bookingDate: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: "Pending", // Can be "Pending" or "Allotted"
    },
    sport: {
        type: String,
        default: null,
    },
    equipment: [
        {
            type: String,
        }
    ],
    equipmentTotal: {
        type: Number,
        default: 0,
    }
});

const UserPriceHistory = mongoose.model("UserPriceHistory",userPriceHistorySchema);

module.exports=UserPriceHistory;