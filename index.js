
require("dotenv").config();
const express = require("express");
const cacheRoutes = require("./routes/cacheRoutes")


const app = express();
const PORT = process.env.PORT || 3000;
const connectDB = require("./db");
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use("/cache", cacheRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
