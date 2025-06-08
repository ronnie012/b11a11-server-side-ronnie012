const express = require('express');
const { addPackage, getAllPackages, getFeaturedPackages, getPackageById, getMyCreatedPackages, updatePackage, deletePackage } = require('../controllers/packageController');
const verifyJWT = require('../middleware/verifyJWT'); // To protect the add package route

const router = express.Router();

// POST /api/v1/packages - Add a new package (Protected)
router.post('/', verifyJWT, addPackage);

// GET /api/v1/packages - Get all packages (Public)
router.get('/', getAllPackages);

// GET /api/v1/packages/featured - Get featured packages (Public)
router.get('/featured', getFeaturedPackages);

// GET /api/v1/packages/my-packages - Get packages created by the logged-in user (Protected)
// This needs to be before the /:id route to avoid "my-packages" being treated as an ID
router.get('/my-packages', verifyJWT, getMyCreatedPackages);

// GET /api/v1/packages/:id - Get a single package by ID (Public)
router.get('/:id', getPackageById);

// PUT /api/v1/packages/:id - Update a package by ID (Protected)
router.put('/:id', verifyJWT, updatePackage);

// DELETE /api/v1/packages/:id - Delete a package by ID (Protected)
router.delete('/:id', verifyJWT, deletePackage);

module.exports = router;