exports.getErrorMessage = function (err) {
  if (process.env.NODE_ENV === "development") {
    return err.message;
  }
  return "Something Went Wrong. Try Again Later!";
};
