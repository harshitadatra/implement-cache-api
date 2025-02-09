
require("dotenv").config();
const express = require("express");
// const mongoose = require("mongoose");
const cacheRoutes = require("./routes/cacheRoutes")


const app = express();
const PORT = process.env.PORT || 3000;
const connectDB = require("./db");

// MongoDB Connection
// mongoose.connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// }).then(() => console.log("Connected to MongoDB"))
// .catch((err) => console.error("MongoDB connection error:", err));// Connect to MongoDB
connectDB();


// Middleware
app.use(express.json());

// Routes
app.use("/cache", cacheRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
