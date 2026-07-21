const Product = require("../models/Product");
const asyncHandler = require("../utils/asyncHandler");

function slugify(value) {
  return value
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// GET /api/products
// Optional query params: category, gender, featured
const getProducts = asyncHandler(async (req, res) => {
  const filter = {};
  const { category, gender, featured } = req.query;

  if (category) filter.category = category;
  if (gender) filter.gender = gender;
  if (featured !== undefined) filter.featured = featured === "true";

  const products = await Product.find(filter).sort({ createdAt: -1 });
  res.json(products);
});

// GET /api/products/:slug
const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug });
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.json(product);
});

// POST /api/products (admin only)
const createProduct = asyncHandler(async (req, res) => {
  const body = { ...req.body };
  if (!body.slug && body.name) {
    body.slug = slugify(body.name);
  }

  const product = await Product.create(body);
  res.status(201).json(product);
});

// PUT /api/products/:id (admin only)
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  Object.assign(product, req.body);
  await product.save();
  res.json(product);
});

// DELETE /api/products/:id (admin only)
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  await product.deleteOne();
  res.json({ message: "Product deleted" });
});

module.exports = {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
};
