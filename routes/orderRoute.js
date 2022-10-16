const express = require('express');
const router = express.Router();
const { isLoggedIn, customRole } = require('../middlewares/userMiddleware');
const { createOrder, getLoggedInUserOrders, getOneOrder, adminGetAllOrders } = require('../controllers/orderController');

router.post('/order/create', isLoggedIn, createOrder);
router.get('/myorder', isLoggedIn, getLoggedInUserOrders);
router.get('/order/:id', isLoggedIn, getOneOrder);

//admin routes
router.get('/admin/orders', isLoggedIn, customRole('admin'), adminGetAllOrders);

module.exports = router;