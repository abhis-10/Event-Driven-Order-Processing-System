const express = require("express");
const router = express.Router();
const {login} = require("../controller/auth.controller.js")

router.post("/login", login);

module.exports = router;

