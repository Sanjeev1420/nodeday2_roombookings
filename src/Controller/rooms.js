/** @format */

const store = require("../store.js");

//1)Create a Room
const createRoom = (req, res) => {
  try {
    let roomId = store.get("room").length + 1;
    const { roomName, seats, amenities, pricePerHour } = req.body;
    const room = {
      roomId,
      roomName,
      seats,
      amenities,
      pricePerHour,
      bookedData: [],
    };
    store.addRoom(room);
    res.status(201).send({ message: "Rooms added successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Internal Sarver Error",
    });
  }
};

//2)Book a Room
const bookRoom = (req, res) => {
  try {
    const { customerName, date, startTime, endTime, roomId } = req.body;
    const allRooms = store.get("room");
    const room = allRooms.find((rm) => rm.roomId === roomId);

    if (!room) {
      res.status(404).send({ message: "Room not found!" });
      return;
    }

    let isRoomAvailable = true;
    if (room.bookedData.length > 0) {
      isRoomAvailable = room.bookedData.some((booked) => {
        let isSameDate = booked.date === date;
        let isOverlap = false;

        if (isSameDate) {
          // Convert time strings to Date objects
          const bookedStartTime = new Date(`1970-01-01T${booked.startTime}`);
          const bookedEndTime = new Date(`1970-01-01T${booked.endTime}`);
          const inputStartTime = new Date(`1970-01-01T${startTime}`);
          const inputEndTime = new Date(`1970-01-01T${endTime}`);

          // Check for overlap
          isOverlap =
            (inputStartTime >= bookedStartTime &&
              inputStartTime < bookedEndTime) ||
            (inputEndTime > bookedStartTime && inputEndTime <= bookedEndTime);
        }

        return !(isSameDate && isOverlap);
        //If isSameDate and isOverlap is 'true' the user cannot book the room
      });
    }

    if (!isRoomAvailable) {
      res.status(400).send({ message: "Room Already Booked!!" });
      return;
    } else {
      const booking = {
        bookingId: store.get("bookings").length + 1,
        customerName,
        date,
        startTime,
        endTime,
      };

      store.addBooking(room, booking);
      res.status(201).send({ message: "Room Booked Successfully!!" });
      return;
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
};

//3)Listing Rooms with booked data
const listRooms = (req, res) => {
  try {
    const allRooms = store.get("room");
    if (allRooms.length === 0) {
      res.status(400).send({ message: "No Rooms available!" });
      return;
    }
    let roomLists = allRooms.map((rm) => ({
      room_id: rm.roomId,
      room_name: rm.roomName,
      bookingDetails: rm.bookedData,
    }));

    res.status(201).send({ roomLists });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
};

//4)List customers
const listCustomers = (req, res) => {
  try {
    const allBookings = store.get("bookings");
    const allRooms = store.get("room");

    let cutomerBookingDeatils = allBookings.map((book) => ({
      customerName: book.customerName,
      roomId: allRooms.map((room) => {
         if(room.bookedData.includes(book)) return room.roomId;
      })[0],
      roomName: allRooms.map((room) => {
        if(room.bookedData.includes(book)) return room.roomName;
      })[0],
      date: book.date,
      startTime: book.startTime,
      endTime: book.endTime,
    }));

    res.status(201).send({ cutomerBookingDeatils });
  } catch (error) {
    console.log(error);
      res.status(500).send({
      message: "Internal Server Error",
    });
  }
};

//5.List how many times a customer has booked the room
const getBookingHistory = (req, res) => {
    try {
        let  customerName  = req.query.customerName;
        let allBookings = store.get('bookings');
        let bookingHistory = allBookings.filter((booking) => booking.customerName === customerName);
    
        res.status(201).send({ bookingHistory });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Internal Server Error",
        });
    }
}


module.exports = {
  createRoom,
  bookRoom,
  listRooms,
  listCustomers,
  getBookingHistory
};
