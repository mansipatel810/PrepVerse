const userModel = require('../../models/user.model');
const customError = require('../../utils/customError');
const cacheClient=require('../../services/cache.services/cache.service')


const userRegister=async(req,res,next)=>{
   try {
     const{userName,email,password}=req.body;
    if(!userName || !email || !password){
        return res.send("please provide all the fields");
    }

    const existingUser= await userModel.find({email});
    console.log(existingUser);
    if(existingUser.length>0){
        return next(new customError("user already exists",400));
    }


    const newUser= await userModel.create({
        userName,
        email,
        password
    });

    const token= await newUser.generateAuthToken();
    res.cookie("jwt",token,{
        // expires:new Date(Date.now()+ 3*24*60*60*1000),
        httpOnly:true,
        secure:true,
        sameSite:"none"
    });

    res.status(201).json({
        success:true,
        message:"user registered successfully",
        token,
        data:newUser
    });
   } catch (error) {
      return next(new customError(error.message,500));
   }
}

const userLogin=async(req,res,next)=>{
    try {
        const {email,password}=req.body;
        if(!email || !password){
            return res.send("please provide all the fields");
        }
    
        const existingUser= await userModel.authenticateUser(email,password);

        const token= await existingUser.generateAuthToken();               

        res.cookie("jwt",token,{
            // expires:new Date(Date.now()+ 3*24*60*60*1000),
            httpOnly:true,
            secure:true,
            sameSite:"none"
        });
    
        res.status(200).json({
            success:true,
            message:"user logged in successfully",
            token,
            data:existingUser
        });
    } catch (error) {
       return next(new customError(error.message,500));
    }
}

const userLogout=async(req,res,next)=>{
    try {
        const token= req.cookies.jwt;
        if(!token){
            return next(new customError("user not logged in",400));
        }

        const blackListToken=await cacheClient.set(
            token,
            "blacklisted",
            "EX",
            3600 //(ye 1hr isliye kyunki token apne aap 1 hr ke baad expire ho jayegi humne login ke time 1hr expiration time diya hai)
        ) 

        res.clearCookie("jwt");
        res.status(200).json({
            success:true,
            message:"user logged out successfully"
        });
    } catch (error) {
       return next(new customError(error.message,500));
    }
}

const currentUser = async (req,res,next)=>{
    try {
        const user = req.user;
        res.status(200).json({
            status:true,
            message:"user found successfully",
            data:user
        })
    } catch (error) {
        return next(new customError(error.message,400));
    }
}

module.exports={
    userRegister,
    userLogin,
    userLogout,
    currentUser
}

