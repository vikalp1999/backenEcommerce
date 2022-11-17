const express= require("express");
const { newOrder, getSingleOrder, myOrders, getAllOrders, updateOrder, deleteOrder } = require("../controller/oredrcontroller");
const router= express.Router();
const { isAuthenticatedUser,authorizeRole } = require("../middleware/Auth");
router.route("/order/new").post(isAuthenticatedUser,newOrder)
router.route("/order/:id").get(isAuthenticatedUser,getSingleOrder);
router.route("/order/me").get(isAuthenticatedUser,myOrders);
router.route("/admin/orders").get(isAuthenticatedUser,authorizeRole("admin"),getAllOrders);
router.route("/admin/order/:id").put(
    isAuthenticatedUser,authorizeRole("admin"),updateOrder
).delete(isAuthenticatedUser,authorizeRole("admin"),deleteOrder)
module.exports= router;