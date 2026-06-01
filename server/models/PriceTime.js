const mongoose = require("mongoose");

const priceTimeSchema = new mongoose.Schema({
    data: [Object] ,
});

const Pricetime = mongoose.model("Pricetime",priceTimeSchema);
module.exports=Pricetime;