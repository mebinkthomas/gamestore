const mongoose = require('mongoose');
const { categories } = require('../utils/constants');


const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide product name'],
        trim: true,
        maxlength: [200, 'Product name should not be more than 200 characters']
    },
    price:{
        type: Number,
        required: [true, 'Please provide product price'],
        maxlength: [6, 'Product price should not be more than 6 digits']
    },
    description: {
        type: String,
        required: [true, 'Please provide product description'],
        trim: true
    },
    photos: [
        { 
            id:{
                type: String,
                required: true
            },
            secure_url: {
                type: String,
                required: true
            } 
        }
    ],
    category: {
        type: String,
        required: true,
        enum: [categories.action, categories.adventure, categories.racing, categories.Sports]
    },
    brand: {
        type: String,
        required: [true, 'Please add game studio name'],
    },
    ratings: {
        type: Number,
        default: 0
    },
    numberOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user',
                required: true
            },
            name: {
                type: String,
                required: true
            },
            rating: {
                type: Number,
                required: true
            },
            comment: {
                type: String,
                required: true
            }
        }
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }
}, { timestamps: true });

const Product = mongoose.model('product', productSchema);
module.exports = Product;