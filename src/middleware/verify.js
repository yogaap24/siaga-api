const { jwtVerify } = require("jose");
const ResponseServices = require("../api/responseServices.js");

const middleware = async (req, res, next) => {
  const headers = req.headers["authorization"];
  const token = headers && headers.split(" ")[1];
  if (!token) {
    const responseServices = req
      ? new ResponseServices(null, null, req, next)
      : new ResponseServices(null);
    const response = responseServices.unauthorizedResponse("Unauthorized", null);
    return res.status(response.code).json(response);
  }

  try {
    const decoded = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_TOKEN_SECRET)
    );

    req.user = decoded;
    next();
  } catch (error) {
    const responseServices = req
      ? new ResponseServices(error, null, req, next)
      : new ResponseServices(error);
    const response = responseServices.unauthorizedResponse(
      "Unauthorized",
      null
    );
    res.status(response.code).json(response);
  }
};

module.exports = middleware;
