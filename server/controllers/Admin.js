const User = require("../models/User");
const UserPriceHistory = require("../models/UserPriceHistory");
const Turf = require("../models/Turf");

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select("-password");
        return res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            data: users,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch users",
            error: error.message,
        });
    }
};

exports.getAllBookings = async (req, res) => {
    try {
        // Fetch all history and populate the turf details
        const bookings = await UserPriceHistory.find({}).populate("turfId");
        
        // Optionally, if we need user details, we'd have to map through Users since history doesn't store userId.
        // But for admin dashboard, seeing the turf, price, and time is usually enough.
        
        return res.status(200).json({
            success: true,
            message: "Bookings fetched successfully",
            data: bookings,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch bookings",
            error: error.message,
        });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { userId } = req.body;
        await User.findByIdAndDelete(userId);
        return res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to delete user",
            error: error.message,
        });
    }
};

exports.allotBooking = async (req, res) => {
    try {
        const { bookingId } = req.body;
        
        const booking = await UserPriceHistory.findByIdAndUpdate(
            bookingId,
            { status: "Allotted" },
            { new: true }
        );

        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }

        return res.status(200).json({
            success: true,
            message: "Turf successfully allotted!",
            data: booking
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to allot turf",
            error: error.message,
        });
    }
};

exports.approveCancellation = async (req, res) => {
    try {
        const { bookingId } = req.body;
        
        const booking = await UserPriceHistory.findByIdAndUpdate(
            bookingId,
            { status: "Cancelled" },
            { new: true }
        );

        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }

        // By setting the status to "Cancelled", the getFullTurfDetails dynamically ignores this booking
        // Therefore, the exact time slot on that exact date is instantly freed up!

        return res.status(200).json({
            success: true,
            message: "Cancellation approved successfully. Slot is now free.",
            data: booking
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to approve cancellation",
            error: error.message,
        });
    }
};
