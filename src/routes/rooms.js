const express = require('express');
const room = require('../Controller/rooms.js');

const router = express.Router();

router.post('/createRoom', room.createRoom);
router.post('/bookRoom',room.bookRoom);
router.get('/listRooms',room.listRooms);
router.get('/listCustomers',room.listCustomers);
router.get('/getBookingHistory',room.getBookingHistory);


module.exports = router;
