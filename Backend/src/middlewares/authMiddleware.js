const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');
const customError = require('../utils/customError');
const cacheClient = require('../services/cache.services/cache.service');

const authMiddleware=async (req,res,next)=>{
    const token = req.cookies.jwt || req.headers.authorization?.split(" ")[1];
    
    try {
        console.log("token",token);
        if(!token){
            return next(new customError("Unauthorized access",401))
        }

        const isblackListToken= await cacheClient.get(token)
        if(isblackListToken){
            console.log("blacklist token",isblackListToken);
            return next(new customError("token blacklisted",401));
        }

        const decoded=jwt.verify(token,process.env.JWT_SECRET_KEY);
        console.log(decoded);
        const user = await userModel.findById(decoded.id);
        if(!user){
            return next(new customError("Unauthorized access",401));
        }
        req.user=user;
        next();
        
    } catch (error) {
        return next(new customError(error.message,404));
    }
}

module.exports=authMiddleware;