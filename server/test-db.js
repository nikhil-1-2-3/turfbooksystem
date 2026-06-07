const mongoose = require('mongoose');
require('dotenv').config();
require('./config/database').connect();
const UserPriceHistory = require('./models/UserPriceHistory');
const User = require('./models/User');
const Turf = require('./models/Turf');

async function run() {
    try {
        const user = await User.findOne({accountType: 'User'});
        if (!user) return console.log('no user found');
        
        const turf = await Turf.findOne();
        if (!turf) return console.log('no turf found');

        const History = await UserPriceHistory.create({
            price: 100,
            time: '10:00',
            turfId: turf._id,
            bookingToken: 'TRF-123',
            bookingDate: '2026-06-10',
            status: 'Pending',
            sport: 'Cricket',
            equipment: ['Bat'],
            equipmentTotal: 100
        });
        console.log('History created successfully:', History._id);

        await User.findByIdAndUpdate(user._id, {
            $push: {
                turfs: turf._id,
                history: History._id
            }
        }, { runValidators: true, new: true });
        console.log('User updated successfully');

        await Turf.findByIdAndUpdate(turf._id, {
            $set: {
                price: 100,
                time: '10:00'
            }
        }, { new: true });
        console.log('Turf updated successfully');

        console.log('SUCCESS');
    } catch(e) {
        console.error('ERROR:', e);
    } finally {
        process.exit();
    }
}
run();
