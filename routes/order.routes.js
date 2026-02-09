const express = require('express');
const router = express.Router();
const {createOrder , getAllOrders , getOrderById, updateOrderById, deleteOrderById} = require('../controller/orders.controller.js');
const authMiddleware = require('../middleware/auth.middleware.js');


router.post('/orders',  createOrder);
router.get('/orders',getAllOrders);
router.get('/orders/:id', authMiddleware, getOrderById);
router.put('/orders/:id', authMiddleware, updateOrderById);
router.delete('/orders/:id', authMiddleware, deleteOrderById);


module.exports = router;