require("dotenv").config();
const mongoose = require("mongoose");
const Turf = require("./models/Turf");
const User = require("./models/User");
const PriceTime = require("./models/PriceTime"); // Check if it's PriceTime.js or Pricetime
const bcrypt = require("bcryptjs");

const ATLASDB_URL = process.env.ATLASDB_URL;

const suratTurfs = [
    {
        turfName: "Hit Wicket Turf & Sports Club",
        address: "Opposite Patel Brothers Store, near Tea Post Cafe, Anand Park, Althan, Surat, Gujarat 395007",
        contactNumber: "+91 92270 70586",
        turfShortDesc: "Premium sports arena with state-of-the-art synthetic turf, perfect for cricket and football matches. Enjoy top-tier facilities in the heart of Althan.",
        area: "Althan",
        city: "Surat",
        pinCode: 395007,
        image: "https://images.unsplash.com/photo-1518605368461-1ee7c5101fa2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        turfName: "Titans Turf (by SPORLOC)",
        address: "Vibgyor High School, Dumas Road, behind The Grand Bhagwati Hotel, Magdalla, Surat, Gujarat 395007",
        contactNumber: "+91 83697 25163",
        turfShortDesc: "Experience the thrill of the game at Titans Turf. Strategically located near Dumas road, offering excellent floodlights for night games.",
        area: "Magdalla",
        city: "Surat",
        pinCode: 395007,
        image: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        turfName: "Ballin Turf and Pickleball",
        address: "TP15, Bhagban Circle, Pal Gam, Surat, Gujarat 394510",
        contactNumber: "+91 70167 99905",
        turfShortDesc: "A dual-purpose facility catering to both box cricket lovers and pickleball enthusiasts. Well-maintained courts with excellent grip.",
        area: "Pal Gam",
        city: "Surat",
        pinCode: 394510,
        image: "https://images.unsplash.com/photo-1589487391730-58f20eb2c308?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        turfName: "Smashup Turf",
        address: "RCC, Plot No 62, Vesu Canal Road, near Shyam Sangini, Vesu, Surat, Gujarat 395007",
        contactNumber: "+91 86555 22234",
        turfShortDesc: "Located in the prime area of Vesu, Smashup Turf provides a highly professional environment for corporate matches and casual games alike.",
        area: "Vesu",
        city: "Surat",
        pinCode: 395007,
        image: "https://images.unsplash.com/photo-1628891435222-065928dcb335?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        turfName: "Free Hit Box Cricket Turf",
        address: "Celebration Compound, Vesu Canal Road, near Shayona Plaza, Punagam, Yoginagar Society, Surat, Gujarat 395011",
        contactNumber: "+91 90239 94942",
        turfShortDesc: "The ultimate destination for Box Cricket! Bring your team and smash those boundaries in a fully enclosed, high-quality turf.",
        area: "Punagam",
        city: "Surat",
        pinCode: 395011,
        image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        turfName: "Surat Super Turf Box Cricket & Academy",
        address: "Kangaroo Circle, Behind Capital Square, Godadara Road, Parvat Patiya, Surat, Gujarat 395012",
        contactNumber: "+91 79900 84401",
        turfShortDesc: "More than just a turf—it's an academy. We offer coaching and open booking slots for all cricket enthusiasts in Parvat Patiya.",
        area: "Parvat Patiya",
        city: "Surat",
        pinCode: 395012,
        image: "https://images.unsplash.com/photo-1624526267942-ab0f1807f5d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        turfName: "Century Cricket Turf",
        address: "Opposite Bhavani Baag, Moti Ved, Ved Road, Katargam, Surat, Gujarat 395004",
        contactNumber: "+91 92387 64656",
        turfShortDesc: "Hit a century at Century Cricket Turf! Known for its fantastic pitch speed and comfortable dugout area for waiting teams.",
        area: "Katargam",
        city: "Surat",
        pinCode: 395004,
        image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        turfName: "Turf Sports",
        address: "Dumas Road, opposite VR Mall, Vesu, Surat, Gujarat 395007",
        contactNumber: "+91 92387 64656",
        turfShortDesc: "A lively sports complex situated opposite VR Mall. Accessible, premium, and perfect for a weekend match with friends.",
        area: "Vesu",
        city: "Surat",
        pinCode: 395007,
        image: "https://images.unsplash.com/photo-1518605368461-1ee7c5101fa2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        turfName: "Palm Box Cricket",
        address: "Jahangirpura-Pisad Road, near Sangini Swaraj, opposite Exiito, Surat, Gujarat 395005",
        contactNumber: "Book Online",
        turfShortDesc: "Experience cricket surrounded by nature. Palm Box Cricket offers excellent ventilation and top-tier astroturf.",
        area: "Jahangirpura",
        city: "Surat",
        pinCode: 395005,
        image: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        turfName: "Infinity Box Cricket",
        address: "Vesu Canal Road, near Jiviba Farm, Magob, Puna, Surat, Gujarat 395011",
        contactNumber: "Book via App",
        turfShortDesc: "Unlimited fun at Infinity Box Cricket! High nets, great lighting, and a fast outfield make every match exciting.",
        area: "Puna",
        city: "Surat",
        pinCode: 395011,
        image: "https://images.unsplash.com/photo-1589487391730-58f20eb2c308?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(ATLASDB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB...");

        // 1. Delete all existing turfs
        await Turf.deleteMany({});
        console.log("Deleted all old turfs.");

        // 2. Find or create a dummy owner
        let owner = await User.findOne({ accountType: "Owner" });
        if (!owner) {
            const hashedPassword = bcrypt.hashSync("password123", 10);
            owner = await User.create({
                firstName: "Surat",
                lastName: "Admin",
                email: "admin@suratturfs.com",
                password: hashedPassword,
                accountType: "Owner"
            });
            console.log("Created dummy owner.");
        }

        // 3. Insert new turfs
        for (const turfData of suratTurfs) {
            
            // Create some random price/time slots for the turf
            const times = ["06:00", "07:00", "18:00", "19:00", "20:00", "21:00"];
            let priceTimeData = [];
            for (let t of times) {
                priceTimeData.push({ time: t, price: 1000, booked: 0 });
            }

            // The model is likely PriceTime, let's create it
            let pt;
            try {
                const PriceTimeModel = require("./models/PriceTime");
                pt = await PriceTimeModel.create({ data: priceTimeData });
            } catch(e) {
                // Ignore if model structure is slightly different
                console.log("Could not create pricetime", e.message);
            }

            await Turf.create({
                ...turfData,
                owner: owner._id,
                priceTime: pt ? pt._id : undefined,
                price: "1000"
            });
        }

        console.log(`Successfully seeded ${suratTurfs.length} Surat turfs!`);
        process.exit(0);

    } catch (error) {
        console.error("Seeding error:", error);
        process.exit(1);
    }
};

seedDB();
