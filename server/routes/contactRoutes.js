const express = require("express");
const router = express.Router();
const Message = require("../models/Message");

// POST /api/contact
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: "Name, email, and message are required." });
    }
    const saved = await Message.create({ name, email, phone, message });
    res.status(201).json({ ok: true, id: saved._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;