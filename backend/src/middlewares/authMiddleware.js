const { verifyToken } = require("../utils/jwt");

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization; // Bearer token

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: Token missing" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    req.user = decoded; // { id, role, iat, exp }
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

module.exports = authMiddleware;
