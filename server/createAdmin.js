const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const UserSchema = require("./models/User");
require("dotenv").config();

async function createAdmin() {
    try {
        await mongoose.connect(process.env.ATLASDB_URL);
        
        const email = "admin@admin.com";
        const checkUser = await UserSchema.findOne({ email });

        if (checkUser) {
            console.log("Admin already exists!");
        } else {
            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync("admin123", salt);

            await UserSchema.create({
                firstName: "Super",
                lastName: "Admin",
                email: email,
                password: hashedPassword,
                accountType: "Admin",
            });
            console.log("Admin account created successfully!");
        }
    } catch (error) {
        console.error("Error creating admin:", error);
    } finally {
        mongoose.connection.close();
    }
}

createAdmin();
