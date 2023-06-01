exports.getErrorMessage = function (err, message) {
  if (process.env.NODE_ENV === "development") {
    return err.message;
  }
  return message;
};
