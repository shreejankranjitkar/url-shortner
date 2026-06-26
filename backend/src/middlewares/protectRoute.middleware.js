import jwt from "jsonwebtoken";

export const protectRoute = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error("Error in protectRoute middleware:", error);
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
};
