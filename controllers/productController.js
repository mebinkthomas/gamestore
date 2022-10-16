const cloudinary = require('cloudinary').v2;
const Product = require('../models/Product.model');
const createError = require("http-errors");

exports.addProduct = async(req, res, next)=>{
    try {
        
        //handle images
        let imageArray = [];
        if(!req.files) throw createError(400, 'Images are required');

        if(req.files){
            for(let i =0; i< req.files.photos.length; i++){
                const file = req.files.photos[i];
                let result = await cloudinary.uploader.upload(file.tempFilePath, {folder: 'gamesImages'});
                imageArray.push({
                    id: result.public_id,
                    secure_url: result.secure_url
                });

            }

        }

        req.body.photos = imageArray;
        req.body.user = req.user.id;

        const product = await Product.create(req.body);

        res.status(200).json({success: true, product});

    } catch (error) {
        next(error);
    }

}

exports.getAllProducts = async(req, res, next)=>{
    try {
        
        let search = {};
        if(req.query.game) search.name = { $regex: req.query.game, $options: 'i' }

        const products = await Product.find({...search});
        if(!products) throw createError.NotFound('Game not found');
        res.status(200).json({success: true, products});

    } catch (error) {
        next(error);
    }
}

// get one product
exports.getOneProduct = async(req, res, next)=>{
    try {

        const product = await Product.findById(req.params.productId);
        if(!product) throw createError.NotFound('No product found with this id');

        res.status(200).json({ success: true, product });

    } catch (error) {
        next(error);
    }
}

//add and update review
exports.addReview = async(req, res, next)=>{
    try {
        
        const { rating, comment } = req.body;
        const productId = req.params.productId;

        if(!rating) throw createError(400, 'Please add a rating');

        const review = {
            user: req.user._id,
            name: req.user.name,
            rating: Number(rating),
            comment
        }

        let product = await Product.findById(productId);
        if(!product) throw createError(400, 'No product found with this id');

        const alreadyReviewed = await Product.findOne({ _id: productId, 'reviews.user': {$eq: req.user._id} }).exec();
        
        if(alreadyReviewed){
            const updatedReview = {
                'reviews.$.rating': Number(rating),
                'reviews.$.comment': comment
            }
            product = await Product.findOneAndUpdate({ _id: productId, reviews: { $elemMatch: { user: req.user._id } } },  {$set: updatedReview}, { new: true, runValidators: true, upsert:true });
        }else{
            product.reviews.push(review);
        }

        product.numberOfReviews = product.reviews.length;

        //adjust ratings | finding average
        product.ratings = (product.reviews.reduce((acc, item)=> item.rating + acc, 0) / product.reviews.length);
        await product.save();

        res.status(200).json({ success: true });

    } catch (error) {
        next(error);
    }
}

exports.deleteReview = async(req, res, next)=>{
    try {
        
        const productId = req.params.productId;

        let product = await Product.findById(productId);
        if(!product) throw createError(400, 'No product found with this id');

        const alreadyReviewed = await Product.findOne({ _id: productId, 'reviews.user': {$eq: req.user._id} }).exec();

        if(!alreadyReviewed) throw createError(400, 'No reviews found');

        //delete review
        product = await Product.findOneAndUpdate({_id: productId}, { $pull: { reviews: { user: req.user._id }   } }, { new: true } );

        //update rating and number of reviews
        product.numberOfReviews = product.reviews.length;
        product.ratings = product.reviews.length == 0 ? 0 : (product.reviews.reduce((acc, item)=> item.rating + acc, 0) / product.reviews.length);
        await product.save();

        res.status(200).json({ success: true });


    } catch (error) {
        next(error);
    }
}

//returns only the reviews for one product
exports.getOnlyReviewsForOneProduct = async(req, res, next)=>{
    try {
        
        const productId = req.params.productId;
        let product = await Product.findById(productId);
        if(!product) throw createError(400, 'No product found with this id');

        res.status(200).json({ success: true, reviews: product.reviews });


    } catch (error) {
        next(error);
    }
}

//admin routes
exports.adminGetAllProducts = async(req, res, next)=>{
    try {
        
        const products = await Product.find();

        res.status(200).json({ success: true, products });

    } catch (error) {
        next(error);
    }
}


exports.adminUpdateOneProduct = async(req, res, next)=>{
    try {
        
        let product = await Product.findById(req.params.productId);
        if(!product) throw createError(400, 'No product found with this id');

        if(!req.body) throw createError.BadRequest('Please provide data to update');

        let imagesArray = [];
        if(req.files){

            //destroy the existing images
            for(let i = 0; i<product.photos.length; i++){
                const photo = product.photos[i];
                const result = await cloudinary.uploader.destroy(photo.id);

            }

            //upload and save the images
            for(let i =0; i< req.files.photos.length; i++){
                const file = req.files.photos[i];
                let result = await cloudinary.uploader.upload(file.tempFilePath, {folder: 'gamesImages'});
                imagesArray.push({
                    id: result.public_id,
                    secure_url: result.secure_url
                });

            }

            //update request.body after uploading images
            req.body.photos = imagesArray;

        }

        
        product = await Product.findByIdAndUpdate(req.params.productId, req.body, { new: true, runValidators: true });
        res.status(200).json({ success: true, product });

    } catch (error) {
        next(error);
    }
}

exports.adminDeleteOneProduct = async(req, res, next)=>{
    try {
        
        let product = await Product.findById(req.params.productId);
        if(!product) throw createError(400, 'No product found with this id');

        for(let i = 0; i<product.photos.length; i++){
            const photo = product.photos[i];
            await cloudinary.uploader.destroy(photo.id);

        }

        await product.remove();

        res.status(200).json({ success: true, message: "Product was deleted !" });

    } catch (error) {
        next(error);
    }
}