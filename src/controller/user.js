import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const HashPassword = async (password) => {
  const hash = await Bun.password.hash(password, {
    // algorithm: "argon2id",
    // memoryCost: "5",
    // timeCost: "2",
    algorithm: "bcrypt",
    cost: 10,
  });
  return hash;
};

export const createUser = async (req, res, next) => {
  const { username, fullname, email, password } = req.body;

  try {
    const newUser = await prisma.user.create({
      data: {
        username: username,
        fullname: fullname,
        email: email,
        password: await HashPassword(password),
      },
    });

    res
      .json({
        data: newUser,
        message: "User created successfully",
      })
      .status(201);
    // res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
