const mongoose = require('mongoose');
require('./config/database').connect();
const Turf = require('./models/Turf');
const { geocodeAddress } = require('./utils/geocode');

async function seed() {
    try {
        const turfs = await Turf.find({ 'location.lat': { $exists: false } });
        console.log('Found turfs without location:', turfs.length);
        for (const turf of turfs) {
            if (!turf.area || !turf.pinCode) continue;
            const fullAddress = `${turf.area}, Surat, Gujarat, ${turf.pinCode}, India`;
            console.log('Geocoding:', fullAddress);
            
            // Adding a short delay to respect Nominatim usage policy (1 request per second max)
            await new Promise(r => setTimeout(r, 1000));
            
            const coordinates = await geocodeAddress(fullAddress);
            if (coordinates) {
                turf.location = coordinates;
                await turf.save();
                console.log('Saved:', coordinates);
            } else {
                console.log('Failed to geocode');
            }
        }
        console.log('Done!');
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
seed();
