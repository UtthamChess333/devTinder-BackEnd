const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const MONGO_URI =
      "mongodb+srv://utthamchess:NOD2EP5XirIHojXS@namastenode.jvmtw.mongodb.net/devConnect";

    await mongoose.connect(MONGO_URI);
    console.log("DB connected successfully ✅");
  } catch (error) {
    console.error("Database connection failed ❌");
    console.error(error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
