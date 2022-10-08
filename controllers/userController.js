const User = require('../models/User.model');
const createError = require('http-errors');
const cookieTokenRes = require('../utils/cookieTokenRes');

exports.signup = async(req, res, next)=>{
    try {
        const { name, email, password } = req.body;
        if(!name || !email || !password) {
            throw createError.BadRequest('Name, email and password are required');
        }

        const userExists = await User.findOne({ email });
        if(userExists) throw createError.Conflict('User already exists');

        const user = await User.create({ name, email, password });

        cookieTokenRes(user, res);
        
    } catch (error) {
        next(error);
    }
}

exports.login = async(req, res, next)=>{
    try {
        const { email, password } = req.body;
        if(!email || !password) {
            throw createError.BadRequest('Email and password are required');
        }

        const user = await User.findOne({ email });
        if(!user) throw createError.BadRequest('Invalid username/password');

        const passwordMatch = await user.isValidPassword(password);
        if(!passwordMatch) throw createError.BadRequest('Invalid username/password');

        cookieTokenRes(user, res);

    } catch (error) {
        next(error);
    }

}

exports.logout = async(req, res, next)=>{
    try {
        const options = {
            maxAge: 1,
            httpOnly: true
        }

        res.status(200).cookie('token', '', options).json({ success: true, message: 'You have successfully logged out' });

    } catch (error) {
        next(error)
    }
}

exports.getLoggedInUserDetails = async(req, res, next)=>{
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({ success: true, user });
    } catch (error) {
        next(error);
    }
}