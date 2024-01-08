const jwt = require("jsonwebtoken");

const getuser = (tokenHeader) => {
  try {
    const decodedUser = jwt.verify(tokenHeader, "rahul");

    return decodedUser;
  } catch (error) {
    return error;
  }
};

const protect = (req, res, next) => {
  try {
    const tokenHeader = req.headers.authorization;

    req.user = null;

    if (!tokenHeader || !tokenHeader.startsWith("Bearer")) return next();

    const token = tokenHeader.split(" ")[1];
    const user = getuser(token);

    req.user = user;

    next();
  } catch (error) {
    console.error("Error in protect middleware:", error.message);
    next();
  }
};

const restrict = (role) => {
  return (req, res, next) => {
    try {
      const tokenHeader = req.headers.authorization;
      if (!tokenHeader || !tokenHeader.startsWith("Bearer")) {
        // Token is missing or invalid
        return res.status(401).json({ error: "Unauthorized" });
      }

      const token = tokenHeader.split(" ")[1];
      const user = getuser(token);

      if (!user || !role.includes(user.role)) {
        // User not authenticated or not authorized
        return res.status(403).json({ error: "Forbidden" });
      }

      // User is authenticated and authorized
      next();
    } catch (error) {
      console.error("Error in restrict middleware:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
};

module.exports = { protect, restrict, getuser };
