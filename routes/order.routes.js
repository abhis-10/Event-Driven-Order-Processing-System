const express = require('express');
const router = express.Router();
const {createOrder , getAllOrders , getOrderById, updateOrderById, deleteOrderById} = require('../controller/orders.controller.js')


router.post('/orders', createOrder);
router.get('/orders', getAllOrders);
router.get('/orders/:id',getOrderById);
router.put('/orders/:id',updateOrderById);
router.delete('/orders/:id',deleteOrderById);


module.exports = router;