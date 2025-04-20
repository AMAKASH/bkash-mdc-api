const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");

const auth = async (req, res, next) => {
  //check header

  const allow_passthrough = req.allow_passthrough;

  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer")) {
    if (allow_passthrough) {
      next();
      return;
    }
    throw new UnauthenticatedError("Auth Token Missing");
  }

  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    req.user = { userID: payload.userID, name: payload.name };
    next();
  } catch (error) {
    console.log(error);
    if (allow_passthrough) {
      next();
      return;
    }
    throw new UnauthenticatedError("Invalid Auth Token");
  }
};

const adminAuth = async (req, res, next) => {
  //check header

  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer")) {
    throw new UnauthenticatedError("Auth Token Missing");
  }

  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET_ADMIN);
    req.admin = { userID: payload.userID, name: payload.name };
    next();
  } catch (error) {
    console.log(error);
    throw new UnauthenticatedError("Invalid Admin Token");
  }
};

const allowAuthPassthrough = async (req, res, next) => {
  req.allow_passthrough = true;
  next();
};

module.exports = { auth, adminAuth, allowAuthPassthrough };
