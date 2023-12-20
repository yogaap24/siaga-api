const { PrismaClient } = require("@prisma/client");
const { getToken } = require("../config/jwt.config.js");
const { jwtVerify } = require("jose");

const prisma = new PrismaClient();

const HashPassword = async (password) => {
  const hash = await Bun.password.hash(password, {
    algorithm: "bcrypt",
    cost: 10,
  });
  return hash;
};

const createUser = async (req, res, next) => {
  const { username, fullname, email, password } = req.body;

  try {
    const findEmail = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    const findUsername = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (findEmail || findUsername) {
      return res
        .status(400)
        .json({ message: "Email atau Username Sudah Terdaftar" });
    } else {
      const newUser = await prisma.user.create({
        data: {
          username: username,
          fullname: fullname,
          email: email,
          password: await HashPassword(password),
        },
      });

      res.status(201).json({
        data: newUser,
        message: "User created successfully",
      });
    }
  } catch (error) {
    res.status(500).json({
      // status: false,
      message: "Username atau Email Sudah Terdaftar",
      //data: null,
    });
  }
};

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const findUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!findUser) {
      return res.status(404).json({
        message: "Akun tidak ada",
        data: null,
      });
    }

    //compare password input with hash

    const comparePassword = await Bun.password.verify(
      password,
      findUser.password
    );

    if (comparePassword) {
      const payload = {
        id: findUser.id,
        username: findUser.username,
        email: findUser.email,
      };

      const accessToken = await getToken(payload, "1h");

      return res.status(200).json({
        message: "Login Success",
        data: {
          id: findUser.id,
        },
        accessToken,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createUser,
  loginUser,
};