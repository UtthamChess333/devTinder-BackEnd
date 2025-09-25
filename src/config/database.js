const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://utthamchess:NOD2EP5XirIHojXS@namastenode.jvmtw.mongodb.net/devTinder2"
  );
};

module.exports = connectDB;


