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
const Room = require("./models/message_model");
const Comment = require("./models/comments_model");
const Post = require("./models/post_model");

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

const createGeneralRoom = async () => {
  try {
    let generalRoom = await Room.findOne({ name: "General" });
    if (!generalRoom) {
      generalRoom = new Room({ name: "General" });
      await generalRoom.save();
      console.log("General room created");
    }
    return generalRoom;
  } catch (err) {
    console.error("Error creating/finding General room:", err);
  }
};

createGeneralRoom();

io.on("connection", (socket) => {
  socket.on("private message", async ({ to, message }) => {
    const recipientSocket = io.socket.sockets.get(to);
    if (recipientSocket) {
      const newMessage = new Message(to, { author, message });
      await newMessage.save();

      const populatedMessage = await message.populate("author", "userName");

      socket.to(to).emit("private message", populatedMessage);
    }
  });

  socket.on("chat message", async ({ room, message }) => {
    console.log("Received message:", { room, message });
    try {
      let targetRoom;
      if (room === "General" || !room) {
        targetRoom = await Room.findOne({ name: "General" });
        if (!targetRoom) {
          targetRoom = await createGeneralRoom();
        }
      } else {
        targetRoom = await Room.findOne({ name: room });
        if (!targetRoom) {
          targetRoom = new Room({ name: room });
          await targetRoom.save();
        }
      }
      console.log("targetRoom: ", targetRoom);
      const newMessage = new Message({
        content: message.content,
        author: message.author,
        room: targetRoom._id,
      });
      await newMessage.save();

      await Room.findByIdAndUpdate(targetRoom._id, {
        $push: { messages: newMessage._id },
      });

      if (room && room !== "General") {
        io.to(room).emit("chat message", newMessage);
      } else {
        io.emit("chat message", newMessage);
      }
    } catch (err) {
      console.error("Sending message failed: ", err.message);
    }
  });

  socket.on("chat room message", async ({ room, message }) => {
    const newMessage = new Message({
      content: message.content,
      author: message.author,
      room,
    });
    await newMessage.save();
  });

  socket.on("create room", async (roomName) => {
    const room = new Room({ name: roomName });
    await room.save();
    socket.join(roomName);
    console.log("Room crated :", roomName);
  });

  socket.on("join room", (roomName) => {
    const room = Room.findOne({ name: roomName });
    if (room) {
      socket.join(roomName);
      console.log("User joined :", roomName);
    } else {
      console.log("Room does not exist :", roomName);
    }
  });

  socket.on("new comment", async ({ postId, author, content }) => {
    console.log("Content: ", { postId, author: author, content });
    try {
      const comment = new Comment({ post: postId, author, content });
      await comment.save();

      const populatedComment = await comment.populate("author", "userName");

      console.log("PopulatedComment: ", populatedComment);

      await Post.findByIdAndUpdate(
        postId,
        { $push: { comments: comment._id } },
        { new: true }
      );

      io.emit("new comment", populatedComment);
    } catch (err) {
      console.log("Error: ", err);
      // return res.stats(500).json({ msg: "Internal Server Error" });
    }
  });

  socket.on("leave room", (roomName) => {
    socket.leave(roomName);
    console.log("User left :", roomName);
  });

  socket.on("disconnect", () => {
    // console.log("A user disconnected");
  });
});

// const createGeneralRoom = async () => {
//   try {
//     const generalRoom = await Room.findOne({ name: "General" });
//     if (!generalRoom) {
//       const newGeneralRoom = new Room({ name: "General" });
//       await newGeneralRoom.save();
//     }
//   } catch (err) {
//     console.log("Error creating General room: ", err);
//   }
// };

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
