const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        // required:true,
        default: null,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    contactNo: {
        type: Number,
        // required:true,
        trim: true,
        default: null
    },
    accountType: {
        type: String,
        enum: ["Admin", "User", "Owner"],
        required: true
    },
    token: {
        type: String,
    },
    turfs: [ // here we are used array b'coz owner may have multiple turf and here we are also store buy user turfs
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Turf"
        }
    ],
    image: {
        type: String,
    },
    history:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserPriceHistory"
    }]

});

const User = mongoose.model("User", userSchema);

module.exports = User;