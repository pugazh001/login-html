const mongoose=require('mongoose');

const connectDatabase=()=>{
    mongoose.connect(process.env.DB_LOCAL_URL,{ 
        useNewUrlParser:true,  
        useUnifiedTopology:true 

    }).then(con=>{
        console.log(`connect mongosh to the host ${con.connection.host}`);
    })
};
module.exports=connectDatabase;