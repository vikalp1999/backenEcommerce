const express= require("express");

const { registerUser, loginUser, logout, forgotPassword, getUserDetails, updateUserDetails, updateUserProfile, getAlluser, getSingleuser, updateUserRole, deleteUser } = require("../controller/userController");
const { isAuthenticatedUser, authorizeRole } = require("../middleware/Auth");
const router= express.Router();


router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/password/forgot").post(forgotPassword)
router.route("/logout").get(logout)
router.route("/me").get(isAuthenticatedUser,getUserDetails)
router.route("/password/update").put(isAuthenticatedUser,updateUserDetails)
router.route("/me/update").put(isAuthenticatedUser,updateUserProfile)
router.route("/admin/users").get(isAuthenticatedUser,authorizeRole("admin"),getAlluser)
router.route("/admin/user/:id").get(isAuthenticatedUser,authorizeRole("admin"),getSingleuser).put(
    isAuthenticatedUser,authorizeRole("admin"),updateUserRole 
).delete(isAuthenticatedUser,authorizeRole("admin"),deleteUser)
module.exports = router;


