const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  try {
    let token = req.header("Authorization");

    if (!token) return res.status(403).send("Достъпът отказан!");

    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft();
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    console.error(err);
  }

  //   const bearerHeader = req.headers["authorization"];
  //   //   console.log("bearer header", bearerHeader);

  //   if (typeof bearerHeader !== "undefined") {
  //     const bearer = bearerHeader.split(" ");
  //     const bearerToken = bearer[1];

  //     try {
  //       const payload = jwt.verify(bearerToken, process.env.JWT_SECRET);
  //       //   console.log(payload);

  //       // get user from database
  //       const user = await PlatformUsers.findById(payload.userId);
  //       if (!user) {
  //         return res.status(404).json({ message: "User not found." });
  //       }

  //       // add user to request object
  //       req.userId = user._id;
  //       //   console.log("req.userId is", req.userId);

  //       next();
  //     } catch (error) {
  //       res.status(401).json({ message: "Invalid or expired token." });
  //     }
  //   } else {
  //     res.status(403).json({ message: "No token provided." });
  //   }
};

module.exports = verifyToken;
