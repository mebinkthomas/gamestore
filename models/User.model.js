const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { roles } = require('../utils/constants');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        maxlength: [50, 'Name should be under 50 characters'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        validate: [validator.isEmail, 'Please provide a valid email'],
        lowercase: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minLength: [6, 'Password should be atleast 6 characters'],
        trim: true
    },
    role: {
        type: String,
        enum: [roles.user, roles.manager, roles.admin],
        default: roles.user
    },
    photo: {
        id: {
            type: String,
        },
        secure_url: {
            type: String,
        }
    },


}, { timestamps: true });


userSchema.pre('save', async function(next){
    try {
        if(!this.isModified('password')){
            return next();
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword;

        if(this.email === process.env.ADMIN_EMAIL.toLocaleLowerCase()){
            this.role = roles.admin;
        }

    } catch (error) {
        next(error);
    }
});

userSchema.methods.isValidPassword = async function(passwordToCompare){
    try {
        
        return await bcrypt.compare(passwordToCompare, this.password);

    } catch (error) {
        throw error;
    }
}

userSchema.methods.getJwtToken = function(){
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY });
}

const User = mongoose.model('User', userSchema);
module.exports = User;

