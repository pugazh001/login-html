const express=require("express");
const { registerUser,
     loginUser, 
     logoutUser,
      forgotPassword,
       resetPassword, getUerProfile, 
       changePasswords, updateProfile,
        getAllusers, getUser, updateUser, deleteUser } = require("../controllers/authController");
const { isAuthenticatedUser, authorzeRoles } = require("../middlewares/authenticate");

const router=express.Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').get(logoutUser);
router.route('/password/forgot').post(forgotPassword);
router.route('/password/reset/:token').post(resetPassword);
router.route('/myprofile').get(isAuthenticatedUser,getUerProfile);
router.route('/password/change').put(isAuthenticatedUser,changePasswords);
router.route('/update').put(isAuthenticatedUser,updateProfile);

//Admin routers

router.route('/admin/users').get(isAuthenticatedUser,authorzeRoles('admin'),getAllusers);
router.route('/admin/users/:id').get(isAuthenticatedUser,authorzeRoles('admin'),getUser)
                                .put(isAuthenticatedUser,authorzeRoles('admin'),updateUser)
                                .delete(isAuthenticatedUser,authorzeRoles('admin'),deleteUser)

module.exports=router;