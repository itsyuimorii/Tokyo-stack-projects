const { User } = require("../../model/user");

module.exports = (req, res) => {
  const { message } = req.query;
  res.render("admin/userEdit", {
    message: message,
  });
};
