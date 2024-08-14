// socketHandlers.js
const User = require("../models/user_models");
const Message = require("../models/message_model");
const Room = require("../models/room_model");
const Comment = require("../models/comments_model");
const Post = require("../models/post_model");

const rooms = {};

const createGeneralRoom = async () => {
  try {
    let generalRoom = await Room.findOne({ name: "General" });
    if (!generalRoom) {
      generalRoom = new Room({ name: "General" });
      await generalRoom.save();
    }

    return generalRoom;
  } catch (err) {
    console.error("Error creating/finding General room:", err);
  }
};

const socketControllers = (io) => {
  io.on("connection", (socket) => {
    socket.on("join room", (id) => {
      try {
        socket.join(id);
      } catch (error) {
        socket.emit("error", "Oops! Something went wrong. Please try again");
      }
    });

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

        const author = await User.findById(message.author).select(
          "_id userName"
        );
        if (!author) {
          io.emit("error", "User not found");
          return;
        }

        const newMessage = new Message({
          content: message.content,
          author: author,
          room: targetRoom._id,
        });
        await newMessage.save();

        await Room.findByIdAndUpdate(targetRoom._id, {
          $push: { messages: newMessage._id },
          $addToSet: { users: newMessage.author },
        });

        io.emit("chat message", newMessage);
      } catch (err) {
        console.error("Sending message failed: ", err.message);
        io.emit("error", "Sending Message Failed");
      }
    });

    socket.on("chat room message", async ({ room, message }) => {
      console.log("MESSAGE: ", { room, message });
      try {
        let targetRoom;
        targetRoom = await Room.findById({ _id: room });
        if (!targetRoom) {
          io.emit("error", "No Room Found");
          return;
        }

        const author = await User.findById(message.author).select(
          "_id userName"
        );
        if (!author) {
          io.emit("error", "User not found");
          return;
        }

        if (!targetRoom.users.includes(author._id)) {
          targetRoom.users.push(author._id);
        }

        const newMessage = new Message({
          content: message.content,
          author: author,
          room: targetRoom._id,
        });
        await newMessage.save();
        await Room.findByIdAndUpdate(targetRoom._id, {
          $push: { messages: newMessage._id },
          $addToSet: { users: newMessage.author },
        });

        console.log("New Message: ", newMessage);

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

    socket.on("join chat room", async ({ roomId, userId }) => {
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

        io.to(postId).emit("new comment", {
          comment: populatedComment,
          id: postId,
        });
      } catch (err) {
        io.emit("error", "Failed to create comment");
      }
    });

    socket.on("leave room", (id) => {
      try {
        socket.leave(id);
      } catch (error) {
        console.log("Something went wrong while leaving the room");
      }
    });

    socket.on("disconnect", () => {
      Object.values(rooms).forEach((room) => {
        rooms.users = room.users.filter((userId) => userId !== socket.id);
        io.to(room.name).emit("user left", {
          userId: socket.id,
          roomName: room.name,
        });
      });
    });
  });
};

module.exports = socketControllers;
