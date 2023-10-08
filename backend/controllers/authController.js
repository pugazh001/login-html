const { now } = require('mongoose');
const catchAsyncError=require('../middlewares/catchAsyncError');
const User=require('../models/userModels');
const ErrorHandler=require('../Utils/errorHandler')
const sendToken=require('../Utils/jwt');
const error = require('../middlewares/error');
const sendEmail = require('../Utils/email');
const crypto=require('crypto');

//register User-/api/v1/register

exports.registerUser=catchAsyncError(async (req,res,next)=>{
    const{name,email,password,avatar}=req.body
    const user=await User.create({
        name,
        email,
        password,
        avatar
    });
      //json web token    
  /*  const token=user.getJwtToken();
    res.status(201).json({
        success:true,
        user,
        token
    })
    */
    sendToken(user,201,res)
});
//login user-/api/v1/login
exports.loginUser=catchAsyncError(async (req,res,next)=>{
      const{email,password}=req.body

      if(!email || !password){
        return next(new ErrorHandler('please enter email & password',400))
      }
      //finding the user form database

     const user=await  User.findOne({email}).select('+password')

     if(!user){
        return next(new ErrorHandler('Invalid email or Password',401))
     }

     if(!await user.isValidPassword(password)){
        return next(new ErrorHandler('Invalid email or Password',401))
    }
     

     sendToken(user,201,res)
}
)

//logout API-/api/v1/logout

exports.logoutUser=(req,res,next)=>{
       res.cookie('token',null,{
        expires:new Date(Date.now()),
        httpOnly:true
       })
       .status(200)
       .json({
        success:true,
        message:"loggedOut"
       })
}

//forgot password =/api/v1/forgot
exports.forgotPassword=catchAsyncError(async (req,res,next)=>{
  const user=await User.findOne({email:req.body.email});

  if(!user){
    return next(new ErrorHandler('User Not found this email',404))
  }

  const resetToken=user.getResetToken();
  await user.save({validateBeforeSave:false})
   
  //create reset url

  const resetUrl=`${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`

  const message=`your password reset url is a follow \n\n
  ${resetUrl}\n\n if you have not requested this email, then ingnore it`

  try{

    sendEmail({
      email:user.email,
      subject:"2Pcart password recovery",
      message
    })

    res.status(200).json({
      success:true,
      message:`Email sent to ${user.email}`
    })

  }catch(err){

    user.resetPasswordToken=undefined;
    user.resetPasswordTokenExpire=undefined;

    await user.save({validateBeforeSave:false});

    return next(new ErrorHandler(error.message),500)

  }
})

//reset password-/api/v1/reset/:token

exports.resetPassword=catchAsyncError(async (req,res,next)=>{

  const resetPasswordToken=crypto.createHash('sha256').update(req.params.token).digest('hex')

  const user=await User.findOne({
    resetPasswordToken,
    resetPasswordTokenExpire:{
      $gt:Date.now()
    }
  })

  if(!user){
    return next(new ErrorHandler('password reset token is invalid or expired'))
  }

  if(req.body.password !== req.body.confirmPassword){
    return next(new ErrorHandler('password does not match'))
  }

  user.password=req.body.password;
  user.resetPasswordToken=undefined;
  user.resetPasswordTokenExpire=undefined;

  await user.save({validateBeforeSave:false})

  sendToken(user,201,res)
});


//Get User Profile-/api/v1/myprofile

exports.getUerProfile=catchAsyncError(async (req,res,next)=>{
  const user=await User.findById(req.user.id)
    
  res.status(200).json({
    success:true,
    user
  })
});

//change password -- {{base_url}}/api/v1/password/change

exports.changePasswords = catchAsyncError(async (req,res,next)=>{
  const user=await User.findById(req.user.id).select('+password');
    
     //check old password
     if(!await user.isValidPassword(req.body.oldPassword)){
       return next(new ErrorHandler('Old password is incorrect',401))
     }

     //assigning new password

     user.password=req.body.oldPassword;

     await user.save();
     res.status(200).json({
      success:true,
      
     })
     
});

//Update Profile

exports.updateProfile = catchAsyncError(async (req,res,next)=>{
   
  const newUserData={

    name:req.body.name,
    email:req.body.email
  }

  const user= await User.findByIdAndUpdate(req.user.id,newUserData,{
       new:true,
       runValidators:true
    })

    res.status(200).json({
      success:true,
      user
    })


})

//admin :Get All user  -{{base_url}}/api/v1/admin/users
 
exports.getAllusers=catchAsyncError(async (req,res,next)=>{
 const user= await User.find();

 res.status(200).json({
    success:true,
    user
 })
})

 //Admin :get Specific User -{{base_url}}/api/v1/admin/users/650a3ed058718910c93c698a

 exports.getUser=catchAsyncError(async (req,res,next)=>{
   const user = await User.findById(req.params.id)
    
   if(!user){
     return next(new ErrorHandler(`User not Found with this id ${req.params.id}`,400))
   }

   res.status(200).json({
    success:true,
    user
 })

  });

  //Admin : Update User -{{base_url}}/api/v1/admin/users/650a3ed058718910c93c698a

  exports.updateUser=catchAsyncError(async (req,res,next)=>{
    const newUserData={
 
      name:req.body.name,
      email:req.body.email,
      role:req.body.role
    }
  
    const user= await User.findByIdAndUpdate(req.user.id,newUserData,{
         new:true,
         runValidators:true
      })
  
      res.status(200).json({
        success:true,
        user
      })
  });

  //Admoin : Delete User

  exports.deleteUser=catchAsyncError(async(req,res,next)=>{
    const user=await User.findById(req.params.id);

    if(!user){
      return next(new ErrorHandler(`User not Found with this id ${req.params.id}`,400))
    }

    await user.deleteOne()
 
    res.status(200).json({
     success:true,
     user

    
  })
})