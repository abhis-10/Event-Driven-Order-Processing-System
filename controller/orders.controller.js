const db = require("../database/db.js")

const createOrder = (req,res) => {
    
    const {product_id , quantity} = req.body;

    if(!product_id || !quantity){
        return res.status(400).json({
            message:"product_id and quantity are required"
        });
    }

    const query = 
        "INSERT INTO orders (product_id , quantity , status) VALUES (?,?,?)"

    db.query(query,[product_id,quantity,"CREATED"], (err, result)=>{
        if(err){
            return res.status(500).send("Db Error!");
        }

        res.status(201).json({  // 201 status code is for 'created'.
      message: "Order created",
      order_id: result.insertId,
      status: "CREATED"
     });


    });

}

const getAllOrders = (req,res) => {
    const query = 
    "SELECT * FROM orders"

    db.query(query,(err,result)=>{
        if(err){
            return res.status(500).send("Db Error!");
        }

        res.status(200).json({
           orders: result // this will give you all the data present in table in db.
        })
    })
}

const getOrderById = (req,res) => {
    const {id} = req.params; // req.params contains dynamic route parameters from the URL (like :id)
    
    if(!id){
        return res.status(400).json({
            message:"Invalid id."
        })
    }
    const query = 
        "SELECT * FROM orders WHERE id = ?"

    db.query(query,[id],(err,result)=>{
        if(err){
            return res.status(500).send("Db Error!");
        }

        if (result.length === 0) {
           return res.status(404).json({
            message: "Order not found"
           });
        }

        res.status(200).json({
            message:`Order fetched with id : ${id}`,
           orders: result[0] // result is an array of data , comprises of all the data in the table
        })
    })
}

const updateOrderById = (req,res) => {
    const {id} = req.params;
    const {product_id , quantity , status} = req.body;

    if(!id || !product_id || !quantity || !status){
        return res.status(400).json({
            message:"Cannot take null values."
        })
    }

    const query = 
        "UPDATE orders SET product_id = ? , quantity = ? , status = ? WHERE id = ?"

    db.query(query,[product_id,quantity,status,id],(err,result)=>{
        if(err){
            return res.status(500).send("Db Error!");
        }

        if(result.affectedRows===0){
            return res.status(404).json({
             message: "Order not found"
            });
        }
    
        res.status(200).json({
        message:`Order with id ${id} is updated successfully.`,
        affectedRows:result.affectedRows
        })

    })    
}

const deleteOrderById = (req,res) => {
    const {id} = req.params;

    if (!id) {
    return res.status(400).json({
      message: "Order id is required"
    });
  }

   const query = "DELETE FROM orders WHERE id = ?";
   db.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Db Error!" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      message: `Order with id ${id} deleted successfully`
    });
  });
}
module.exports = { createOrder , getAllOrders , getOrderById , updateOrderById , deleteOrderById};