const mysql = require("mysql2");

const connection = mysql.createConnection({
    host:"mysql",  // Use service name from docker-compose.yml, not container name
    user:"root",
    password:"",     /*use .env file for storing credentials like passwords and db names. */
    database:"order_service_db",
    port:3306,
    waitForConnections: true
})

// Retry connection logic
const connectWithRetry = (retries = 5, delay = 5000) => {
  connection.connect((err) => {
    if (err) {
      console.log(`DB connection failed. Retries left: ${retries}`);
      if (retries > 0) {
        setTimeout(() => {
          console.log("Retrying database connection...");
          connectWithRetry(retries - 1, delay);
        }, delay);
      } else {
        console.error("Failed to connect to database after all retries.");
        process.exit(1);
      }
      return;
    }
    console.log("Connected to MySQL");
  });
};

connectWithRetry();

module.exports = connection;