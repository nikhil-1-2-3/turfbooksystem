const axios = require('axios');

exports.geocodeAddress = async (addressString) => {
    try {
        const encodedAddress = encodeURIComponent(addressString);
        const url = `https://nominatim.openstreetmap.org/search?q=${encodedAddress}&format=json&limit=1`;
        
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'TurfBookingApp/1.0' // Nominatim requires a User-Agent
            }
        });

        if (response.data && response.data.length > 0) {
            return {
                lat: parseFloat(response.data[0].lat),
                lng: parseFloat(response.data[0].lon)
            };
        }
        return null;
    } catch (error) {
        console.error("Geocoding failed:", error.message);
        return null;
    }
};
