const Order = require('../models/Order.model');
const createError = require('http-errors');

exports.createOrder = async(req, res, next)=>{
    try {
        const { orderItems } = req.body;
        if(!orderItems) throw createError(400, 'Orders required');
        const order = await Order.create({
            orderItems,
            user: req.user.id
        });
        res.status(200).json({ success: true, order });
    } catch (error) {
        next(error);        
    }
}

exports.getLoggedInUserOrders = async(req, res, next)=>{
    try {
        const orders = await Order.find({ user: req.user._id }).populate('user', ['name', 'email']);
        if(!orders) throw createError.NotFound('No orders found');
        res.status(200).json({ success: true, orders });
    } catch (error) {
        next(error);
    }
}

exports.getOneOrder = async(req, res, next)=>{
    try {
        
        const order = await Order.findById(req.params.id).populate('user', ['name', 'email']);
        if(!order) throw createError(400, 'Please check order id')

        res.status(200).json({ success: true, order });

    } catch (error) {
        next(error);
    }
}

//admin controllers
exports.adminGetAllOrders = async(req, res, next)=>{
    try {
        const orders = await Order.find().populate('user', ['name', 'email']);
        res.status(200).json({ success: true, orders });
    } catch (error) {
        next(error);
    }
}
