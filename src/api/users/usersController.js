const { PrismaClient } = require("@prisma/client");
const UserServices = require('../users/userServices.js');
const ResponseServices = require('../responseServices.js');

const prisma = new PrismaClient();

const getUsers = async (req, res, next) => {
  try {
    const user = await UserServices.index(req.query);
    const responseServices = req ? new ResponseServices(user, prisma.user, req, next) : new ResponseServices(user);
    const response = responseServices.successResponse('success', user);
    res.status(response.code).json(response);
  } catch (error) {
    const responseServices = req ? new ResponseServices(error, null, req, next) : new ResponseServices(error);
    const response = responseServices.errorResponse(error.message, null);
    res.status(response.code).json(response);
  }
};

const getUser = async (req, res, next) => {
  try {
    const user = await UserServices.show(req.params.id);
    const responseServices = req ? new ResponseServices(user, null, req, next) : new ResponseServices(user);
    const response = responseServices.successResponse('success', user);
    res.status(response.code).json(response);
  } catch (error) {
    const responseServices = req ? new ResponseServices(error, null, req, next) : new ResponseServices(error);
    const response = responseServices.errorResponse(error, null);
    res.status(response.code).json(response);
  }
};

const createUser = async (req, res, next) => {
  try {
    const user = await UserServices.store(req);
    const responseServices = req ? new ResponseServices(user, null, req, next) : new ResponseServices(user);
    const response = responseServices.successResponse('success', user);
    res.status(response.code).json(response);
  } catch (error) {
    const responseServices = req ? new ResponseServices(error, null, req, next) : new ResponseServices(error);
    const response = responseServices.errorResponse(error.message, null);
    res.status(response.code).json(response);
  }
}

const updateUser = async (req, res, next) => {
  try {
    const user = await UserServices.update(req.params.id, req);
    const responseServices = req ? new ResponseServices(user, null, req, next) : new ResponseServices(user);
    const response = responseServices.successResponse('success', user);
    res.status(response.code).json(response);
  } catch (error) {
    const responseServices = req ? new ResponseServices(error, null, req, next) : new ResponseServices(error);
    const response = responseServices.errorResponse(error.message, null);
    res.status(response.code).json(response);
  }
}

const deleteUser = async (req, res, next) => {
  try {
    const user = await UserServices.destroy(req.params.id);
    const responseServices = req ? new ResponseServices(user, null, req, next) : new ResponseServices(user);
    const response = responseServices.successResponse('success', user);
    res.status(response.code).json(response);
  } catch (error) {
    const responseServices = req ? new ResponseServices(error, null, req, next) : new ResponseServices(error);
    const response = responseServices.errorResponse(error.message, null);
    res.status(response.code).json(response);
  }
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
}