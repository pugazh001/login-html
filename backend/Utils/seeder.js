const products=require('../data/products.json');
const Product=require('../models/productsModels');
const dotenv=require('dotenv');
const connectDatabase=require('../config/database')

dotenv.config({path:'backend/config/config.env'});
connectDatabase();



const seedProducts=async ()=>{
    try{
    await Product.deleteMany();
    console.log("deleted");
     await Product.insertMany(products);
     console.log('all product order');
    }catch(err){
        console.log(err.message);
    }
    process.exit();
}

seedProducts()