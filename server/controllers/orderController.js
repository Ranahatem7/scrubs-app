const Order = require("../models/Order");
const Product = require("../models/Product");
const asyncHandler = require("../utils/asyncHandler");

// POST /api/orders
const createOrder = asyncHandler(async (req, res) => {
  const { items, shipping, paymentMethod } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    res.status(400);
    throw new Error("Your cart is empty");
  }
  if (!shipping || !paymentMethod) {
    res.status(400);
    throw new Error("Shipping details and payment method are required");
  }

  const productIds = items.map((i) => i.product);
  const found = await Product.find({ _id: { $in: productIds } });
  const productMap = new Map(found.map((p) => [p._id.toString(), p]));

  const orderItems = items.map((item) => {
    const product = productMap.get(item.product);
    if (!product) {
      res.status(400);
      throw new Error("One of the items in your cart is no longer available");
    }
    return {
      product: product._id,
      name: product.name,
      image: product.images?.[0],
      price: product.price,
      size: item.size,
      color: item.color,
      quantity: item.quantity,
      category: product.gender ?? product.category ?? null,
    };
  });
// Deduct stock for each item
for (const item of orderItems) {
  const product = productMap.get(item.product.toString());
  if (product && typeof product.stock === "object" && item.size) {
    const current = product.stock[item.size] ?? 0;
    product.stock[item.size] = Math.max(0, current - item.quantity);
    product.markModified("stock");
    await product.save();
  }
}
  const subtotal = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const order = await Order.create({
    user: req.user?._id ?? null,
    items: orderItems,
    shipping,
    paymentMethod,
    subtotal,
    total: subtotal,
  });

  res.status(201).json(order);
});

// GET /api/orders/mine
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

module.exports = { createOrder, getMyOrders };