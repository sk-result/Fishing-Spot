import usersModel from "../models/usersModel.js";
import validasiSchema from "../validator/validasi_user.js";
import bcrypt, { compare } from "bcrypt";
import jwt from "jsonwebtoken";

import dotenv from "dotenv";
dotenv.config();
const secret = process.env.JWT_SECRET;

const UsersController = {
  Register: async (req, res, next) => {
    try {
      const { error, value } = validasiSchema.validasiRegister.validate(
        req.body,
        {
          abortEarly: false,
        }
      );

      if (error) {
        const errors = error.details.map((detail) => detail.message);
        return res.status(400).json({ message: "Validasi gagal", errors });
      }

      // Cek apakah username sudah ada
      const existingUsername = await prisma.users.findUnique({
        where: { username: value.username },
      });

      const errors = [];
      if (existingUsername) {
        errors.push("Username sudah digunakan");
      }

      // Cek apakah email sudah ada
      const existingEmail = await prisma.users.findUnique({
        where: { email: value.email },
      });
      if (existingEmail) {
        errors.push("Email sudah digunakan");
      }

      // Jika ada error gabungan dari validasi dan pengecekan ke DB
      if (errors.length > 0) {
        return res.status(400).json({ message: "Registrasi gagal", errors });
      }

      // Enkripsi password dan simpan user
      const hashedPassword = await bcrypt.hash(value.password, 10);
      const role = value.role || "user";

      const data = {
        username: value.username,
        email: value.email,
        password: hashedPassword,
        role: role,
        phone_number: value.phone_number,
      };

      const newUser = await usersModel.create(data);
      // Sukses
      return res.status(201).json({
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        phone_number: newUser.phone_number,
      });
    } catch (err) {
      return res.status(500).json({
        message: "Terjadi kesalahan server",
        error: err.message,
      });
    }
  },

  Login: async (req, res, next) => {
    try {
      const { value, error } = validasiSchema.validasiLogin.validate(req.body, {
        abortEarly: false,
      });

      if (error) {
        const errors = error.details.map((detail) => detail.message);
        return res.status(400).json({ message: "Validasi gagal", errors });
      }

      const user = await prisma.users.findUnique({
        where: { email: value.email },
      });
      if (!user) return res.status(401).json({ message: "email salah" });

      // Cek password
      const validPassword = await bcrypt.compare(value.password, user.password);
      if (!validPassword)
        return res.status(401).json({ message: "Password salah" });

      // Buat token
      const token = jwt.sign(
        {
          username: user.username,
          id: user.id,
          email: user.email,
          role: user.role,
        },
        secret,
        {
          expiresIn: "1h",
        }
      );

      return res.status(200).json({
        message: "Login berhasil",
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      });
    } catch (err) {
      return res.status(500).json({
        message: "Terjadi kesalahan server",
        error: err.message,
      });
    }
  },
  Logout: async (req, res, next) => {
    return res.status(200).json({ message: "logout berhasil" });
  },
  GetById: async (req, res, next) => {
    const id = parseInt(req.params.id);
    try {
      const user = await usersModel.getById(id);
      if (!user) {
        res.status(404).json({ message: "data tidak ditemukan" });
      }
      res.status(200).json({
        message: "Data",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      });
    } catch (err) {
      return res.status(500).json({
        message: "Terjadi kesalahan server",
        error: err.message,
      });
    }
  },

  GetAllAdmin: async (req, res, next) => {
    try {
      const user = await usersModel.getAll();
      res.status(200).json({
        message: "data",
        user,
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: "User tidak ada",
        error: error.message,
      });
    }
  },
  GetAllUser: async (req, res, next) => {
    try {
      const users = await usersModel.getAll({
        select: {
          username: true,
          phone_number: true,
        },
      });

      res.status(200).json({
        message: "Data user berhasil diambil",
        users,
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: "User tidak ada",
        error: error.message,
      });
    }
  },

  Update: async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const { error, value } = validasiSchema.validasiRegister.validate(
        req.body,
        {
          abortEarly: false,
        }
      );
      if (error) {
        const errors = error.details.map((detail) => detail.message);
        return res.status(400).json({ message: "Validasi gagal", errors });
      }
      const { username, email, password, phone_number, role } = value;

      const hashedPassword = await bcrypt.hash(value.password, 10);

      const data = {
        username,
        email,
        password: hashedPassword,
        phone_number,
        role,
      };
      const newUser = await usersModel.update(id, data);
      res.json(newUser);
    } catch (err) {
      return res.status(404).json({ message: "" });
    }
  },

  Profile: async (req, res, next) => {
    try {
      const userId = req.user.id;

      const user = await prisma.users.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return res.status(404).json({ message: "User tidak ditemukan" });
      }

      return res.status(200).json({
        message: "Data user ditemukan",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          phone_number: user.phone_number,
        },
      });
    } catch (err) {
      return res.status(500).json({
        message: "Terjadi kesalahan server",
        error: err.message,
      });
    }
  },

  Delete: async (req, res, next) => {
    const id = parseInt(req.params.id);
    try {
      await usersModel.delete(id);
      res.json({ message: "Akun telah dihapus" });
    } catch (error) {
      res.status(404).json({ error: "Data tidak ditemukan" });
    }
  },
};

export default UsersController;
