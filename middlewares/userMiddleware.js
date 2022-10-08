const User = require('../models/User.model');
const jwt = require('jsonwebtoken');
const createError = require('http-errors');

exports.isLoggedIn = async(req, res, next)=>{
    try {
        
        const token = req.cookies.token || req.body.token || (req.header('Authorization')? req.header('Authorization').replace('Bearer ', ''): '');
        if(!token) throw createError.Unauthorized('Login first to access this page');

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        let user = await User.findById(decoded.id);

        if(!user) throw createError.Unauthorized('User not authorized');

        user.password = undefined;
        req.user = user;
        next();

    } catch (error) {
        next(error);
    }
}

exports.customRole = (...roles)=>{
    return (req, res, next)=>{
        try {
            if(!roles.includes(req.user.role)) {
                throw createError.Unauthorized('You are not authorized to access this resource')
            }
            next();
        } catch (error) {
            next(error)
        }
    }
}