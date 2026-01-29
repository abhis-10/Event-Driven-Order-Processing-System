const { Kafka, Kafka } = require("kafkajs");
const db = require("../database/db.js")

const Kafka = new Kafka({
    clientId: "order-service",
    brokers: ["localhost:9902"]
});

const consumer = Kafka.consumer({ groupId:"order-group" });

const startConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: "order-created", fromBeginning: true });

  console.log("Kafka Consumer Running...");

  await consumer.run({
    eachMessage: async ({ message }) => {
      const order = JSON.parse(message.value.toString());

      const query = `
        INSERT INTO orders (product_name, quantity, price)
        VALUES (?, ?, ?)
      `;

      await db.execute(query, [
        order.product_name,
        order.quantity,
        order.price
      ]);

      console.log("Order saved to DB:", order);
    },
  });
};

module.exports = startConsumer;