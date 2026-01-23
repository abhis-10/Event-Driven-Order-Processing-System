const mysql = require("mysql2");

const connection = mysql.createConnection({
    host:"127.0.0.1",
    user:"root",
    password:"uk04z5428",     /*use .env file for storing credentials like passwords and db names. */
    database:"order_service_db",
    port:3306
})

connection.connect((err)=>{
  if (err) {
    console.log("DB connection failed:", err);
    return;
  }
  console.log("Connected to MySQL");
})

module.exports = connection;