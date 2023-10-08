const express=require('express');
const app=express();
const  errorMiddlewares=require('./middlewares/error');
const cookieParser=require('cookie-parser')


app.use(express.json());//accept the json req
app.use(cookieParser())



const products=require('./routes/product');
const auth=require('./routes/auth');
const order=require('./routes/order');

app.use('/api/v1/',products);
app.use('/api/v1/',auth);
app.use('/api/v1/',order)


app.use(errorMiddlewares)


module.exports=app;