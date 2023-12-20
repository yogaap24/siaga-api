const path = require('path');
const StorageServices = require('../storages/storageServices.js');
const ResponseServices = require('../responseServices.js');

const storageServices = new StorageServices(path.join(process.cwd(), 'public/uploads/test'));

const uploadFile = async (req, res, next) => {
  try {
    // Use the uploadFile method from StorageServices
    const result = await storageServices.uploadFile('image_profile', req, next);
    const responseServices = req ? new ResponseServices(result, req, next) : new ResponseServices(result);
    const response = responseServices.successResponse('success', result);
    res.status(response.code).json(response);
  } catch (error) {
    const responseServices = req ? new ResponseServices(error, req, next) : new ResponseServices(error);
    const response = responseServices.errorResponse();
    res.status(response.code).json(response);
  }
};

const getFile = async (req, res, next) => {
  try {
    const file = await storageServices.getFile(req.params.filename);
    const responseServices = req ? new ResponseServices(file, req, next) : new ResponseServices(file);
    const response = responseServices.successResponse('success', file);
    res.status(response.code).json(response);
  } catch (error) {
    const responseServices = req ? new ResponseServices(error, req, next) : new ResponseServices(error);
    const response = responseServices.errorResponse('error', 'File not found');
    res.status(response.code).json(response);
  }
}

module.exports = {
  uploadFile,
  getFile,
}
