const mongoose = require('mongoose');
const bcrypt=require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    domainPreference: {
        type: String,
    },
    quizeHistory:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'QuizAttempt'
    },
    codingHistory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CodingAttempt'
    },
    streak:{
        type:Date,
    },
    reminders:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Reminder'
    },
    badges:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Badge'
    },
    Heatmap:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Heatmap'
    },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

userSchema.methods.generateAuthToken=async function(){
    const token = jwt.sign({id:this._id},process.env.JWT_SECRET_KEY,{
        expiresIn:"1hr"
    })
    if(!token){
        throw new Error("token not generated")
    }
    return token;
}

userSchema.statics.authenticateUser=async function(email,password){
    const user = await this.findOne({email});
    if(!user){
        throw new Error("user not found");
    }

    const isMatch=await bcrypt.compare(password,user.password);
    if(!isMatch){
        throw new Error("userName or password is incorrect");
    }
    return user;
}

const User = mongoose.model('User', userSchema);
module.exports = User;