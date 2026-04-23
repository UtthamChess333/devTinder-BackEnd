const express = require("express");
const connectDB = require("./src/config/database.js");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");
const initializeSocket = require("./src/utils/socket.js");

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./src/routes/auth.js");
const profileRouter = require("./src/routes/profile.js");
const requestsRouter = require("./src/routes/requests.js");
const userRouter = require("./src/routes/user.js");
const chatRouter = require("./src/routes/chat.js");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestsRouter);
app.use("/", userRouter);
app.use("/", chatRouter);

const server = http.createServer(app);
initializeSocket(server);

connectDB()
  .then(() => {
    console.log("Database connected");
    server.listen(7777, () => {
      console.log("Server is running on port 7777");
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
  });
