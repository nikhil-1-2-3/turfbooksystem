const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const axios = require('axios');
require('dotenv').config();
require('./config/database').connect();
const User = require('./models/User');
const Turf = require('./models/Turf');

async function testBooking() {
    try {
        const user = await User.findOne({accountType: 'User'});
        if (!user) return console.log('no user found');
        
        const turf = await Turf.findOne();
        if (!turf) return console.log('no turf found');

        // Generate token
        const payload = {
            email: user.email,
            id: user._id,
            accountType: user.accountType,
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "24h" });

        // Make API request
        console.log('Making request...');
        const response = await axios.post('http://localhost:4050/api/v1/payment/bookOffline', {
            turf: turf._id.toString(),
            amount: 100,
            time: '10:00',
            date: '2026-06-10',
            sport: 'Cricket',
            equipment: ['Bat'],
            equipmentTotal: 100
        }, {
            headers: {
                Authorisation: `Bearer ${token}`
            }
        });

        console.log('SUCCESS:', response.data);
    } catch (error) {
        console.log('FAILED!');
        if (error.response) {
            console.log('Status:', error.response.status);
            console.log('Data:', error.response.data);
        } else {
            console.log('Error:', error.message);
        }
    } finally {
        process.exit();
    }
}
testBooking();
