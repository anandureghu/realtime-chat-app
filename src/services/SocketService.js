let users = [];

const joinChat = (id, username, room) => {
  const newUser = {
    id,
    username,
    room,
  };
  users.push(newUser);
  return newUser;
};

const leaveChat = (id) => {
  let leavingUser;
  users = users.filter((user) => {
    if (user.id !== id) {
      return user;
    } else {
      leavingUser = user;
    }
  });
  return leavingUser;
};

const getRoomUsers = (room) => {
  return users.filter((user) => user.room === room);
};

const getActiveUser = (id) => {
  return users.find((user) => user.id === id);
};

module.exports = {
  joinChat,
  leaveChat,
  getRoomUsers,
  getActiveUser,
};
