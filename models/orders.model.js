const db = require('../database/db.js');

const createOrder = (product_id, quantity) => {
  const query = "INSERT INTO orders (product_id, quantity, status) VALUES (?, ?, ?)";
  return db.promise().query(query, [product_id, quantity, 'CREATED']);
};

const getAllOrders = () => {
  const query = "SELECT * FROM orders";
  return db.promise().query(query);
};

const getOrderById = (id) => {
  const query = "SELECT * FROM orders WHERE id = ?";
  return db.promise().query(query, [id]);
};

const updateOrderById = (id, product_id, quantity, status) => {
  const query = "UPDATE orders SET product_id = ?, quantity = ?, status = ? WHERE id = ?";
  return db.promise().query(query, [product_id, quantity, status, id]);
};

const deleteOrderById = (id) => {
  const query = "DELETE FROM orders WHERE id = ?";
  return db.promise().query(query, [id]);
};

module.exports = { createOrder, getAllOrders, getOrderById, updateOrderById, deleteOrderById };