const { Kafka } = require("kafkajs");

const kafka = new Kafka({
    clientId: "order-service",
    brokers: ["localhost:9902"] 
})

const producer = kafka.producer();

const connectProducer = async () => {
    await producer.connect();
    console.log("Kafka Producer Connected.");
};

const sendOrderEvent = async (orderData) => {
    await producer.send({
        topic: "order-created",
        messages: [
            {
                value: JSON.stringify(orderData),
            },
        ],
    });
};

module.exports = {
    connectProducer,
    sendOrderEvent
};
