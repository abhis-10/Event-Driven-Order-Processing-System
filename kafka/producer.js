const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "order-service-producer",
  brokers: ["kafka:9092"],
  connectionTimeout: 10000,
  requestTimeout: 60000,
});

const producer = kafka.producer();

const connectProducer = async () => {
  await producer.connect();
  console.log("Kafka Producer Connected");
};

const sendOrderEvent = async (orderData) => {
  const result = await producer.send({
    topic: "order-created",
    messages: [
      {
        value: JSON.stringify(orderData),
      },
    ],
  });
  console.log("Order event sent to Kafka:", orderData.order_id || orderData.orderId, result);
};

module.exports = {
  connectProducer,
  sendOrderEvent,
};
