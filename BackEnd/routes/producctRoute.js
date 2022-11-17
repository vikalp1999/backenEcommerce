const express = require("express");
const { getAllProducts ,createProduct, updateProduct,deleteProduct,getProductDetails, 
    createProductReview,
    getProductReviews,
    deletReview} = require("../controller/productController");
const { isAuthenticatedUser,authorizeRole } = require("../middleware/Auth");

const router=express.Router();

router.route("/products").get(getAllProducts)
router.route("/admin/product/new").post(isAuthenticatedUser,authorizeRole("admin"),createProduct)
router.route("/admin/product/:id").put(isAuthenticatedUser,authorizeRole("admin"),updateProduct)
router.route("/admin/product/:id").delete(isAuthenticatedUser,authorizeRole("admin"),deleteProduct)
router.route("/product/:id").get(getProductDetails);
router.route("/review").put(isAuthenticatedUser,createProductReview)
router.route("/review").get(getProductReviews).delete(isAuthenticatedUser,deletReview)
module.exports=router