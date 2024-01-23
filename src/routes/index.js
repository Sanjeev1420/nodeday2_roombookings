const express = require('express');
const roomsRouter = require("./rooms.js");

const router = express.Router();

router.get('/', (req,res) => {
    res.status(200).send(`<h1>Welcome to Express.js</h1>`);
});

router.use('/room',roomsRouter);

module.exports = router;