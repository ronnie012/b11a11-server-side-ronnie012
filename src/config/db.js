const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error('MONGODB_URI is not defined in .env file');
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let db;

async function connectDB() {
  if (db) return db;
  // await client.connect();
  db = client.db(process.env.DB_NAME || "tourZenDbUpgraded"); // You can specify DB name in .env or use a default
  console.log("Successfully connected to MongoDB!");
  return db;
}

module.exports = { connectDB, client }; // Export client if you need to close connection explicitly