const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app= require('./src/app.js');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3000;
const connectDB=require('./src/config/db.config/db.config.js')
connectDB()



app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


