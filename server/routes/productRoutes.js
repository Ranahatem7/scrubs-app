const express = require("express");
const {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { protect, admin } = require("../middleware/auth");

const router = express.Router();

router.get("/", getProducts);
router.post("/", protect, admin, createProduct);
router.get("/:slug", getProductBySlug);
router.put("/:id", protect, admin, updateProduct);
router.delete("/:id", protect, admin, deleteProduct);

module.exports = router;
