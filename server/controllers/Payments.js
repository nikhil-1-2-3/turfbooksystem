const { instance } = require("../config/razorpay");
const userSchema = require("../models/User");
const mailSender = require("../utils/mailSender");
const { paymentSuccess } = require("../template/paymentSuccess");
const { default: mongoose } = require("mongoose");
const crypto = require("crypto");
const turfSchema = require("../models/Turf");
const userPriceHistorySchema = require("../models/UserPriceHistory");
const priceTimeSchema=require("../models/PriceTime");


module.exports.capturePayment = async (req, res) => {
    //get courseId and UserID
    //validation
    //valid courseID
    try {
        const { turf, turfprice } = req.body;
        const userId = req.user.id;
        if (!turf) {
            return res.json({
                success: false,
                message: 'Please provide valid turf ID',
            })
        };

        // let totalAmount = turfprice;
        let totalAmount = turfprice;



        // console.log("courseid=",course_id);
        let turfDetails;
        try {
            turfDetails = await turfSchema.findById({ _id: turf });
            if (!turfDetails) {
                return res.json({
                    success: false,
                    message: 'turf not find the course',
                });
            }

        }
        catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
        // totalAmount += course.price;

        const options = {
            amount: totalAmount * 100,
            currency: "INR",
            receipt: Math.random(Date.now()).toString(),
        };

        try {
            //initiate the payment using razorpay
            const paymentResponse = await instance.orders.create(options);
            //return response
            return res.status(200).json({
                success: true,
                orderId: paymentResponse.id,
                currency: paymentResponse.currency,
                amount: paymentResponse.amount,
                data: paymentResponse
            });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }

};



//verify the signature
module.exports.verifySignature = async (req, res) => {
    //get the payment details
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
    const { turf, amount, time } = req.body;
    const userId = req.user.id;


    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
        return res.status(400).json({
            success: false,
            message: 'Payment details are incomplete',
        });
    }

    let body = razorpay_order_id + "|" + razorpay_payment_id;

    const enrolleCustomer = async (turf, userId) => {
        if (!turf || !userId) {
            return res.status(400).json({
                success: false,
                message: 'Please provide valid turf and user ID',
            });
        }
        try {
            //update the turf


            const History = await userPriceHistorySchema.create({
                price: amount,
                time: time,
                turfId: turf,
            });

            //update the user
            const user = await userSchema.findByIdAndUpdate(
                { _id: userId },
                {
                    $push: {
                        turfs: turf,
                        history: History._id
                    }
                },
                { runValidators: true, new: true }
            );

            const turfDetails = await turfSchema.findByIdAndUpdate(
                { _id: turf },
                {
                    $set: {
                        price: amount,
                        time: time
                    }
                }, { new: true }
            )
            // await user.save();




            //send email
            const recipient = await userSchema.findById(userId);

            return res.status(200).json({
                success: true,
                message: 'Payment successful',
            });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }

    }

    try {
        //verify the signature
        const generatedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET).update(body.toString()).digest("hex");
        if (generatedSignature === razorpay_signature) {
            await enrolleCustomer(turf, userId);
        }

    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }


}




//send email

module.exports.sendPaymentSuccessEmail = async (req, res) => {
    const { amount, paymentId, orderId,turf,time} = req.body;
    const userId = req.user.id;

    if (!amount || !paymentId) {
        return res.status(400).json({
            success: false,
            message: 'Please provide valid payment details',
        });
    }
    try {

        const turfDetails = await turfSchema.findById(turf);

        
        const priceTimeDetails = await priceTimeSchema.findById(turfDetails.priceTime);
        const obj = priceTimeDetails.data;
        const bookedTimes = time.split(',');

        for(let key of obj){
            if(bookedTimes.includes(key.time.toString())){
                key.booked=1;
            }
        }

        const update = {data:obj};
        await priceTimeSchema.findByIdAndUpdate(turfDetails.priceTime,update,{new:true});

        const userDetails = await userSchema.findById(userId);
        await mailSender(
            userDetails.email,
            `turfXL Payment successful`,
            paymentSuccess(amount / 100, paymentId, orderId, userDetails.firstName, userDetails.lastName),
        );
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

// Offline Booking System (Token-based)
module.exports.bookOffline = async (req, res) => {
    const { turf, amount, time, date } = req.body;
    const userId = req.user.id;

    if (!turf || !amount || !time || !date) {
        return res.status(400).json({
            success: false,
            message: 'Incomplete booking details',
        });
    }

    try {
        // Generate a random 6-character token
        const bookingToken = "TRF-" + crypto.randomBytes(3).toString('hex').toUpperCase();

        // 1. Create UserPriceHistory with token and date
        const History = await userPriceHistorySchema.create({
            price: amount,
            time: time,
            turfId: turf,
            bookingToken: bookingToken,
            bookingDate: date,
            status: "Pending"
        });

        // 2. Update user's history and turfs list
        const user = await userSchema.findByIdAndUpdate(
            { _id: userId },
            {
                $push: {
                    turfs: turf,
                    history: History._id
                }
            },
            { runValidators: true, new: true }
        );

        // 3. Update Turf global stats
        const turfDetails = await turfSchema.findByIdAndUpdate(
            { _id: turf },
            {
                $set: {
                    price: amount,
                    time: time
                }
            }, { new: true }
        );

        // We no longer permanently lock slots in priceTimeSchema here. 
        // Availability is calculated dynamically using UserPriceHistory entries!

        return res.status(200).json({
            success: true,
            message: 'Booking successful',
            bookingToken: bookingToken
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Request Cancellation
module.exports.requestCancellation = async (req, res) => {
    try {
        const { bookingId } = req.body;
        
        if (!bookingId) {
            return res.status(400).json({ success: false, message: "Booking ID is required" });
        }

        const history = await userPriceHistorySchema.findById(bookingId);
        if (!history) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }

        if (history.status === "Allotted" || history.status === "Cancelled") {
            return res.status(400).json({ success: false, message: "Cannot cancel this booking." });
        }

        history.status = "Cancellation_Requested";
        await history.save();

        return res.status(200).json({
            success: true,
            message: "Cancellation Requested Successfully",
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to request cancellation",
        });
    }
};

