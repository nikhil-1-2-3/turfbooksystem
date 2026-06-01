const mongoose=require("mongoose");
require("dotenv").config();

exports.connect=()=>{
    mongoose.connect(process.env.ATLASDB_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    })
    .then(()=>{
        console.log("database connected");
    })
    .catch((err)=>{
        console.log("error occuring during conneting with database");
        console.log(err);
        process.exit(1);
    })
};