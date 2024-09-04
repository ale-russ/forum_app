// socketHandlers.js
const User = require("../models/user_models");
const Message = require("../models/message_model");
const Room = require("../models/room_model");
const Comment = require("../models/comments_model");
const Post = require("../models/post_model");

const rooms = {};
const users = {};
const connectedUsers = new Map();

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

    socket.on("user connected", async (userId) => {
      try {
        const user = await User.findById(userId).select("userName email _id");
        if (user) {
          users[userId] = { socketId: socket.id, user };

          io.emit("update user list", Object.values(users));
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        io.emit("error", "Unable to fetch User");
      }
    });

    socket.on("private message", async ({ message, recipient }) => {
      try {
        const recipientSocketId = users[recipient._id]?.socketId;

        if (recipientSocketId) {
          const author = await User.findById(message.author).select(
            "_id userName"
          );

          console.log("author: ", author);

          if (!author) {
            io.emit("error", "User not found");
            return;
          }

          const newMessage = new Message({
            author: author,
            recipient: recipient._id,
            content: message.content,
          });
          await newMessage.save();

          io.to(recipientSocketId).emit("private message", {
            senderId: message.author,
            message: message,
          });
        } else {
          io.emit("error", "Recipient not connected");
        }
      } catch (error) {
        io.emit("error", "Error sending private message");
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

    socket.on("typing", (data) => {
      // console.log("Typing: ", data);
      socket.emit("typingResponse", data);
    });

    socket.on("stopTyping", () =>
      socket.emit("response", "user stopped typing")
    );

    socket.on("chat room message", async ({ room, message }) => {
      try {
        let targetRoom;
        targetRoom = await Room.findById({ _id: room });
        if (!targetRoom) {
          await createGeneralRoom();
          // io.emit("error", "No Room Found");
          // return;
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
            io.emit("create room", room);

            user.roomsCreated.push(room);
            await user.save();

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
        socket.emit("error", "Failed to create room");
      }
    });

    socket.on("join chat room", async ({ roomId, userId }) => {
      console.log("RoomID: ", roomId, " userId: ", userId);
      try {
        const room = await Room.findById(roomId);

        if (room) {
          const user = await User.findById(userId).select("-password");
          if (!user) {
            socket.emit("error", "User not found. Please check again");
            return;
          }
          if (room.users.includes(userId)) {
            socket.emit("error", "User is already in the room");
            return;
          }
          room.users.push(user._id);
          await room.save();
          socket.join(roomId);
          const roomName = room.name;

          user.roomsJoined.push(room);
          await user.save();

          io.to(roomId).emit(
            "join chat room",
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

        const updatedPost = await Post.findById(postId)
          .populate("comments")
          .populate({
            path: "comments",
            populate: { path: "author", select: "userName" },
          });

        io.to(postId).emit("new comment", { updatedPost });
      } catch (err) {
        io.emit("error", "Failed to create comment");
      }
    });

    const emitOnlineUsers = () => {
      const onlineUsers = Array.from(connectedUsers.values());
      io.emit("user list", onlineUsers);
    };

    socket.on("set userName", (userName) => {
      socket.userName = userName;
      emitOnlineUsers();
    });

    socket.on("leave room", (id) => {
      try {
        socket.leave(id);
      } catch (error) {
        socket.emit("error", "Oops. Something went wrong!");
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
      emitOnlineUsers();
    });
  });
};

module.exports = socketControllers;
