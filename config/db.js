const mongoose = require("mongoose");
const dns = require("dns");

async function connectDB() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error("MONGO_URI is not configured");
  }

  // Fix DNS resolution issue with MongoDB Atlas SRV connection
  dns.setServers(["8.8.8.8", "8.8.4.4"]);

  mongoose.set("strictQuery", true);

  await mongoose.connect(uri);

  console.log("MongoDB connected");
}

module.exports = connectDB;