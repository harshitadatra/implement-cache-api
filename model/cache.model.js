const mongoose = require("mongoose");

//created cache Schema
const cacheSchema = new mongoose.Schema(
    {
        key: { type: String, unique: true, required: true },
        value: { type: String, required: true },
        createdAt: { type: Date, default: Date.now, expires: process.env.CACHE_TTL / 1000 }, // TTL index
    },
    { timestamps: true }
);

module.exports = mongoose.model("Cache", cacheSchema);