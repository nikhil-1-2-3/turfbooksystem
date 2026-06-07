const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    turf: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Turf',
        required: true
    },
    sport: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    playersNeeded: {
        type: Number,
        required: true,
        default: 1
    },
    description: {
        type: String,
        maxLength: 300
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 86400 // Automatically delete the post after 24 hours (86400 seconds)
    }
});

module.exports = mongoose.model("Post", postSchema);
