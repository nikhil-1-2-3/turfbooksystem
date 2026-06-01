const turfSchema = require("../models/Turf");
const userSchema = require("../models/User");


module.exports.fetchCities = async(req,res)=>{
    try{
        const turfDetails = await turfSchema.find({});
        let cities=[];

        console.log("turfDetails: ",turfDetails);

        if(!turfDetails){
            return res.status(401).json({
                success:false,
                message:"No City Found"
            })
        }

        for(let obj of turfDetails){
            if(!cities.includes(obj.city.toLowerCase() || obj.city.toUpperCase())){
                cities.push(obj.city);
            }
        }

        if(cities.length==0){
            return res.status(401).json({
                success:false,
                message:"Fetching Cities In Array Failed"
            })
        };

        return res.status(200).json({
            success:true,
            message:"Cities Fetched Successfully",
            data:cities
        })

    }
    catch(error){
        console.log(error);
        return res.status(501).json({
            success:false,
            message:"Fetching all Cities Failed"
        })
    }
}

module.exports.searchSpecificCityTurfs=async(req,res)=>{
    try{
        const {cityName}=req.body;
        const turfs = await turfSchema.find({city:new RegExp('^' + cityName + '$', 'i')}).populate("owner").populate("reviews");
   
        if(!turfs){
            return res.status(401).json({
                success:false,
                message:"No Data Found"
            })
        }

        return res.status(200).json({
            success:true,
            message:"Fetching Cities Turfs Successfully",
            data:turfs
        })



    }
    catch(error){
        console.log(error);
        return res.status(501).json({
            success:false,
            message:"Fetching Particular City Turf Failed"
        })
    }
}

module.exports.searchTurf = async (req, res) => {
    try {
        const { searchQuery } = req.body;

        console.log("searchQuery : ", searchQuery)
        const turf = await turfSchema.find({
            $or: [
                { turfName: { $regex: toString(searchQuery), $options: "i" } },
                { turfShortDesc: { $regex: toString(searchQuery), $options: "i" } },
            ],
        })
            .populate("owner")
            .populate("reviews")
            .exec();

        console.log(turf);

        return res.status(200).json({
            success: true,
            data: turf,
        })

    }
    catch (error) {
        console.log(error);
        return res.status(501).json({
            success: false,
            message: "searching turf failed"
        })
    }
}