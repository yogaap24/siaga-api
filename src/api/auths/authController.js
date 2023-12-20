const AuthService = require("../auths/authService.js");
const ResponseServices = require("../responseServices.js");

const login = async (req, res, next) => {
  try {
    const user = await AuthService.login(req);
    const responseServices = req
      ? new ResponseServices(user, null, req, next)
      : new ResponseServices(user);
    const response = responseServices.successResponse("success", user);
    res.status(response.code).json(response);
  } catch (error) {
    const responseServices = req
      ? new ResponseServices(error, null, req, next)
      : new ResponseServices(error);
    const response = responseServices.errorResponse(error.message, null);
    res.status(response.code).json(response);
  }
};

const register = async (req, res, next) => {
  try {
    const user = await AuthService.register(req);
    const responseServices = req
      ? new ResponseServices(user, null, req, next)
      : new ResponseServices(user);
    const response = responseServices.successResponse("success", user);
    res.status(response.code).json(response);
  } catch (error) {
    const responseServices = req
      ? new ResponseServices(error, null, req, next)
      : new ResponseServices(error);
    const response = responseServices.errorResponse(error.message, null);
    res.status(response.code).json(response);
  }
};

const logout = async (req, res, next) => {
  try {
    const user = await AuthService.logout(req);
    const responseServices = req
      ? new ResponseServices(user, null, req, next)
      : new ResponseServices(user);
    const response = responseServices.successResponse("success", user);
    res.status(response.code).json(response);
  } catch (error) {
    const responseServices = req
      ? new ResponseServices(error, null, req, next)
      : new ResponseServices(error);
    const response = responseServices.errorResponse(error.message, null);
    res.status(response.code).json(response);
  }
};

const profile = async (req, res, next) => {
  try {
    const user = await AuthService.profile(req);
    const responseServices = req
      ? new ResponseServices(user, null, req, next)
      : new ResponseServices(user);
    const response = responseServices.successResponse("success", user);
    res.status(response.code).json(response);
  } catch (error) {
    const responseServices = req
      ? new ResponseServices(error, null, req, next)
      : new ResponseServices(error);
    const response = responseServices.errorResponse(error.message, null);
    res.status(response.code).json(response);
  }
};

module.exports = {
  login,
  register,
  logout,
  profile,
};
