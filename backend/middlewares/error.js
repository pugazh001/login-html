const ErrorHandler = require("../Utils/errorHandler");

module.exports=(err,req,res,next)=>{
    err.statuscode = err.statuscode || 500;

//development environment
      if(process.env.NODE_ENV == 'development'){
    res.status(err.statuscode).json({
        success:false,
        message:err.message,
        stack:err.stack,
        error:err
    })
}   //production environment
if(process.env.NODE_ENV == "production"){

    let message=err.message;
    let error=new Error(message);
    if(err.name=="ValidationError"){

        message=Object.values(err.errors).map(value=>value.message);
        error=new Error(message)
        err.statuscode=400

    }
    if(err.name=="CastError"){
        message=`Resorce not a Found ${err.path}`;
        error=new Error(message)
        err.statuscode=400

    }
    if(err.code ==1100){
        let message=`Duplicate ${Object.keys(err.keyValue)} error`
        error=new Error(message)
        err.statuscode=400
    }
    if(err.name =='JSONWebTokenError'){
        let message=`JSON web token is invalid...Try Again`;
        error=new Error(message)
        err.statuscode=400
    }
    if(err.name =='TokenExpiredError'){
        let message=`JSON web token is Expired...Try Again`;
        error=new Error(message)
        err.statuscode=400
    }

    res.status(err.statuscode).json({
        success:false,
        message:error.message || "Internal Server Error"
       
    })
}
}