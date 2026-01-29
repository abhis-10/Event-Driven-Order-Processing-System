const mysql = require("mysql2");

const connection = mysql.createConnection({
    host:"mysql",  // Use service name from docker-compose.yml, not container name
    user:"root",
    password:"",     /*use .env file for storing credentials like passwords and db names. */
    database:"order_service_db",
    port:3306,
    waitForConnections: true
})


// const connection = mysql.createPool({
//   host: process.env.DB_HOST || "localhost",
//   user: process.env.DB_USER || "root",
//   password: process.env.DB_PASSWORD || "",
//   database: process.env.DB_NAME || "order_service_db",
//   port: process.env.DB_PORT || 3306,
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
// });

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


// const connectWithRetry = async (retries = 5, delay = 5000) => {
//    try {
//     const connection = await pool.getConnection();
//     console.log("✅ MySQL connected successfully");
//     connection.release();
//   } catch (error) {
//     console.error(`DB connection failed. Retries left: ${retries}`);

//     if (retries === 0) {
//       console.error("Could not connect to database. Exiting...");
//       process.exit(1);
//     }

//     console.log("Retrying DB connection...");
//     await new Promise((res) => setTimeout(res, delay));
//     return connectWithRetry(retries - 1, delay);
//   }
// };
connectWithRetry();

module.exports = connection;