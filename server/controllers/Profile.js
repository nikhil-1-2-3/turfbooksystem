const userSchema = require("../models/User");
const turfSchema = require("../models/Turf");
const historySchema = require("../models/UserPriceHistory");
require("dotenv").config();
const { uploadImageToCloudinary } = require("../utils/imageUploader");

module.exports.updateProfile = async (req, res) => {
    try {

        const { firstName, lastName } = req.body;
        const id = req.user.id;
        const userDetails = await userSchema.findById({ _id: id });

        userDetails.firstName = firstName || userDetails.firstName;
        userDetails.lastName = lastName || userDetails.lastName;

        await userDetails.save();

        return res.status(200).json({
            success: true,
            message: "User Details Updated Successfully"
        });

    }
    catch (error) {
        return res.status(501).json({
            status: false,
            message: "Profile Updation Failed",
            userDetails
        })
    }
}

module.exports.deleteAccount = async (req, res) => {
    try {

        const id = req.user.id;
        const user = await userSchema.findById({ _id: id });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User Not Exit"
            })
        }

        const deletedUser = await userSchema.findByIdAndDelete({ _id: id });
        console.log("deleted account: ", deletedUser);

        return res.status(200).json({
            success: true,
            message: "Account Deleted"
        })


    }
    catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: "Account Delete Unsuccessfull"
        })
    }
}

module.exports.getBuyTurf = async (req, res) => {
    try {

        const userId = req.user.id;


        const userDetails = await userSchema.findById({ _id: userId });

        if (!userDetails) {
            return res.status(401).json({
                success: false,
                message: "User Not Exit"
            })
        }

        const BuyTurfs = await userSchema.findById({ _id: userId }).populate({
            path: "turfs"
        })
        .populate({ // nesting populate
            path:"history",
            populate:{
                path:"turfId",
            },
        }).exec();


        return res.status(200).json({
            success: true,
            message: "user data fetch successfully",
            data: BuyTurfs
        });

    }
    catch (error) {
        console.log(error.message);
        return res.status(501).json({
            success: false,
            message: "Getting Buy Turf Failed"
        })
    }
}

//updateDisplayPicture
exports.updateDisplayPicture = async (req, res) => {
    try {

        const id = req.user.id;
        const user = await userSchema.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        const image = req.files.pfp;
        if (!image) {
            return res.status(404).json({
                success: false,
                message: "Image not found",
            });
        }
        const uploadDetails = await uploadImageToCloudinary(
            image,
            process.env.FOLDER_NAME
        );
        const updatedImage = await userSchema.findByIdAndUpdate({ _id: id }, { image: uploadDetails.secure_url }, { new: true });

        res.status(200).json({
            success: true,
            message: "Image updated successfully",
            data: updatedImage,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }
}

module.exports.TotalEarning = async(req,res)=>{
    try{
        const id = req.user.id;
        
        const turfs = await turfSchema.find({owner:id});
        const turfDetails = await Promise.all( turfs.map(async(turf)=>{
            let totalRevenue=0;
            const histories=await historySchema.find({turfId:turf._id}).populate("turfId");
            let booking = 0;
            for(let history of histories){
                totalRevenue=totalRevenue+parseInt(history.price);
                booking++;
            }


            const turfStats = {
				_id: turf._id,
				turfName: turf.turfName,
				totalRevenue,
                booking
			};

			return turfStats;
        }));



        res.status(200).json({
			success: true,
			message: "Owner Total Earning fetched successfully",
			data: turfDetails,
		});
    }
    catch(error){
        console.log(error);
        return res.status(401).json({
            success:false,
            message:"Total Earning Fetch Failed"
        })
    }
}