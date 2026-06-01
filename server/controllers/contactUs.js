const mailSender = require("../utils/mailSender");
require("dotenv").config();


module.exports.contactUs = async (req,res) => {
    try {
        const { firstName, lastName, email, message, phoneNo } = req.body;

        // validation
        if (!firstName || !lastName || !email || !message || !phoneNo) {
            return res.status(401).json({
                success: false,
                message: "all fields are required"
            })
        }

        const data = {
            firstName,
            lastName: `${lastName ? lastName : "null"}`,
            email,
            message,
            phoneNo: `${phoneNo ? phoneNo : "null"}`,
        };

        const info = await mailSender(
            process.env.CONTACT_MAIL,
            "Enquery",
            `<html><body>${Object.keys(data).map((key) => {
                return `<p>${key} : ${data[key]}</p>`;
            })}</body></html>`
        );
        if (info) {
            return res.status(200).send({
                success: true,
                message: "Your message has been sent successfully",
            });
        } else {
            return res.status(403).send({
                success: false,
                message: "Something went wrong",
            });
        }

    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "something went wrong while contacting"
        })
    }
}