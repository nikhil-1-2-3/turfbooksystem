require("dotenv").config();
const express=require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const database = require("./config/database");
const cors = require("cors");

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // allow all origins
    methods: ["GET", "POST"]
  }
});

// Real-Time Slot Locking Logic
const lockedSlots = new Map(); // key: turfId_date_time, value: { socketId, expiresAt }

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Join a turf-specific room
  socket.on("join_turf", (data) => {
    const { turfId, date } = data;
    if (!turfId || !date) return;
    const room = `turf_${turfId}_${date}`;
    socket.join(room);

    // Send current locks for this turf/date to the user
    const currentLocks = [];
    lockedSlots.forEach((lockInfo, key) => {
      const [lockedTurfId, lockedDate, lockedTime] = key.split('_');
      if (lockedTurfId === turfId && lockedDate === date) {
        if (lockInfo.expiresAt > Date.now()) {
          currentLocks.push(lockedTime);
        } else {
          lockedSlots.delete(key);
        }
      }
    });
    socket.emit("initial_locks", currentLocks);
  });

  socket.on("lock_slot", (data) => {
    const { turfId, date, time } = data;
    if (!turfId || !date || !time) return;
    const key = `${turfId}_${date}_${time}`;
    const room = `turf_${turfId}_${date}`;

    const existingLock = lockedSlots.get(key);
    if (existingLock && existingLock.expiresAt > Date.now() && existingLock.socketId !== socket.id) {
        // Already locked by someone else
        socket.emit("lock_error", { message: "Slot already locked by someone else." });
        return;
    }

    // Lock for 5 minutes
    lockedSlots.set(key, { socketId: socket.id, expiresAt: Date.now() + 5 * 60 * 1000 });
    io.to(room).emit("slot_locked", { time });

    // Set a timeout to unlock if it expires
    setTimeout(() => {
        const lock = lockedSlots.get(key);
        if (lock && lock.socketId === socket.id) {
            lockedSlots.delete(key);
            io.to(room).emit("slot_unlocked", { time });
        }
    }, 5 * 60 * 1000);
  });

  socket.on("unlock_slot", (data) => {
    const { turfId, date, time } = data;
    if (!turfId || !date || !time) return;
    const key = `${turfId}_${date}_${time}`;
    const room = `turf_${turfId}_${date}`;
    
    const lock = lockedSlots.get(key);
    if (lock && lock.socketId === socket.id) {
        lockedSlots.delete(key);
        io.to(room).emit("slot_unlocked", { time });
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    // Remove all locks held by this socket
    lockedSlots.forEach((lockInfo, key) => {
      if (lockInfo.socketId === socket.id) {
        lockedSlots.delete(key);
        const [turfId, date, time] = key.split('_');
        io.to(`turf_${turfId}_${date}`).emit("slot_unlocked", { time });
      }
    });
  });
});


// files upload packeged

const fileUpload = require("express-fileupload");
const { cloudinaryconnect } = require("./config/cloudinary");

// Route paths
const userRoutes=require("./routes/User");
const profileRoutes = require("./routes/Profile");
const turfRoutes = require("./routes/Turf");
const paymentsRoutes = require("./routes/Payments");
const adminRoutes = require("./routes/Admin");
const postRoutes = require("./routes/Post");
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
app.use("/api/v1/post", postRoutes);
app.use("/api/v1/payment", paymentRoutes);


app.get("/", (req, res) => {
	return res.json({
		success:true,
		message:'Your server is up and running....'
	});
});

server.listen(port,()=>{
    console.log("app is listing on port: ",port);
});