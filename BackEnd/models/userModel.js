const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt=require("bcryptjs")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")
const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please Enter your name"]
    },
    email:{
        type:String,
        required:[true,"Please Enter your email"],
        unique:true,
        validate:[validator.isEmail,"Pleases enter your Email"]
    },
    password:{
        type:String,
        required:[true,"Please Enter your Password"],
        unique:true,
        minLength:[8,"password should be greater then 8 charcters"],
    },
   avatar:
        {public_id:{
            type:String,
            required:true
        },
       url:{
            type:String,
            required:true
        }
    },
    role:{
        type:String,
        default:"user"
    },
    role:{
        type:String,
        default:"user",
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date,
    
})

userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
   next();
    }
   
    this.password= await bcrypt.hash(this.password, 10)
})
// JWT Token
userSchema.methods.getJWTTOKEN=function (){
     return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE,
     })
}

//compare Password
userSchema.methods.comparePassword= async function(enterPassword){
    return await bcrypt.compare(enterPassword,this.password);

}
//generating password reset Token
userSchema.methods.getResetPasswordToken=function (){
    //Generating Token
    const resetToken= crypto.randomBytes(20).toString("hex");

    //hashing and add to userSchema
    this.resetPasswordToken=crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpire= Date.now()+15*60*1000;

    return resetToken;
}



module.exports=mongoose.model("User",userSchema)

