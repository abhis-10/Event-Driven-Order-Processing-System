const { Kafka } = require("kafkajs");
const db = require("../database/db");

const kafka = new Kafka({
  clientId: "order-service",
  brokers: ["kafka:9092"],
});

const consumer = kafka.consumer({ groupId: "order-group" });

const startConsumer = async () => {
  await consumer.connect();
  console.log("Kafka Consumer Connected");

  await consumer.subscribe({
    topic: "order-created",
    fromBeginning: true,
  });

  await consumer.run({
    eachMessage: async ({ message }) => {
      try{
      const order = JSON.parse(message.value.toString());

      console.log("Order event received:", order);
      }catch(err){
        console.log("consumer processing failed", err);
      }
    },
  });
};

module.exports = startConsumer; 
