const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];
      if (token === "null") {
        return res.status(403).json({ message: "Bạn chưa đăng nhập!" });
      } else {
        jwt.verify(token, "vothanhphuong", (err, decoded) => {
          if (err) {
            return res
              .status(403)
              .json({ message: "Token không hợp lệ hoặc đã hết hạn" });
          }

          req.user = decoded.user;
          next();
        });
      }
    }
  } catch (error) {
    return res.status(401).json(error.message);
  }
}

module.exports = { authenticateToken };
