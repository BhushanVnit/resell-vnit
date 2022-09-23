const jwt = require("jsonwebtoken");
const user = require("../models/registration");

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    const verifyUser = jwt.verify(
      token,
      "mynameisbhushanravindrabahaleandiamstudentofvnit"
    );
    next();
  } catch (err) {
    res.redirect('/login');
  }
};

module.exports = auth;
