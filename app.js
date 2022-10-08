const express = require('express');
const app = express();
require('dotenv').config();
const morgan = require('morgan');
const createError = require('http-errors');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');

connectDB();

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

app.use('/api/v1', user);


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