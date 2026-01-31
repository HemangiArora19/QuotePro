const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    // Establish MongoDB connection
    const con = await mongoose.connect(process.env.MONGO_URL);

    console.log(`MongoDB connected: ${con.connection.host}`);
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1); // Exit app if DB fails
  }
};

module.exports = connectDb;
