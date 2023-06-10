exports.getErrorMessage = function (err, message) {
  if (process.env.NODE_ENV === "development") {
    return err.message;
  } else if (process.env.NODE_ENV === "production") {
    return message;
  }
  return message;
};
