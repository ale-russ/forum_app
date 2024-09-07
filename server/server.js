const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const socketIo = require("socket.io");
const http = require("http");
const path = require("path");

const authRoutes = require("./controllers/userController");
const forumRoute = require("./controllers/forumController");
const chatRoute = require("./controllers/chat_controller");
const upload = require("./controllers/upload");
const chat = require("./controllers/chat_controller");

const socketControllers = require("./controllers/socketController");

dotenv.config();

const PORT = process.env.PORT || 4000;
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    // credentials: true,
  },
});

// Socket.io setup
socketControllers(io);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());

//Serve static files from the React app
app.use(express.static(path.join(__dirname, "client", "build")));

const mongoUrl = process.env.MONGODB_URL;

mongoose
  .connect(mongoUrl)
  .then(() => console.log("CONNECTED TO MONGODB"))
  .catch((err) => console.log("MONGODB CONNECTION ERROR: ", err));

// auth routes
app.use("/auth", authRoutes);
app.use("/forum", forumRoute);
app.use("/chat", chatRoute);
app.use("/image", upload);
app.use("/chat", chat);

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});

// development
// server.listen(PORT, () => {
//   console.log(`Server listening on ${PORT}`);
// });

// production
server.listen(() => {
  console.log(`Server listening on ${PORT}`);
});
