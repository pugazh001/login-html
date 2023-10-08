const app=require('./app');
const dotenv=require('dotenv');

const path=require('path');
const connectDatabase = require('./config/database');


dotenv.config({path:path.join(__dirname,"config/config.env")});

connectDatabase();

const server=app.listen(process.env.PORT,()=>{
    console.log(`server port 8000 ${process.env.PORT} in ${process.env.NODE_ENV}`);
});
process.on('unhandledRejection',(err)=>{
    console.log(`error ${err.message}`);
    console.log(`shutting down the server to unhandledRejection error`);
      server.close(()=>{
        process.exit(1)
      })
})



process.on('uncaughtException',(err)=>{
    console.log(`error ${err.message}`);
    console.log(`shutting down the server to uncaughtException error`);
      server.close(()=>{
        process.exit(1)
      })

})
//console.log(a);
