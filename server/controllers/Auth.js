const UserSchema = require("../models/User");
const OTPSchema = require("../models/OTP.js");

require("dotenv").config();
const otpGenerator = require("otp-generator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");



exports.sendOTP = async (req, res) => {
    try {

        // first fetch email from req body for sending otp to that mail

        let { email } = req.body;

        // check email already exit or not

        let checkUserPresent = await UserSchema.findOne({ email });

        if (checkUserPresent) {
            return res.status(401).json({  // return indicated end of the function.
                success: false,
                message: "user already registered"
            })
        }

        // generate otp for sending to the user

        let otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        });

        console.log("otp generated: ", otp);

        // check otp already exit, we want a unique otp

        let result = await OTPSchema.findOne({ otp: otp });

        while (result) { // this while loop b'coz otp generator function generat otp and that otp matched to the exit otp again and again.
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false
            });

            console.log("generated OTP : ", otp)

            result = await OTPSchema.findOne({ otp: otp });
        }

        // save the otp and email in otp document

        let otpPayload = { email, otp };

        const otpBody = await OTPSchema.create(otpPayload);
        console.log("otp body: ", otpBody);

        res.status(200).json({
            success: true,
            message: "OTP send successfully"
        })

    }

    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "OTP sent unsuccssful"
        })
    }
}



module.exports.signUp = async (req, res) => {
    try {
        // fetch data from req body
        let {
            firstName,
            lastName,
            email,
            password,
            // contactNo,
            accountType
        } = req.body;

        console.log("signUp data: ",req.body);

        // cheack all fields are present (validation)

        if (!firstName || !lastName || !email || !password || !accountType) {
            return res.status(401).json({
                success: false,
                message: "all fields are required"
            });
        }

        // check user already exit 

        let checkuser = await UserSchema.findOne({ email });

        if (checkuser) {
            return res.status(400).json({
                success: false,
                message: "user already registerd"
            });
        }

        // hash password
        var salt = bcrypt.genSaltSync(10); // this is length of salt which we want to insert in the password.
        var hashedPassword = bcrypt.hashSync(password, salt);

        // insert all data into the database

        const user = await UserSchema.create({
            firstName,
            lastName,
            password: hashedPassword,
            email,
            // contactNo,
            accountType,
        });

        // return response

        return res.status(200).json({
            success: true,
            message: 'user registerd successfully',
            user
        });

    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "User can not be registerd please try again"
        })
    }
}

// login

exports.login = async (req, res) => {

    try {
        // fetch data from req body
        const { email, password } = req.body;

        // check email and password present or not
        if (!email || !password) {
            return res.status(403).json({
                success: false,
                message: "all fields are required"
            });
        }

        // check user already registerd or not
        const user = await UserSchema.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "user not registred, Please Signup First"
            });
        }
        // check password

        const checkPassword = await bcrypt.compare(password, user.password);

        if (checkPassword) {
            const token = jwt.sign(
                { email: user.email, id: user._id, accountType: user.accountType },
                process.env.JWT_SECRET,
                {
                    expiresIn: "24h",
                }
            );

            // Save token to user document in database
            user.token = token;
            user.password = undefined; // we are sending user in cookies that why we have set password to undefined but in database that password is not undefined.
            // Set cookie for token and return success response
            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            };
            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: `User Login Success`,
            });

            // res.status(200).json({
            //     success:true,
            //     token,
            //     user,
            //     message:"logged in Successfully"
            // })
        }
        else {
            return res.status(401).json({
                success: false,
                message: "Incorrect Password"
            });
        }
    }

    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "user Login unsuccessful"
        })
    }
}


// change password 

module.exports.changePassword = async(req,res)=>{
    try{
        const id=req.user.id;
        
        const user = await UserSchema.findById({_id:id});

        if(!user){
            return res.status(401).json({
                success:false,
                message:"User Not Exit"
            })
        }

        const {oldPassword,newPassword}=req.body;

        // validate old password
        const ispasswordMatch = bcrypt.compare(oldPassword,user.password);

        if(!ispasswordMatch){
            return res.status(401).json({
                success:false,
                message:"Password Is Incorrect"
            })
        }

        if(oldPassword==newPassword){
            return res.status(400).json({
                success:false,
                message:"Oldpassword Not Same As Newpassword"
            })
        }

        // update password

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword= bcrypt.hashSync(newPassword,salt);

        const userDetails = await UserSchema.findByIdAndUpdate({_id:id},{password:hashedPassword},{new:true});

        // return res

        return res.status(200).json({
            success:true,
            message:"Password Updated successfully"
        })




    }
    catch(error){
        console.log(error);
        return res.status(501).json({
            success:false,
            message:"Password Updation Failed"
        })
    }
}