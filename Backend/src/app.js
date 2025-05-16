const express = require('express');
const app= express()
const cors = require('cors');
const cookieParser = require('cookie-parser');
const userRoutes = require('../src/routes/user.routes/user.routes.js');


app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())


app.use('/api/auth', userRoutes);

module.exports = app;