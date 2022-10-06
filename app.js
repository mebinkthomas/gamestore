const express = require('express');
const app = express();
require('dotenv').config();
const morgan = require('morgan');
const createError = require('http-errors');

app.use(morgan('dev'));

app.get('/', async(req, res)=>{
    res.status(200).send('home page');
});


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