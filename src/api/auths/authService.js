const jwt = require("jsonwebtoken");
const { SignJWT } = require("jose");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const { getToken } = require("../../config/jwt.config.js");

const prisma = new PrismaClient();

class AuthService {
    async login(data) {
        const { email, password } = data.body;
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });

        if (!user) {
            throw new Error("Pengguna tidak ditemukan");
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            throw new Error("Kata sandi salah");
        }

        const payload = {
            id: user.id,
            username: user.username,
            email: user.email,
        };

        const token = await getToken(payload, "1h");

        user.token = token;
        delete user.password;

        return user;
    }

    async logout(data) {
        let token = data.headers.authorization;
        token = token.split(" ")[1];

        if (!token) {
            throw new Error("Token tidak ditemukan");
        }

        const verify = jwt.verify(token, process.env.JWT_TOKEN_SECRET);

        if (!verify) {
            throw new Error("Token tidak valid");
        }
        // check token expired
        const decoded = jwt.decode(token);
        const now = Date.now() / 1000;

        if (decoded.exp < now) {
            throw new Error("Token sudah kadaluarsa");
        }

        const newExpiration = now - 1;
        const newToken = jwt.sign({ ...decoded, exp: newExpiration }, process.env.JWT_TOKEN_SECRET);

        
        const user = await prisma.user.findUnique({
            where: {
                id: decoded.id,
            },
        });

        user.token = newToken;
        delete user.password;

        return user;
    }

    async register(data) {
        const { email, password, repassword } = data.body;

        if (password != repassword) {
            throw new Error("Password tidak sama");
        }

        const user = await prisma.user.findUnique({
            where: {
                email: email,
            }
        });

        if (user) {
            throw new Error("Gunakan email lain, email tersebut sudah terdata");
        }

        const hash = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                email,
                password: hash,
            },
        });

        const payload = {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
        };

        const token = await getToken(payload, "1h");

        newUser.token = token;
        delete newUser.password;

        return newUser;
    }

    async profile(id) {
        const user = await prisma.user.findUnique({
            where: {
                id: id,
            },
        });

        if (!user) {
            throw new Error("Pengguna tidak ditemukan");
        }

        delete user.password;
        return user;
    }
}

module.exports = new AuthService();