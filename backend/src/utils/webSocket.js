import Message from "../models/messageModel.js";

const users = {}; // userID -> socket


export const webSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("register", (userId) => {
      users[userId] = socket.id;
      console.log(`User ${userId} registered with socket ${socket.id}`);
      io.emit("user_list", Object.keys(users));
    });

    socket.on("unregister", (userId) => {
      delete users[userId];
      console.log(`User ${userId} unregistered`);
      io.emit("user_list", Object.keys(users));
    });

    socket.on("privateMessage", async ({ from, to, message }) => {
      const receiverSocketId = users[to];

      //store the message in the database if receiver is offline
      try {
        await Message.create({
          sender: from,
          receiver: to,
          message,
        });
      } catch (err) {
        console.error("Error saving message:", err);
      }

      //  Deliver message if receiver is online
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receive_private_message", {
          from,
          message,
          createdAt: new Date(),
        });
      }
    });

     socket.on("disconnect", () => {
      const disconnectedUser = Object.keys(users).find(
        key => users[key] === socket.id
      );
      if (disconnectedUser) {
        delete users[disconnectedUser];
        io.emit("user_list", Object.keys(users));
        console.log(`User ${disconnectedUser} disconnected`);
      }
    });
  });
};
