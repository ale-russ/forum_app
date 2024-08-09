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
const Room = require("./models/room_model");
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

const rooms = {};

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
    console.log("GENERAL: ", message);
    try {
      let targetRoom;
      if (!room || room === null || room === "General") {
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

      const newMessage = new Message({
        content: message.content,
        author: message.author,
        room: targetRoom._id,
      });
      await newMessage.save();

      await Room.findByIdAndUpdate(targetRoom._id, {
        $push: { messages: newMessage._id },
        $addToSet: { users: newMessage.author },
      });

      if (room && room !== "General") {
        console.log("in no room block");
        io.to(room).emit("chat message", newMessage);
      } else {
        console.log("in room block", newMessage);
        io.emit("chat message", newMessage);
      }
    } catch (err) {
      console.error("Sending message failed: ", err.message);
      io.emit("error", "Sending Message Failed");
    }
  });

  socket.on("chat room message", async ({ room, message }) => {
    console.log("ROOM: ", { room, message });
    try {
      let targetRoom;
      targetRoom = await Room.findById({ _id: room });
      if (!targetRoom) {
        io.emit("error", "No Room Found");
        return;
      }
      if (!targetRoom.users.includes(message.author)) {
        targetRoom.users.push(message.author);
      }
      console.log("Chat Room message", targetRoom);
      const newMessage = new Message({
        content: message.content,
        author: message.author,
        room: targetRoom._id,
      });
      await newMessage.save();
      await Room.findByIdAndUpdate(targetRoom._id, {
        $push: { messages: newMessage._id },
        $addToSet: { users: newMessage.author },
      });
      console.log("newMessage: ", newMessage);
      io.to(room).emit("chat room message", newMessage);
    } catch (err) {
      console.error("Sending message failed: ", err.message);
      io.to(room).emit("error", "Error Sending message");
    }
  });

  socket.on("create room", async ({ roomName, userId }) => {
    try {
      let room = await Room.findOne({ name: roomName });
      if (!room) {
        const user = await User.findOne({ _id: userId });
        delete user.password;
        if (user) {
          room = new Room({ name: roomName, users: [user._id] });
          await room.save();

          socket.join(roomName);
          io.to(roomName).emit("room created", room);

          // Emit the updated list of rooms to all connected clients
          const rooms = await Room.find({}, { name: 1 });
          io.emit("rooms update", rooms);
        } else {
          socket.emit("error", "User not found");
        }
      } else {
        socket.emit("error", "Room already exists");
      }
    } catch (err) {
      console.error("Error creating room:", err);
      socket.emit("error", "Failed to create room");
    }
  });

  socket.on("join room", async ({ roomId, userId }) => {
    try {
      const room = await Room.findById(roomId);

      if (room) {
        const user = await User.findById(userId);
        if (!user) {
          socket.emit("error", "User not found. Please check again");
        }
        if (room.users.includes(userId)) {
          socket.emit("error", "User is already in the room");
          return;
        }
        room.users.push(user._id);
        await room.save();
        socket.join(roomId);
        const roomName = room.name;
        io.to(roomId).emit(
          "user joined",
          { userId: user._id, roomName },
          rooms
        );
      } else {
        socket.emit("error", "Room does not exist");
      }
    } catch (error) {
      socket.emit("error", "Failed to join room");
    }
  });

  socket.on("leave room", (roomName) => {
    if (rooms[roomName]) {
      rooms[roomName].users = rooms[roomName].users.filter(
        (userId) => userId !== socket.id
      );
      socket.leave(roomName);
      io.to(roomName).emit("user left", { userId: socket.id, roomName });
      console.log(`User ${socket.id} left room: ${roomName}`);
    } else {
      console.log("Oops! Something went wrong");
    }
  });

  socket.on("new comment", async ({ postId, author, content }) => {
    try {
      const comment = new Comment({ post: postId, author, content });
      await comment.save();

      const populatedComment = await comment.populate("author", "userName");

      await Post.findByIdAndUpdate(
        postId,
        { $push: { comments: comment._id } },
        { new: true }
      );

      io.emit("new comment", populatedComment);
    } catch (err) {
      console.log("Error: ", err);
    }
  });

  socket.on("disconnect", () => {
    // console.log("A user disconnected");
    Object.values(rooms).forEach((room) => {
      rooms.users = room.users.filter((userId) => userId !== socket.id);
      io.to(room.name).emit("user left", {
        userId: socket.id,
        roomName: room.name,
      });
    });
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
