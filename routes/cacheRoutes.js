const express = require("express");
const CacheModel = require("../model/cache.model");
const { LRUCache } = require("lru-cache");

const router = express.Router();

const cache = new LRUCache({
    max: parseInt(process.env.CACHE_MAX_SIZE),
    ttl: parseInt(process.env.CACHE_TTL), // 5 minutes
});

// POST /cache - Store key-value pair
router.post("/", async (req, res) => {
    const { key, value } = req.body;

    if (!key || !value) {
        return res.status(400).json({ error: "Both key and value are required." });
    }

    // Check if key exists in LRU (Update case)
    if (cache.has(key)) {
        cache.set(key, value); // Update in-memory cache
        await CacheModel.updateOne({ key }, { value, createdAt: new Date() });
        return res.json({ message: "Updated successfully", key, value });
    }

    if (cache.size >= process.env.CACHE_MAX_SIZE) {
        return res.status(400).json({ error: "Cache is full. Cannot store more items." });
    }

    cache.set(key, value);

    await CacheModel.create({ key, value });

    res.json({ message: "Stored successfully", key, value });
});

// GET /cache/:key - Retrieve value
router.get("/:key", async (req, res) => {
    const { key } = req.params;

    // Check in LRU
    if (cache.has(key)) {
        return res.json({ key, value: cache.get(key), source: "memory" });
    }

    const entry = await CacheModel.findOne({ key });
    if (!entry) {
        return res.status(404).json({ error: "Key not found" });
    }

    cache.set(key, entry.value);

    res.json({ key, value: entry.value, source: "database" });
});

// DELETE /cache/:key - Remove key
router.delete("/:key", async (req, res) => {
    const { key } = req.params;

    // Remove from LRU
    cache.del(key);


    const result = await CacheModel.deleteOne({ key });
    if (result.deletedCount === 0) {
        return res.status(404).json({ error: "Key not found" });
    }

    res.json({ message: "Deleted successfully", key });
});

module.exports = router;
