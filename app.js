const express = require('express');
const app = express();

const orderRoutes = require('./routes/order.routes');
const { connectProducer } = require("./kafka/producer.js");

const startConsumer=require("./kafka/consumer.js");

app.use(express.json());
app.use('/api',orderRoutes)

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  const startServer = async () => {
  const maxRetries = 10;
  const retryDelayMs = 3000;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await connectProducer();
      await startConsumer();
      app.listen(3000, () => {
        console.log("Server is listening on port 3000");
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