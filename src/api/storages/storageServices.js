const multer = require('multer');
const path = require('path');
const { existsSync, mkdirSync } = require('fs');
const fs = require('fs');

class StorageServices {
  constructor(folderPath) {
    this.folderPath = folderPath;

    if (!existsSync(this.folderPath)) {
      mkdirSync(this.folderPath, { recursive: true });
    }

    // Configure multer
    this.upload = (fieldName) => multer({
      storage: multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, this.folderPath);
        },
        filename: (req, file, cb) => {
          const filename = +new Date() + path.extname(file.originalname);
          cb(null, filename);
        },
      }),
    }).single(fieldName);
  }

  uploadFile(fieldName, req, res) {
    return new Promise((resolve, reject) => {
      this.upload(fieldName)(req, res, (err) => {
        if (err) {
          reject(err);
        } else {
          const filename = path.basename(req.file.path);
          const filePath = req.file.path;
          resolve({ filename, filePath });
        }
      });
    });
  }

  getFile(filename) {
    return new Promise((resolve, reject) => {
      const folderFiles = fs.readdirSync(this.folderPath);
      const matchingFile = folderFiles.find((file) => file.startsWith(filename));

      if (matchingFile) {
        const filePath = path.join(this.folderPath, matchingFile);
        resolve({
          filename: matchingFile,
          filePath,
        });
      } else {
        reject(new Error('File not found'));
      }
    });
  }

  deleteFile(filename) {
    return new Promise((resolve, reject) => {
      const folderFiles = fs.readdirSync(this.folderPath);
      const matchingFile = folderFiles.find((file) => file.startsWith(filename));

      if (matchingFile) {
        const filePath = path.join(this.folderPath, matchingFile);
        fs.unlinkSync(filePath);
        resolve({
          filename: matchingFile,
          filePath,
        });
      } else {
        reject(new Error('File not found'));
      }
    });
  }
}

module.exports = StorageServices;