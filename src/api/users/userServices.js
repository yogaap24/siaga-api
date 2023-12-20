const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const Busboy = require("busboy");
const path = require("path");
const fs = require("fs");

const DataTableServices = require("../dataTableServices.js");
const prisma = new PrismaClient();

class UserServices {
  async index(query) {
    const excludeColumns = ["password"];
    const dataTableServices = new DataTableServices(prisma.user, query);
    const rows = await dataTableServices.getResult(excludeColumns);

    return rows;
  }

  async show(id) {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    delete user.password;
    return user;
  }

  async store(data) {
    return new Promise(async (resolve, reject) => {
      let email, password, username, fullname, image;

      const busboy = Busboy({
        headers: data.headers,
      });

      busboy.on("field", (fieldname, val) => {
        if (fieldname === "email") {
          email = val;
        } else if (fieldname === "password") {
          password = val;
        } else if (fieldname === "username") {
          username = val;
        } else if (fieldname === "fullname") {
          fullname = val;
        }
      });

      busboy.on("file", async (fieldname, file, filename) => {
        if (fieldname === "image") {
          const filePath = path.join(
            "public/uploads/profiles",
            filename.filename
          );
          let fsStream = fs.createWriteStream(filePath);
          file.pipe(fsStream);
          image = filename.filename;
        }
      });

      busboy.on("finish", async () => {
        try {
          const validateUser = await this.validateUser(email);
          if (validateUser) {
            throw new Error("Gunakan email lain, email tersebut sudah terdata");
          }

          const hash = await bcrypt.hash(password, 10);

          const user = await prisma.user.create({
            data: {
              email,
              password: hash,
              username,
              fullname,
              image,
            },
          });

          delete user.password;

          resolve(user);
        } catch (error) {
          reject(error);
        }
      });

      data.pipe(busboy);
    });
  }

  async update(id, data) {
    return new Promise(async (resolve, reject) => {
      const busboy = Busboy({
        headers: data.headers,
      });

      let updatedData = {};

      const user = await prisma.user.findUnique({
        where: {
          id: id,
        },
      });

      // Check if user exists
      if (!user) {
        throw new Error("Pengguna tidak ditemukan");
      }

      busboy.on("field", (fieldname, val) => {
        if (fieldname === "email" && val) {
          updatedData.email = val;
        } else if (fieldname === "password" && val) {
          updatedData.password = val;
        } else if (fieldname === "username" && val) {
          updatedData.username = val;
        } else if (fieldname === "fullname" && val) {
          updatedData.fullname = val;
        }
      });

      busboy.on("file", async (fieldname, file, filename) => {
        if (fieldname === "image") {
          const filePath = path.join("public/uploads/profiles", filename);
          let fsStream = fs.createWriteStream(filePath);
          file.pipe(fsStream);
          image = filename;
        } else {
          image = user.image;
        }
      });

      busboy.on("finish", async () => {
        try {
          // If a field is empty, retain the existing value
          updatedData = {
            ...user,
            ...updatedData,
          };

          // Validate email if use update email
          if (updatedData.email && updatedData.email !== user.email) {
            const validateUser = await this.validateUser(updatedData.email);
            if (validateUser) {
              throw new Error("Gunakan email lain, email tersebut sudah terdata");
            }
          }

          // Hash password
          if (updatedData.password) {
            updatedData.password = await bcrypt.hash(updatedData.password, 10);
          }

          // Perform the update
          const updateUser = await prisma.user.update({
            where: {
              id: id,
            },
            data: updatedData,
          });

          // hide field password
          delete updateUser.password;

          resolve(updateUser);
        } catch (error) {
          reject(error);
        }
      });

      data.pipe(busboy);
    });
  }

  async destroy(id) {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (user) {
      if (user.image) {
        const imagePath = path.join("public/uploads/profiles", user.image);
        try {
          await fs.promises.unlink(imagePath);
        } catch (error) {
          throw new Error("Gagal menghapus gambar");
        }
      }

      await prisma.user.delete({
        where: {
          id: id,
        },
      });

      delete user.password;
      return user;
    } else {
      throw new Error("Pengguna tidak ditemukan");
    }
  }

  async validateUser(email) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    return user;
  }
}

module.exports = new UserServices();
