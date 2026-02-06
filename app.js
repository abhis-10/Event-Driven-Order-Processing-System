const express = require('express');
const app = express();

const orderRoutes = require('./routes/order.routes');
const { connectProducer } = require("./kafka/producer.js");

const startConsumer=require("./kafka/consumer.js");
const authRoutes = require("./routes/auth.routes.js");

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use('/api', orderRoutes)

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  const startServer = async () => {
  const maxRetries = 10;
  const retryDelayMs = 3000;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log("[Startup] Connecting producer...");
      await connectProducer();
      app.listen(3000, () => {
        console.log("Server is listening on port 3000");
        // Set ENABLE_KAFKA_CONSUMER=0 to skip consumer (avoids JoinGroup timeouts; producer still works)
        const enableConsumer = process.env.ENABLE_KAFKA_CONSUMER !== "0" && process.env.ENABLE_KAFKA_CONSUMER !== "false";
        if (!enableConsumer) {
          console.log("[Startup] Kafka consumer disabled (ENABLE_KAFKA_CONSUMER=0). Producer only.");
          return;
        }
        setTimeout(() => {
          console.log("[Startup] Starting consumer...");
          startConsumer().catch((err) =>
            console.error("[Startup] Consumer failed to start:", err.message)
          );
        }, 15000);
      });
      return;
    } catch (err) {
      console.error(`Kafka connection failed (attempt ${attempt}/${maxRetries}):`, err.message);
      if (attempt === maxRetries) {
        console.error("Failed to start app after retries", err);
        process.exit(1);
      }
      console.log(`Retrying in ${retryDelayMs / 1000}s...`);
      await sleep(retryDelayMs);
    }
  }
};

startServer();