const ErrorHandler = require('../Utils/errorHandler');
const catchAsyncError=require('../middlewares/catchAsyncError');
const Order=require('../models/orderModels');
const Product=require('../models/productsModels')


// Create new Order - api/vi/order/new

exports.newOrder=catchAsyncError(async (req,res,next)=>{
    const{
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo
    }=req.body;

    const order=await Order.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        paidAt:Date.now(),
        user:req.user.id
    })
      
    res.status(200).json({
        success:true,
        order
    })


})

//Get Single Order - api/v1/order/:id

exports.getSingleOrder=catchAsyncError(async (req,res,next)=>{
    const order=await Order.findById(req.params.id).populate('user','name email');

    if(!order){
        return next(new ErrorHandler(`order not found with this id:${req.params.id}`,404))
    }

    res.status(200).json({
        success:true,
        order
    })
});

//Get Logged User Orders or myorders - /api/v1/myorders

exports.myOrders=catchAsyncError(async (req,res,next)=>{
    const orders=await Order.find({user:req.user.id}).populate('user','name email');

   

    res.status(200).json({
        success:true,
        orders
    })
});

// Admin : Get All Orders - api/v1/orders

exports.orders=catchAsyncError(async (req,res,next)=>{
    const orders=await Order.find();

    let totalAmount=0;

   orders.forEach(order => {
     
      totalAmount += order.totalPrice;
    
   });
   

    res.status(200).json({
        success:true,
        totalAmount,
        orders
    })
});

//Update Order or order status - apoi/v1/order/:id

exports.updateOrder=catchAsyncError(async (req,res,next)=>{
    const order=await Order.findById(req.params.id);

    if(order.orderStatus == 'Delivered'){
        return next(new ErrorHandler('Order Has been already Deliverd',400))
    }
   //Updating the product stock of for each order Item
    order.orderItems.forEach(async orderItem =>{

        await updateStock(orderItem.product,orderItem.quantity)

    })

    order.orderStatus=req.body.orderStatus;
    order.deleveredAt=Date.now();
    await order.save();

    res.status(200).json({
        success:true
    })
});

async function updateStock(productId,quantity){
    const product=await Product.findById(productId);
    product.stock=product.stock-quantity;
    product.save({validateBeforeSave:false});
}

// Admin : Delete Order -api/V1/order/:id

exports.deleteOrder=catchAsyncError(async (req,res,next)=>{

    const order=await Order.findById(req.params.id);
    
    if(!order){
        return next(new ErrorHandler(`order not found with this id:${req.params.id}`,404))
    }

    await order.remove();

    res.status(200).json({
        success:true
    })

});






