const jwt=require("jsonwebtoken");
require("dotenv").config();
const {userSchema}=require("../schema.js");

module.exports.auth=async(req,res,next)=>{
    try{
        // extract token
       

        const token = req.cookies.token 
                        || req.body.token 
                        || req.header("Authorisation").replace("Bearer ", "");

        console.log("token: ",token);
        // if token missing return res
        if(!token){
            return res.status(401).json({
                success:false,
                message:"Token is missing"
            })
        }

        // verify token 

        try{
            const decode=jwt.verify(token,process.env.JWT_SECRET);
            console.log("decode: ",decode); // here in this decode our payload is save which is created during login
            req.user=decode;
        }
        catch(error){
            console.log(error);
            return res.status(401).json({
                success:false,
                message:"Token is Invalid"
            });
        }
        next();

    }
    catch(error){
        console.log(error);
            return res.status(500).json({
                success:false,
                message:"something went wrong while validating token"
            })
    }
}

// validate user 

module.exports.validateUser = (req,res,next)=>{
        let {error}=userSchema.validate(req.body);
        if(error){
            let errMsg = error.details.map((el)=>el.message).join(",");
            console.log("errMsg: ",errMsg);
            return res.status(400).json({ success: false, message: errMsg });
        }
        else{
            next();
        }
    
}

// is student

module.exports.isUser = async(req,res,next)=>{
    try{
        console.log("req.body:",req.user.accountType);
        if(req.user.accountType!="User"){
            return res.status.json({
                success:false,
                message:"This is protected route only for student"
            })
        }
        next();
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"something went wrong while validating student"
        })
    }
}

// is instructor

module.exports.isOwner = async(req,res,next)=>{
    try{
        if(req.user.accountType!="Owner"){
            return res.status.json({
                success:false,
                message:"This is protected route only for Owner"
            })
        }
        next();
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"something went wrong while validating Owner"
        })
    }
}

// is admin

module.exports.isAdmin = async(req,res,next)=>{
    try{
        if(req.user.accountType!="Admin"){
            return res.status(401).json({
                success:false,
                message:"This is protected route only for Admin"
            })
        }
        next();
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"something went wrong while validating Admin"
        })
    }
}
