const rooms = [];
const bookings = [];

const get = (x) => {
   return x === 'room' ? rooms : bookings; 
}

const addRoom = (room) => {
    rooms.push(room);
}

const addBooking = (booking_room , booking_data) => {
    const room = rooms.find((rm) => rm.roomId === booking_room.roomId);
    room.bookedData.push(booking_data);
    bookings.push(booking_data);
}

module.exports = { get , addRoom , addBooking};
