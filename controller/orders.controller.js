/**Controllers assume tables exist */

const Order = require("../models/orders.model.js");
const { sendOrderEvent } = require("../kafka/Producer.js");

const createOrder = async (req, res) => {
  try {
    const { product_id, quantity } = req.body;

    if (!product_id || !quantity) {
      return res.status(400).json({
        message: "product_id and quantity are required",
      });
    }

    const [result] = await Order.createOrder(product_id, quantity); 

    const orderData = {
      order_id: result.insertId,
      product_id,
      quantity,
      status: "CREATED",
      createdAt: new Date(),
    };

    await sendOrderEvent(orderData); // im sending an event to Kafka here

    return res.status(201).json({
      message: "Order created successfully",
      order_id: result.insertId,
      status: "CREATED",
    });

  } catch (error) {
    console.error("Create Order Error:", error);
    return res.status(500).json({
      message: "Database error while creating order",
    });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const [orders] = await Order.getAllOrders();

    return res.status(200).json({
      orders,
    });
  } catch (error) {
    console.error("Get Orders Error:", error);
    return res.status(500).json({
      message: "Database error while fetching orders",
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "Order ID is required",
      });
    }

    const [result] = await Order.getOrderById(id);

    if (result.length === 0) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    return res.status(200).json({
      order: result[0],
    });
  } catch (error) {
    console.error("Get Order Error:", error);
    return res.status(500).json({
      message: "Database error while fetching order",
    });
  }
};

const updateOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const { product_id, quantity, status } = req.body;

    if (!id || !product_id || !quantity || !status) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const [result] = await Order.updateOrderById(
      id,
      product_id,
      quantity,
      status
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    if (status === "PAID") {
    sendOrderEvent({ type: `${status}`, orderId: id });
    }

    return res.status(200).json({
      message: `Order ${id} updated successfully`,
    });
  } catch (error) {
    console.error("Update Order Error:", error);
    return res.status(500).json({
      message: "Database error while updating order",
    });
  }
};

const deleteOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "Order ID is required",
      });
    }

    const [result] = await Order.deleteOrderById(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

      await sendOrderEvent({
      type: "ORDER_CANCELLED",
      orderId: id,
      timestamp: new Date().toISOString(),
    });

    return res.status(200).json({
      message: `Order ${id} deleted successfully`,
    });

  } catch (error) {
    console.error("Delete Order Error:", error);
    return res.status(500).json({
      message: "Database error while deleting order",
    });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderById,
  deleteOrderById,
};
