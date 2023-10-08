const mongoose=require('mongoose');
const validator=require('validator');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const crypto=require('crypto');

const userScheme=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'please enter the name']
    },
    email:{
        type:String,
        required:[true,'please enter the email'],
        unique:true,
       validate:[validator.isEmail,"please Enter the valid Email"]


    },
    password:{
        type:String,
        required:[true,"please enter the name"],
        maxlength:[6,"password xon not exceeds 6 character"],
        select:false //password donot take other place 
    },
    avatar:{
        type:String,
        required:true
    },
    role:{
        type:String,
        default:'user'
    },
    resetPasswordToken:String,
    resetPasswordTokenExpire:Date,

    createAt:{
        type:Date,
        default:Date.now   }
})
//  Hashing password

userScheme.pre('save',async function(next){
    if(!this.isModified('password')){
        next()
    }
    this.password=await bcrypt.hash(this.password,10)
})


//generate json web token
userScheme.methods.getJwtToken=function(){
  return  jwt.sign({id:this.id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES_TIME
    })
}
//creatin login api
userScheme.methods.isValidPassword=async function(enterdPassword){

  return  await bcrypt.compare(enterdPassword,this.password)
}
//forgot password

userScheme.methods.getResetToken=function(){
    //generate token

    const token=crypto.randomBytes(20).toString('hex');
  //generate hash and set to the resetPassword
  this.resetPasswordToken=  crypto.createHash('sha256').update(token).digest('hex');

  //set token expire time

  this.resetPasswordTokenExpire=Date.now()+ 30 * 60 * 1000
  
  return token
}


let model =mongoose.model('User',userScheme);

module.exports=model;
