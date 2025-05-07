const mongoose = require('mongoose');
const uri = process.env.MONGODB_URI;

const clientOptions = {
  serverApi: { version: '1', strict: true, deprecationErrors: true },
};

const connect = async () => {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    return mongoose.connection;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

// Disconnect from MongoDB
const disconnect = async () => {
  try {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("MongoDB disconnection error:", error);
  }
};

module.exports = {
  connect,
  disconnect,
  connection: mongoose.connection
};