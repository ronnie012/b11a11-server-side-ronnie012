const { connectDB } = require('../config/db');
const { ObjectId } = require('mongodb'); // Import ObjectId

const getPackagesCollection = async () => {
  const db = await connectDB();
  // As per reqs.md, the collection name is tourPackages
  // However, your index.js example used allPackagesCollection.
  // Let's stick to tourPackages as defined in the requirements.
  return db.collection('tourPackages'); 
};

// Controller to add a new tour package
const addPackage = async (req, res) => {
  try {
    const packagesCollection = await getPackagesCollection();
    const packageData = req.body;

    // Prioritize guide_name and guide_photo from the form (packageData).
    // Fallback to user's profile if not provided in the form.
    // guide_email will still come from the logged-in user who is adding the package.
    const finalGuideName = packageData.guide_name || req.user.displayName || req.user.email;
    const finalGuidePhoto = packageData.guide_photo || req.user.photoURL || '';

    const newPackage = {
      ...packageData,
      // Explicitly set guide details, prioritizing form input
      guide_name: finalGuideName,
      guide_photo: finalGuidePhoto,
      guide_email: req.user.email, // The email of the guide is the user creating the package
      booking_count: 0,
      created_at: new Date(),
      createdByEmail: req.user.email, // Add a field to identify the creator
    };

    const result = await packagesCollection.insertOne(newPackage);
    res.status(201).send({ message: 'Package added successfully', insertedId: result.insertedId });
  } catch (error) {
    console.error('Error adding package:', error);
    res.status(500).send({ message: 'Failed to add package', error: error.message });
  }
};

// Controller to get all tour packages
const getAllPackages = async (req, res) => {
  try {
    const packagesCollection = await getPackagesCollection();
    // const packages = await packagesCollection.find({}).toArray();
    const searchTerm = req.query.search; // Get the search term from query parameters
    let query = {}; // Default query fetches all packages

    if (searchTerm) {
      // If a search term exists, build a query using $regex
      // This searches in tour_name OR destination, case-insensitive ('i')
      query = {
        $or: [
          { tour_name: { $regex: searchTerm, $options: 'i' } },
          { destination: { $regex: searchTerm, $options: 'i' } },
        ],
      };
    }
    const packages = await packagesCollection.find(query).toArray(); // Apply the query
    res.status(200).send(packages);
  } catch (error) {
    console.error('Error fetching packages:', error);
    res.status(500).send({ message: 'Failed to fetch packages', error: error.message });
  }
};

// Controller to get a single tour package by ID
const getPackageById = async (req, res) => {
  try {
    const packagesCollection = await getPackagesCollection();
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ message: 'Invalid package ID format' });
    }
    const packageData = await packagesCollection.findOne({ _id: new ObjectId(id) });
    if (!packageData) {
      return res.status(404).send({ message: 'Package not found' });
    }
    res.status(200).send(packageData);
  } catch (error) {
    console.error('Error fetching package by ID:', error);
    res.status(500).send({ message: 'Failed to fetch package', error: error.message });
  }
};

// Controller to get packages created by the logged-in user
const getMyCreatedPackages = async (req, res) => {
  try {
    const packagesCollection = await getPackagesCollection();
    // req.user.email should be available from verifyJWT
    // Query packages where 'createdByEmail' matches the logged-in user's email
    const userEmail = req.user.email;
    if (!userEmail) {
      return res.status(400).send({ message: 'User email not found in token.' });
    }
    const packages = await packagesCollection.find({ createdByEmail: userEmail }).toArray();
    res.status(200).send(packages);
  } catch (error) {
    console.error('Error fetching user created packages:', error);
    res.status(500).send({ message: 'Failed to fetch your created packages', error: error.message });
  }
};

// Controller to update a tour package by ID
const updatePackage = async (req, res) => {
  try {
    const packagesCollection = await getPackagesCollection();
    const { id } = req.params;
    const updatedData = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ message: 'Invalid package ID format' });
    }

    // Find the existing package to ensure the user is authorized to update it
    const existingPackage = await packagesCollection.findOne({ _id: new ObjectId(id) });
    if (!existingPackage) {
      return res.status(404).send({ message: 'Package not found' });
    }

    // Authorization: Check if the logged-in user is the creator of the package
    if (existingPackage.createdByEmail !== req.user.email) {
      return res.status(403).send({ message: 'Forbidden: You are not authorized to update this package.' });
    }

    // Remove _id from updatedData if present, as it should not be changed
    delete updatedData._id;
    // You might also want to prevent certain fields from being updated, e.g., createdByEmail, guide_email from token etc.

    const result = await packagesCollection.updateOne({ _id: new ObjectId(id) }, { $set: updatedData });

    if (result.matchedCount === 0) {
      return res.status(404).send({ message: 'Package not found or no changes made' });
    }
    res.status(200).send({ message: 'Package updated successfully' });
  } catch (error) {
    console.error('Error updating package:', error);
    res.status(500).send({ message: 'Failed to update package', error: error.message });
  }
};

// Controller to delete a tour package by ID
const deletePackage = async (req, res) => {
  try {
    const packagesCollection = await getPackagesCollection();
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ message: 'Invalid package ID format' });
    }

    // Find the existing package to ensure the user is authorized to delete it
    const existingPackage = await packagesCollection.findOne({ _id: new ObjectId(id) });
    if (!existingPackage) {
      return res.status(404).send({ message: 'Package not found' });
    }

    // Authorization: Check if the logged-in user is the creator of the package
    if (existingPackage.createdByEmail !== req.user.email) {
      return res.status(403).send({ message: 'Forbidden: You are not authorized to delete this package.' });
    }

    const result = await packagesCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).send({ message: 'Package not found or already deleted' });
    }
    res.status(200).send({ message: 'Package deleted successfully' });
  } catch (error) {
    console.error('Error deleting package:', error);
    res.status(500).send({ message: 'Failed to delete package', error: error.message });
  }
};

// Controller to get featured tour packages (e.g., 6 most recent)
const getFeaturedPackages = async (req, res) => {
  try {
    const packagesCollection = await getPackagesCollection();
    // Fetch top 6 packages, sorted by creation date in descending order
    const packages = await packagesCollection.find({}).sort({ created_at: -1 }).limit(6).toArray();
    res.status(200).send(packages);
  } catch (error)
 {
    console.error('Error fetching featured packages:', error);
    res.status(500).send({ message: 'Failed to fetch featured packages', error: error.message });
  }
};

// Controller to get images for the tour gallery (e.g., 10 most recent)
const getGalleryImages = async (req, res) => {
  try {
    const packagesCollection = await getPackagesCollection();
    // Fetch top 10 packages, sorted by creation date, projecting only necessary fields
    const galleryItems = await packagesCollection.find({})
      .sort({ created_at: -1 })
      .limit(10)
      .project({ image: 1, tour_name: 1, _id: 1 }) // Select only image, tour_name, and _id
      .toArray();
    res.status(200).send(galleryItems);
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    res.status(500).send({ message: 'Failed to fetch gallery images', error: error.message });
  }
};


module.exports = {
  addPackage,
  getAllPackages,
  getFeaturedPackages,
  getPackageById,
  getMyCreatedPackages, // Export the new controller
  updatePackage,        // Export the update controller
  deletePackage,        // Export the delete controller
  getGalleryImages,     // Export the new gallery images controller
};