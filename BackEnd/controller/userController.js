const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler=require("../utils/errorhandler")
const User= require("../models/userModel");
const sendtoken = require("../utils/jwtToken");
const sendEmail= require("../utils/sendEmail");
const sendToken = require("../utils/jwtToken");
const cloudinary= require("cloudinary")
// Register a user
exports.registerUser= catchAsyncError(async(req,res,next)=>{
    // const myCloud=await cloudinary.v2.uploader.upload(req.body.avatar,{
    //     folder:"avatars",
    //     width:150,
    //     crop:"scale",
    // })
     const {name,email,password}=req.body;
     const user = await User.create({
        name,email,password,
        avatar:{
            public_id:"sample_id",
            url:"sample",
        }
     });
     sendtoken(user,201,res)

})

//Login User
exports.loginUser= catchAsyncError(async(req,res,next)=>{
    const {email,password}= req.body;
    // checking if user has given password and email both
    if(!email||!password){
        return next(new ErrorHandler("Please Enter Email & Password",400))
    }
    const user= await User.findOne({email}).populate(["password"]);
    if(!user){
        return next(new ErrorHandler("Invalid email or password"));
    }
    const isPasswordMatched= await  user.comparePassword(password);
    
    if(!isPasswordMatched){
       return next(new ErrorHandler("Invalid email or password",401));
    }
   sendtoken(user,200,res)
})

// Logout user 
exports.logout= catchAsyncError(async(req,res,next)=>{
    res.cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly:true,
    });
    res.status(200).json({
        success:true,
        message:"Logout Out"
    })
})

// Forgot Password
exports.forgotPassword =catchAsyncError(async(req,res,next)=>{
    const user =await User.findOne({email:req.body.email});
    if(!user){
        return next(new ErrorHandler("User not found",404));
    }

    //get Reset Password Token 
   const resetToken= user.getResetPasswordToken();

   await user.save({validateBeforeSave:false});


   const resetPasswordUrl=`${req.protocol}//${req.get("host")}/api/v/password/reset/${resetToken}`;
   const message=`your password reset token is :-\n\n${resetPasswordUrl} \n\n if you have not requested this email then,please ignore it`;

   try{
      await sendEmail({
       email:user.email,
       subject:`vikalp rakesh anirban company Password Recovery`,
       message,
      });
      res.status(200).json({
        success:true,
        message:`Email sent to ${user.email} successfully`
      })
   }
   catch(e){
    user.resetPasswordToken=undefined;
    user.resetPasswordExpire=undefined;

    await user.save({ validateBeforeSave:false});
    return next(new ErrorHandler(e.message,500))
   }
});

// get User Detail
exports.getUserDetails=catchAsyncError(async(req,res,next)=>{
    const user= await User.findById(req.user.id);
    res.status(200).json({
        success:true,
        user,
    })
})
// update User password
exports.updateUserDetails=catchAsyncError(async(req,res,next)=>{
    const user= await User.findById(req.user.id).select("+password");
    const isPasswordMatched= await user.comparePassword(req.body.oldpassword);
    
    if(!isPasswordMatched){
       return next(new ErrorHandler("Old password is incorrect",400));
    }
    if(req.body.newPassword !==req.body.confrimPassword){
        return next(new ErrorHandler("password doe not matched",401));
     }

     user.password= req.body.newPassword;
     await user.save()

    sendToken(user,200,res)
})

//update profile
exports.updateUserProfile=catchAsyncError(async(req,res,next)=>{
   
    const newUserData={
        name:req.body.name,
        email:req.body.email,
    }
    //we will add cloudnary later
    const user=await User.findByIdAndUpdate(req.user.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false,
    })
    res.status(200).json(
        {success:true}
    )
})

// get all users (admin)
exports.getAlluser=catchAsyncError(async(req,res,next)=>{
    const users= await User.find();
    res.status(200).json({
        success:true,
        users,
    });

})

// get single user (admin)
exports.getSingleuser=catchAsyncError(async(req,res,next)=>{
    const user= await User.findById(req.params.id);
    if(!user){
        return next(new ErrorHandler(`user does not exit with id:${req.params.id}`))
    }
    res.status(200).json({
        success:true,
        user,
    });

})
// we will update user role
exports.updateUserRole=catchAsyncError(async(req,res,next)=>{
   
    const newUserData={
        name:req.body.name,
        email:req.body.email,
        role:req.body.role,
    }
    //we will add cloudnary later
    const user=await User.findByIdAndUpdate(req.user.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false,
    })
    res.status(200).json(
        {success:true}
    )
})
// delete user
exports.deleteUser=catchAsyncError(async(req,res,next)=>{
   
    const user= await User.findById(req.params.id);
    if(!user){
        return next(new ErrorHandler(`user does not exist with id:${req.params.id}`))
    }
    await user.remove();
    res.status(200).json(
        {success:true,
            message:"User Deleted sucessfully"
        }
    )
})