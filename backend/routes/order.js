const express=require('express');
const { newOrder, getSingleOrder, myOrders, orders, updateOrder, deleteOrder } = require('../controllers/orderController');
const router=express.Router();
const {isAuthenticatedUser, authorzeRoles}=require('../middlewares/authenticate')

router.route('/order/new').post(isAuthenticatedUser,newOrder);
router.route('/order/:id').get(isAuthenticatedUser,getSingleOrder);
router.route('/myorders').get(isAuthenticatedUser,myOrders);

//Admin Routers

router.route('/orders').get(isAuthenticatedUser,authorzeRoles('admin'),orders);
router.route('/order/:id').put(isAuthenticatedUser,authorzeRoles('admin'),updateOrder);
router.route('/order/:id').delete(isAuthenticatedUser,authorzeRoles('admin'),deleteOrder);

module.exports=router;