require("dotenv").config();
const express=require("express");
const app = express();
const database = require("./config/database");
const cors = require("cors");


// files upload packeged

const fileUpload = require("express-fileupload");
const { cloudinaryconnect } = require("./config/cloudinary");

// Route paths
const userRoutes=require("./routes/User");
const profileRoutes = require("./routes/Profile");
const turfRoutes = require("./routes/Turf");
const paymentsRoutes = require("./routes/Payments");
const adminRoutes = require("./routes/Admin");
const contactRoute = require("./routes/ContactUs");
const paymentRoutes=require("./routes/Payments");

const port = process.env.PORT || 4050;
const cookieParser=require("cookie-parser");

app.use(cookieParser());
app.use(express.json()); // parse client json data to js object.

app.use(cors());

// file upload 
app.use(
    fileUpload({
      useTempFiles: true,
      tempFileDir: "/tmp",
    })
  );
  
cloudinaryconnect();
database.connect();

app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/contact", contactRoute);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/turf", turfRoutes);
app.use("/api/v1/payment", paymentsRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/payment", paymentRoutes);


app.get("/", (req, res) => {
	return res.json({
		success:true,
		message:'Your server is up and running....'
	});
});

app.listen(port,()=>{
    console.log("app is listing on port: ",port);
});