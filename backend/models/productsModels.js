const mongoose=require('mongoose');

const productScheme=new mongoose.Schema({

    name:{
        type:String,
        required:[true,"please enter product name"],
        trim:true,
        maxlength:[100,"product name can't exceed 100 characters"]
    },
    price:{
        type:Number,
        default:0.0,
        required:true
    },
    description:{
        type:String,
        required:[true,"plz enter product description"]
    },
    ratings:{
        type:String,
        default:0,

    },
    images:[
              {
                image:{
                    type:String,
                    required:true
                }
              }
            ],
    category:{
        type:String,
        required:[true,"plase enter product catecory"],
        enum:{
            values:[
                'Electronics',
                'Mobile Phones',
                'Laptops',
                'Accessories',
                'Headphones',
                'Food',
                'Books',
                'clothes/shoes',
                'Beauty/Health',
                'Sports',
                'outdoor',
                'Home'
            ],
            message:'plase select correct category'
        }
    } ,
    seller:{
        type:String,
        required:[true,"please enter the product seller"],

    } ,
    stock:{
        type:Number,
        required:[true,"please enter product stock"],
        maxlength:[30,"product stock cannot exceed 30"]
    } ,
    numOfReviews:{
        type:Number,
        default:0
    }  ,
    reviews:[
        {
           user:mongoose.Schema.Types.ObjectId,
            rating:{
                type:String,
                required:true
            },
            comment:{
                type:String,
                required:true
            }


        }
    ],
    user:{
        type:mongoose.Schema.Types.ObjectId,
        default:Date.now()

    },
    createAt:{
        type:Date,
        default:Date.now()
    }
})

let schema=mongoose.model('product',productScheme);
module.exports=schema;