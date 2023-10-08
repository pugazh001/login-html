
const { param } = require('../app');
const Product=require('../models/productsModels')
const ErrorHandler=require('../Utils/errorHandler')
const catchAsyncError=require('../middlewares/catchAsyncError');
const APIFeatures=require('../Utils/apiFeatures')



//Get Products - API URL {{base_url}}/api/v1/products


exports.getProdect=async (req,res,next) => {
    const resPerPage=3;
    const apiFeatures=new APIFeatures(Product.find(),req.query).search().filter().paginate(resPerPage)  //search products
    const products=await  apiFeatures.query; //  Product.find();
    await new Promise(resolve=>setTimeout(resolve,1000))
    //return next(new ErrorHandler('unable to send Products',400))
    res.status(200).json({
        success:true,
        count:products.length,
       products
    })

}
//Create Products - API URL {{base_url}}/api/v1/products/new
exports.newProduct=catchAsyncError(async (req,res,next)=>{


    req.body.user=req.user.id;
  const product =  await Product.create(req.body);
    
  res.status(201).json({
    success:true,
    product
  })
      
});
//Get single Product = API Url {{base_url}}/api/v1/product/:id


exports.getSingleProduct=async (req,res,next)=>{
  
   const product=await  Product.findById(req.params.id);

   if(!product){
      return  next(new ErrorHandler('Product not Found ',400));

   }
    res.status(201).json({
        success:true,
        product
    })


}


//Update products = API Url {{base_url}}/api/v1/product/:id

exports.updateProducts=async (req,res,next)=>{
    let product=await Product.findById(req.params.id);

    if(!product){
        return res.status(404).json({
         success:false,
         message:"Product Not a Found"
        });
 
    }
      product=await  Product.findByIdAndUpdate(req.params.id, req.body,{
                new:true ,//update product value
                runValidators:true
        })
        res.status(200).json({
            success:true,
            product
        })
    
}
//Delete Product-API Url {{base_url}}/api/v1/product/:id

exports.deleteProduct=async(req,res,next)=>{
    const product=await Product.findById(req.params.id);

    if(!product){
        return res.status(404).json({
         success:false,
         message:"Product Not a Found"
        });
 
    }

    await product.deleteOne();

    res.status(200).json({
        success:true,
        message:"product deleted"
    })
}

//create Review -api/v1/review

exports.createReview=catchAsyncError(async (req,res,next)=>{
    const {productId,rating,comment}=req.body

    const review={
        user:req.user.id,
        rating,
        comment
    }

    const product=await Product.findById(productId);

    //finding user already has review exists
    const isReviewed=product.reviews.find(review =>{
        return review.user.toString() == req.user.id.toString()
    })
    if(isReviewed){
        //updating review 
        product.reviews.forEach(review=>{
           if(review.user.toString()==req.user.id.toString()){
             
            review.comment=comment,
            review.rating=rating
           }
        })

    }
    else{
        //creating review
        product.reviews.push(review);
        product.numOfReviews=product.reviews.length;
    }
       //find the average of the product review
    product.ratings=product.reviews.reduce((acc,review)=>{

        return review.rating+acc;
    },0)/product.reviews.length;
    product.ratings=isNaN(product.ratings)?0:product.ratings;

    await product.save({validateBeforeSave:false});

    res.status(200).json({
        success:true
    })
})

//Get Reviews - api/v1/reviews?id

exports.getReviews=catchAsyncError(async (req,res,next)=>{

    const product=await Product.findById(req.query.id)
         
    res.status(200).json({
        success:true,
        reviews:product.reviews
    })
});

//Delete Reviews -api/v1/review
exports.deleteReview=catchAsyncError(async (req,res,next)=>{

    const product=await Product.findById(req.query.productId);
//filtering the reviews which does match the deleting review id
    const reviews=product.reviews.filter(review=>{
        return review._id.toString() !== req.query.id.toString()
    });
    //number of reviews
    const numOfReviews=reviews.length;
    //finding the average with filtred reviews
    let ratings=reviews.reduce((acc,review)=>{

        return review.rating+acc;
    },0)/reviews.length;

    ratings=isNaN(ratings)?0:ratings;

    //save the product data documents
    await Product.findByIdAndUpdate(req.query.productId,{

        reviews,
        numOfReviews,
        ratings

    })
    res.status(200).json({
        success:true
    })
})