const moment = require("moment");

const formatMessage = (sender, message) => {
  return {
    sender,
    message,
    time: moment().format("hh:mm a"),
  };
};

module.exports = {
  formatMessage,
};
