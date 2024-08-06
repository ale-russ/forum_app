const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const socketIo = require("socket.io");
const http = require("http");

const authRoutes = require("./controllers/userController");
const forumRoute = require("./controllers/forumController");
const chatRoute = require("./controllers/chat_controller");

const User = require("./models/user_models");
const Message = require("./models/message_model");

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

io.on("connection", (socket) => {
  socket.on("chat message", async ({ author, content }) => {
    const message = new Message({ author, content });
    await message.save();

    const populatedMessage = await message.populate("author", "userName");

    //Broadcast the message to all connected clients
    io.emit("chat message", populatedMessage);
  });

  socket.on("new comment", async ({ postId, author, content }) => {
    const comment = new Comment({ postId, author, content });
    await comment.save();

    const populatedComment = await comment.populate("author", "userName");

    io.emit("new comment", {
      postId,
      author,
      content,
      createdAt: comment.createdAt,
    });
  });

  socket.on("disconnect", () => {
    // console.log("A user disconnected");
  });
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());

const mongoUrl = process.env.MONGODB_URL;

mongoose
  .connect(mongoUrl)
  .then(() => console.log("CONNECTED TO MONGODB"))
  .catch((err) => console.log("MONGODB CONNECTION ERROR: ", err));

// auth routes
app.use("/auth", authRoutes);
app.use("/forum", forumRoute);
app.use("/chat", chatRoute);

app.get("/", (req, res) => {
  res.json({ message: "Welcome to my API!" });
});

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
