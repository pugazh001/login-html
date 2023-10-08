const express=require('express');
const { getProdect, newProduct, getSingleProduct, updateProducts, 
    deleteProduct, createReview, getReviews, deleteReview } = require('../controllers/productControllers');

const router=express.Router();
const{ isAuthenticatedUser,authorzeRoles}=require('../middlewares/authenticate')

router.route('/products').get(getProdect);

router.route('/product/:id') 
                           .get(getSingleProduct)
                           .put(updateProducts)
                           .delete(deleteProduct);

router.route('/review').put(isAuthenticatedUser,createReview);      
router.route('/reviews').get(getReviews);    
router.route('/reviews').delete(deleteReview)              

//Admin - routes

router.route('admin/products/new').post(isAuthenticatedUser,authorzeRoles('admin'),newProduct);

module.exports=router