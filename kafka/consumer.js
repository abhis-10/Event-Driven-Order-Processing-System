const { Kafka } = require("kafkajs");

/**
 * Why "Request JoinGroup timed out" happens:
 * 1. Consumer must JOIN a group before it can read. The broker (coordinator) runs a "rebalance"
 *    and only then sends back the JoinGroup response.
 * 2. If the broker is slow (e.g. many ghost members from past crashes, or Docker/Kafka busy),
 *    it doesn't respond in time and the CLIENT times out (after rebalanceTimeout + 5s).
 * 3. When the client times out it crashes and KafkaJS restarts it → new JoinGroup → another
 *    "member" in the group → rebalance gets slower → loop. Fix: always do "docker compose down"
 *    then "up" so the group is fresh (one member only).
 */
const kafka = new Kafka({
  clientId: "order-service-consumer",
  brokers: ["kafka:9092"],
  connectionTimeout: 10000,
  requestTimeout: 190000,      // slightly more than rebalanceTimeout+5s so JoinGroup can complete
});

const consumer = kafka.consumer({
  groupId: "order-group-v4",
  sessionTimeout: 180000,     // 3 min (JoinGroup timeout = rebalanceTimeout + 5s in KafkaJS)
  rebalanceTimeout: 180000,    // 3 min – give broker more time to complete rebalance
  heartbeatInterval: 3000,
  // Low latency: broker responds quickly instead of waiting up to 5s (default maxWaitTimeInMs)
  maxWaitTimeInMs: 100,       // respond within 100ms when there's data (was 5000)
  minBytes: 1,                // don't wait to accumulate bytes; fetch as soon as there's any data
});

const startConsumer = async () => {
  try {
    console.log("[Consumer] Connecting to Kafka...");
    await consumer.connect();
    console.log("Kafka Consumer Connected");

    await consumer.subscribe({
      topic: "order-created",
      fromBeginning: true,
    });
    console.log("Kafka Consumer subscribed to topic: order-created");

    // Run in background so server can start even if JoinGroup is slow or retrying
    consumer.run({
      partitionsAssigned: () => {
        console.log("Kafka Consumer partitions assigned – ready to receive messages");
      },
      eachMessage: async ({ topic, partition, message }) => {
        console.log("[Consumer] Message received from", topic, "partition", partition);
        try {
          const order = JSON.parse(message.value.toString());
          console.log("Order event received:", order);
        } catch (err) {
          console.error("Consumer processing failed", err);
        }
      },
    }).catch((err) => {
      const msg = err.message || "";
      if (msg.includes("Closed connection")) {
        console.warn("[Consumer] Connection closed (rebalance or broker); KafkaJS will reconnect.");
      } else {
        console.error("[Consumer] run() failed (will retry internally):", err.message);
      }
    });
    // Resolve immediately so app.listen() is not blocked by JoinGroup timeouts
  } catch (err) {
    console.error("[Consumer] Failed to start:", err.message);
    throw err;
  }
};

module.exports = startConsumer; 
