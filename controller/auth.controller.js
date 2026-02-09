const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const adminUser = {
    id:1,
    email:process.env.ADMIN_EMAIL,
    password:bcrypt.hashSync(process.env.ADMIN_PASSWORD,10)
};

exports.login = async (req,res)=>{
    const {email , password} = req.body;

    if(email !== adminUser.email){
        return res.status(401).json({ message: "Invalid email" });
    }

    const isValid = await bcrypt.compare(password,adminUser.password);
    if(!isValid){
        return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
        {userId:adminUser.id, email:adminUser.email},
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    res.json({token});
}