const express = require('express');
const { addBooking, getMyBookings, updateBookingStatus } = require('../controllers/bookingController');
const verifyJWT = require('../middleware/verifyJWT'); // Booking is a protected action

const router = express.Router();

// POST /api/v1/bookings - Add a new booking (Protected)
// Requires JWT authentication
router.post('/', verifyJWT, addBooking);

// GET /api/v1/bookings/my-bookings - Get bookings for the logged-in user (Protected)
// Requires JWT authentication
router.get('/my-bookings', verifyJWT, getMyBookings);

// PATCH /api/v1/bookings/:id/status - Update booking status (Protected)
// Requires JWT authentication (and potentially role check later)
router.patch('/:id/status', verifyJWT, updateBookingStatus);

module.exports = router;