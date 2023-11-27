import { jwtVerify } from "jose";

export const middleware = async (req, res, next) => {
  const headers = req.headers["authorization"];
  const token = headers && headers.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      message: "Token not found",
    });
  }

  try {
    const decoded = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_TOKEN_SECRET)
    );

    req.user = decoded;
    next();
  } catch (error) {
    console.error("Error decoding token:", error);
    return res.status(401).json({ message: "Invalid token" });
  }
};
