const express = require('express');
const app = express();
require('dotenv').config();
const morgan = require('morgan');
const createError = require('http-errors');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const cloudinary = require('cloudinary');

connectDB();

//cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/"
}));

app.get('/', async(req, res)=>{
    res.status(200).send('API for gamestore');
});

const user = require('./routes/userRoute');
const product = require('./routes/productRoute');

app.use('/api/v1', user);
app.use('/api/v1', product);


app.use(async(req, res, next)=>{
    next(createError.NotFound());
});

app.use((err, req, res, next)=>{
    res.status(err.status || 500);
    res.send({ 
        status: err.status || 500,
        message: err.message  
    });
});

module.exports = app;