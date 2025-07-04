const { connectDB } = require('../config/db');
const { ObjectId } = require('mongodb');

const getBookingsCollection = async () => {
  const db = await connectDB();
  return db.collection('bookings');
};

const getPackagesCollection = async () => {
  const db = await connectDB();
  return db.collection('tourPackages');
};

// Controller to add a new booking
const addBooking = async (req, res) => {
  try {
    const bookingsCollection = await getBookingsCollection();
    const packagesCollection = await getPackagesCollection();
    const bookingData = req.body;

    // Validate required fields (add more as needed)
    if (!bookingData.packageId || !bookingData.touristEmail || !bookingData.selectedTourDate) {
      return res.status(400).send({ message: 'Missing required booking information.' });
    }

    // Fetch package details to denormalize some info into the booking
    const packageDetails = await packagesCollection.findOne({ _id: new ObjectId(bookingData.packageId) });
    if (!packageDetails) {
        // This shouldn't happen if packageId is valid, but good to check
        return res.status(404).send({ message: 'Package not found for booking.' });
    }

    // --- Start: Prevent Duplicate Bookings ---
    const existingBooking = await bookingsCollection.findOne({
      packageId: new ObjectId(bookingData.packageId),
      touristEmail: req.user.email,
    });
    if (existingBooking) {
      return res.status(409).send({ message: 'You have already booked this package.' });
    }
    // --- End: Prevent Duplicate Bookings ---

    // Construct the new booking document
    const newBooking = {
      ...bookingData,
      packageId: new ObjectId(bookingData.packageId), // Ensure packageId is an ObjectId
      touristEmail: req.user.email, // Ensure the booking is for the logged-in user
      // Use the client-sent bookingDate (numeric timestamp) and convert to Date object
      // Assuming client sends 'bookingDate' and server stores as 'booking_date'
      booking_date: new Date(bookingData.bookingDate), 
      // booking_date: new Date(), // Server-side timestamp for booking creation
      status: 'Pending', // Default status as per reqs.md (pending was an example)
    };
    // Add denormalized package details
    newBooking.packageImage = packageDetails.image;
    newBooking.departure_location = packageDetails.departure_location;
    newBooking.destination = packageDetails.destination;
    newBooking.guide_contact_no = packageDetails.guide_contact_no; // Denormalize guide's contact number

    const result = await bookingsCollection.insertOne(newBooking);

    // Increment booking_count in the tourPackages collection
    await packagesCollection.updateOne(
      { _id: new ObjectId(bookingData.packageId) },
      { $inc: { booking_count: 1 } }
    );

    res.status(201).send({ message: 'Booking added successfully', insertedId: result.insertedId });
  } catch (error) {
    console.error('Error adding booking:', error);
    res.status(500).send({ message: 'Failed to add booking', error: error.message });
  }
};

// Controller to get bookings for the logged-in user
const getMyBookings = async (req, res) => {
  try {
    const bookingsCollection = await getBookingsCollection();
    // req.user.email is populated by the verifyJWT middleware
    const userEmail = req.user.email; 

    const myBookings = await bookingsCollection.find({ touristEmail: userEmail }).toArray();
    res.status(200).send(myBookings);
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).send({ message: 'Failed to fetch bookings', error: error.message });
  }
};

// Controller to update booking status (e.g., confirm)
const updateBookingStatus = async (req, res) => {
  try {
    const bookingsCollection = await getBookingsCollection();
    const { id } = req.params;
    const { status } = req.body; // Expecting the new status in the request body

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ message: 'Invalid booking ID format' });
    }

    // Validate status if needed (e.g., only allow 'Accepted', 'Rejected', 'Completed')
    // For now, we'll just update to the provided status

    const result = await bookingsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: status } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).send({ message: 'Booking not found' });
    }

    res.status(200).send({ message: 'Booking status updated successfully' });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).send({ message: 'Failed to update booking status', error: error.message });
  }
};

module.exports = {
  addBooking,
  getMyBookings,
  updateBookingStatus,
};