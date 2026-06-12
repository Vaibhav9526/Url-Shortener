import jwt from "jsonwebtoken";

export const authorization = (req, res, next) => {
  try {
    const tokenHeader = req.headers["authorization"];

    if (!tokenHeader) return next();
    if (!tokenHeader.startsWith("Bearer")) return next();

    const token = tokenHeader.split(" ")[1];

    const checkToken = jwt.verify(token, process.env.JWT_SECRET);

    req.user = checkToken;

    next();
  } catch (error) {
    res.status(400).json(error);
  }
};
