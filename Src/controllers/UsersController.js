import usersModel from "../models/usersModel.js";
import validasiSchema from "../validator/validasi_user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const secret = process.env.JWT_SECRET;
if (!secret) {
  throw new Error("JWT_SECRET tidak ditemukan di .env");
}

const UsersController = {
  // ================================
  //  USER ENDPOINTS (PUBLIC / TOKEN)
  // ================================

  // Register User (role otomatis 'user')
  Register: async (req, res) => {
    try {
      if (req.body.phone_number) {
        req.body.phone_number = req.body.phone_number.replace(/\s+/g, "");
      }
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

      const role = "user";

      const errors = [];

      const existingUsername = await usersModel.getByUsername(value.username);
      if (existingUsername) errors.push("Username sudah digunakan");

      const existingEmail = await usersModel.getByEmail(value.email);
      if (existingEmail) errors.push("Email sudah digunakan");

      if (errors.length > 0) {
        return res.status(400).json({ message: "Registrasi gagal", errors });
      }

      const hashedPassword = await bcrypt.hash(value.password, 10);

      const data = {
        username: value.username,
        email: value.email,
        password: hashedPassword,
        role,
        phone_number: value.phone_number,
      };

      const newUser = await usersModel.create(data);
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

  // Login User
  Login: async (req, res) => {
    try {
      const { value, error } = validasiSchema.validasiLogin.validate(req.body, {
        abortEarly: false,
      });

      if (error) {
        const errors = error.details.map((detail) => detail.message);
        return res.status(400).json({
          status: "fail",
          message: "Validasi login gagal",
          errors,
        });
      }

      const user = await usersModel.getByEmail(value.email);
      if (!user)
        return res.status(401).json({
          status: "fail",
          message: "Email tidak ditemukan",
        });

      const validPassword = await bcrypt.compare(value.password, user.password);
      if (!validPassword)
        return res.status(401).json({
          status: "fail",
          message: "Password salah",
        });
      const expiresIn = "1h"; 
      const token = jwt.sign(
        {
          username: user.username,
          id: user.id,
          email: user.email,
          role: user.role,
        },
        secret,
        { expiresIn }
      );

      return res.status(200).json({
        status: "success",
        message: "Login berhasil",
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          phone_number: user.phone_number,
          expiresIn,
        },
      });
    } catch (err) {
      return res.status(500).json({
        status: "error",
        message: "Terjadi kesalahan pada server",
        error: err.message,
      });
    }
  },

  // Logout User (simbolis)
  Logout: async (req, res) => {
    return res
      .status(200)
      .json({ message: "Logout berhasil (token masih aktif sampai expired)" });
  },

  // Get profile user berdasarkan token (autentikasi)
  Profile: async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await usersModel.getById(userId);

      if (!user) {
        return res.status(404).json({
          status: "fail",
          message: "User tidak ditemukan",
        });
      }

      return res.status(200).json({
        status: "success",
        message: "Data profil ditemukan",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          phone_number: user.phone_number,
        },
      });
    } catch (err) {
      return res.status(500).json({
        status: "error",
        message: "Gagal mengambil data profil",
        error: err.message,
      });
    }
  },

  // Get all users (publik, bisa pagination)
  GetAllUser: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const users = await usersModel.getAll({
        skip,
        take: limit,
        select: {
          username: true,
          phone_number: true,
        },
      });

      res.status(200).json({
        status: "success",
        message: "Data user berhasil diambil",
        page,
        limit,
        users,
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: "Gagal mengambil data user",
        error: error.message,
      });
    }
  },

  // Get user by ID
  GetById: async (req, res) => {
    const id = parseInt(req.params.id);
    try {
      const user = await usersModel.getById(id);
      if (!user) {
        return res.status(404).json({
          status: "fail",
          message: "User tidak ditemukan",
        });
      }

      res.status(200).json({
        status: "success",
        user: {
          id: user.id,
          username: user.username,
          phone_number: user.phone_number,
        },
      });
    } catch (err) {
      return res.status(500).json({
        status: "error",
        message: "Terjadi kesalahan pada server",
        error: err.message,
      });
    }
  },

  // Partial update user
  PartialUpdate: async (req, res) => {
    try {
      const id = parseInt(req.params.id);

      if (req.body.phone_number) {
        req.body.phone_number = req.body.phone_number.replace(/\s+/g, "");
      }

      const { error, value } = validasiSchema.validasiPartialUpdate.validate(
        req.body,
        { abortEarly: false }
      );

      if (error) {
        const errors = error.details.map((detail) => detail.message);
        return res.status(400).json({ message: "Validasi gagal", errors });
      }

      const existingUser = await usersModel.getById(id);
      if (!existingUser) {
        return res.status(404).json({ message: "User tidak ditemukan" });
      }

      if (value.email) {
        const userByEmail = await usersModel.getByEmail(value.email);
        if (userByEmail && userByEmail.id !== id) {
          return res
            .status(400)
            .json({ message: "Email sudah digunakan oleh user lain" });
        }
      }
      if (value.username) {
        const userByUsername = await usersModel.getByUsername(value.username);
        if (userByUsername && userByUsername.id !== id) {
          return res
            .status(400)
            .json({ message: "Username sudah digunakan oleh user lain" });
        }
      }

      const allowedFields = ["username", "email", "phone_number", "password"];
      const data = {};

      for (const key of allowedFields) {
        if (value[key] !== undefined) {
          data[key] = value[key];
        }
      }

      if (data.password) {
        data.password = await bcrypt.hash(data.password, 10);
      }

      const updatedUser = await usersModel.update(id, data);

      res.status(200).json({
        message: "User berhasil diupdate",
        user: {
          id: updatedUser.id,
          username: updatedUser.username,
          email: updatedUser.email,
          phone_number: updatedUser.phone_number,
          role: updatedUser.role,
        },
      });
    } catch (err) {
      res.status(500).json({
        message: "Gagal mengupdate user",
        error: err.message,
      });
    }
  },

  // Delete user (user atau admin)
  Delete: async (req, res) => {
    const id = parseInt(req.params.id);
    try {
      await usersModel.delete(id);
      res.status(200).json({
        status: "success",
        message: "Akun berhasil dihapus",
      });
    } catch (error) {
      res.status(404).json({
        status: "fail",
        message: "Data tidak ditemukan",
      });
    }
  },

  // ===========================
  //  ADMIN ONLY ENDPOINTS
  // ===========================

  // ambil semua user dengan role super_admin
  GetAllAdmin: async (req, res) => {
    try {
      const users = await usersModel.getAll({
        where: { role: "super_admin" }, // pastikan ambil yang role super_admin saja
      });
      res.status(200).json({
        status: "success",
        users,
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: "Gagal mengambil data admin",
        error: error.message,
      });
    }
  },

  // super_admin buat user baru (boleh set role bebas)
  AdminCreateUser: async (req, res) => {
    try {
      if (req.body.phone_number) {
        req.body.phone_number = req.body.phone_number.replace(/\s+/g, "");
      }

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

      // Role yang diperbolehkan oleh super_admin
      const allowedRoles = ["user", "admin"];
      const role =
        value.role && allowedRoles.includes(value.role) ? value.role : "user";

      const errors = [];

      const existingUsername = await usersModel.getByUsername(value.username);
      if (existingUsername) errors.push("Username sudah digunakan");

      const existingEmail = await usersModel.getByEmail(value.email);
      if (existingEmail) errors.push("Email sudah digunakan");

      if (errors.length > 0) {
        return res.status(400).json({ message: "Registrasi gagal", errors });
      }

      const hashedPassword = await bcrypt.hash(value.password, 10);

      const data = {
        username: value.username,
        email: value.email,
        password: hashedPassword,
        role,
        phone_number: value.phone_number,
      };

      const newUser = await usersModel.create(data);
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
  // Update user untuk superadmin yang bisa update semua
  Update: async (req, res) => {
    try {
      if (req.body.phone_number) {
        req.body.phone_number = req.body.phone_number.replace(/\s+/g, "");
      }

      const id = parseInt(req.params.id);
      const { error, value } = validasiSchema.validasiRegister.validate(
        req.body,
        {
          abortEarly: false,
        }
      );

      if (error) {
        const errors = error.details.map((detail) => detail.message);
        return res.status(400).json({
          status: "fail",
          message: "Validasi update gagal",
          errors,
        });
      }
      if (value.email) {
        const userByEmail = await usersModel.getByEmail(value.email);
        if (userByEmail && userByEmail.id !== id) {
          return res
            .status(400)
            .json({ message: "Email sudah digunakan oleh user lain" });
        }
      }
      if (value.username) {
        const userByUsername = await usersModel.getByUsername(value.username);
        if (userByUsername && userByUsername.id !== id) {
          return res
            .status(400)
            .json({ message: "Username sudah digunakan oleh user lain" });
        }
      }

      const hashedPassword = await bcrypt.hash(value.password, 10);

      // Role bisa diupdate hanya oleh super_admin (harus dicek di middleware)
      const updatedUser = await usersModel.update(id, {
        username: value.username,
        email: value.email,
        password: hashedPassword,
        phone_number: value.phone_number,
        role: value.role,
      });

      res.status(200).json({
        status: "success",
        message: "User berhasil diupdate",
        user: updatedUser,
      });
    } catch (err) {
      return res.status(500).json({
        status: "error",
        message: "Gagal mengupdate user",
        error: err.message,
      });
    }
  },
};

export default UsersController;
