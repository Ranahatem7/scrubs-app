const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const adminAuth = require("../middleware/adminAuth");
const Product = require("../models/Product");
const User = require("../models/User");
const Order = require("../models/Order");
const Admin = require("../models/Admin");
const Category = require("../models/Category");
const SiteSettings = require("../models/SiteSettings");
const Discount = require("../models/Discount");
const Message = require("../models/Message");

// ── POST /api/admin/login ──────────────────────────────────────────────────
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });
  if (!admin || !(await admin.comparePassword(password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const token = jwt.sign({ isAdmin: true }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.json({ token });
});

// ── PUT /api/admin/credentials ────────────────────────────────────────────
router.put("/credentials", adminAuth, async (req, res) => {
  const { email, currentPassword, newPassword } = req.body;
  const admin = await Admin.findOne();
  if (!admin) return res.status(404).json({ message: "Admin not found" });
  if (!(await admin.comparePassword(currentPassword))) {
    return res.status(401).json({ message: "Current password is incorrect" });
  }
  if (email) admin.email = email;
  if (newPassword) admin.password = newPassword;
  await admin.save();
  res.json({ message: "Credentials updated" });
});

// ── GET /api/admin/stats ──────────────────────────────────────────────────
router.get("/stats", adminAuth, async (req, res) => {
  try {
    const [totalOrders, totalProducts, totalUsers, recentOrders, revenueData] = await Promise.all([
      Order.countDocuments(),
      Product.countDocuments(),
      User.countDocuments(),
      Order.find().sort({ createdAt: -1 }).limit(5).lean(),
      Order.aggregate([{ $group: { _id: null, total: { $sum: "$total" } } }]),
    ]);
    res.json({
      totalOrders,
      totalProducts,
      totalUsers,
      revenue: revenueData[0]?.total ?? 0,
      recentOrders,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── PRODUCTS CRUD ─────────────────────────────────────────────────────────
router.get("/products", adminAuth, async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 }).lean();
  res.json(products);
});

router.post("/products", adminAuth, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put("/products/:id", adminAuth, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/products/:id", adminAuth, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// ── ORDERS ────────────────────────────────────────────────────────────────
router.get("/orders", adminAuth, async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 }).lean();
  res.json(orders);
});

router.put("/orders/:id", adminAuth, async (req, res) => {
  const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  res.json(order);
});

router.delete("/orders/:id", adminAuth, async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  // Restore stock for each item
  for (const item of order.items) {
    if (!item.size || !item.product) continue;
    const product = await Product.findById(item.product);
    if (product && typeof product.stock === "object") {
      const current = product.stock[item.size] ?? 0;
      product.stock[item.size] = current + item.quantity;
      product.markModified("stock");
      await product.save();
    }
  }

  await order.deleteOne();
  res.json({ ok: true });
});

// ── USERS ─────────────────────────────────────────────────────────────────
router.get("/users", adminAuth, async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 }).lean();
    const withCounts = await Promise.all(
      users.map(async (u) => ({
        ...u,
        orderCount: await Order.countDocuments({ user: u._id }),
      }))
    );
    res.json(withCounts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/users/:id/role", adminAuth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: req.body.role },
      { new: true }
    ).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/users/:id", adminAuth, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── CATEGORIES ───────────────────────────────────────────────────────────
router.get("/categories/public", async (req, res) => {
  const cats = await Category.find().sort({ order: 1, createdAt: 1 }).lean();
  res.json(cats);
});

router.get("/categories", adminAuth, async (req, res) => {
  const cats = await Category.find().sort({ order: 1, createdAt: 1 }).lean();
  res.json(cats);
});

router.post("/categories", adminAuth, async (req, res) => {
  try {
    const cat = await Category.create(req.body);
    res.status(201).json(cat);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put("/categories/:id", adminAuth, async (req, res) => {
  try {
    const cat = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(cat);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/categories/:id", adminAuth, async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// ── SITE SETTINGS ─────────────────────────────────────────────────────────
router.get("/settings/public", async (req, res) => {
  try {
    const s = await SiteSettings.findOne();
    res.json(s || {});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/settings", adminAuth, async (req, res) => {
  try {
    const s = await SiteSettings.findOneAndUpdate(
      {},
      { $set: req.body },
      { new: true, upsert: true }
    );
    res.json(s);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── MESSAGES ─────────────────────────────────────────────────────────────
router.get("/messages", adminAuth, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/messages/:id/read", adminAuth, async (req, res) => {
  try {
    const msg = await Message.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    res.json(msg);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/messages/:id", adminAuth, async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── DISCOUNTS ─────────────────────────────────────────────────────────────
router.get("/discounts", adminAuth, async (req, res) => {
  try {
    const discounts = await Discount.find().sort({ createdAt: -1 });
    res.json(discounts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/discounts", adminAuth, async (req, res) => {
  try {
    const { code, percentage } = req.body;
    const discount = await Discount.create({ code: code.toUpperCase().trim(), percentage });
    res.status(201).json(discount);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put("/discounts/:id", adminAuth, async (req, res) => {
  try {
    const discount = await Discount.findByIdAndUpdate(req.params.id, { active: req.body.active }, { new: true });
    res.json(discount);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/discounts/:id", adminAuth, async (req, res) => {
  try {
    await Discount.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;