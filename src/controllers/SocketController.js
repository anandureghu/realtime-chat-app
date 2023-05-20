const SocketService = require("../services/SocketService");
const { formatMessage } = require("../utils/utils");

const handleSocket = (socket, io) => {
  socket.on("joinChat", ({ username, room }) => {
    try {
      const user = SocketService.joinChat(socket.id, username, room);
      socket.join(user.room);

      socket.emit("message", formatMessage("RCA", `Messages on ${room} channel are limited to this channel only`));

      socket.broadcast.to(user.room).emit("message", formatMessage("RCA", `${user.username} has joined the room`));

      io.to(user.room).emit("activeUsers", {
        room: user.room,
        users: SocketService.getRoomUsers(user.room),
      });
    } catch (error) {
      socket.emit("error", {
        message: error.message,
      });
    }
  });

  socket.on("chatMessage", (msg) => {
    const user = SocketService.getActiveUser(socket.id);

    io.to(user.room).emit("message", formatMessage(user, msg));
  });

  socket.on("disconnect", () => {
    const user = SocketService.leaveChat(socket.id);
    if (user) {
      io.to("message", formatMessage("RCA", `${user.username} has left the chat`));

      io.to(user.room).emit("activeUsers", {
        room: user.room,
        users: SocketService.getRoomUsers(user.room),
      });
    }
  });
};

module.exports = {
  handleSocket,
};
