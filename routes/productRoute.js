const express = require('express');
const router = express.Router();
const { isLoggedIn, customRole } = require('../middlewares/userMiddleware');
const { addProduct, adminGetAllProducts, 
        adminUpdateOneProduct, adminDeleteOneProduct,
        getAllProducts, getOneProduct, addReview,
        deleteReview, getOnlyReviewsForOneProduct } = require('../controllers/productController');

//user routes
router.get('/products', getAllProducts);
router.get('/product/:productId', getOneProduct);
router.put('/product/review/:productId', isLoggedIn, addReview);
router.delete('/product/review/:productId', isLoggedIn, deleteReview);
router.get('/product/review/:productId', getOnlyReviewsForOneProduct);

//admin routes
router.post('/admin/product/add', isLoggedIn, customRole('admin'),addProduct);
router.get('/admin/products', isLoggedIn, customRole('admin'), adminGetAllProducts);
router.put('/admin/product/:productId', isLoggedIn, customRole('admin'), adminUpdateOneProduct);
router.delete('/admin/product/:productId', isLoggedIn, customRole('admin'), adminDeleteOneProduct);


module.exports = router;