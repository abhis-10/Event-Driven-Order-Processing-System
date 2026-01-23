const express = require('express');
const app = express();
const db = require("./database/db.js")
const orderRoutes = require('./routes/order.routes');

app.use(express.json()); // this lets Express read JSON from request body.
app.use('/api',orderRoutes)

app.listen(3000, ()=>{
    console.log("Server is listening on port 3000");
})