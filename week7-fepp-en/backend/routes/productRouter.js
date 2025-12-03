const express = require("express");
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productControllers");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();
//public
router.get("/", getAllProducts);
router.get("/:productId", getProductById);

//protected
router.post("/", requireAuth, createProduct);
router.put("/:productId", requireAuth, updateProduct);
router.delete("/:productId", requireAuth, deleteProduct);

module.exports = router;
