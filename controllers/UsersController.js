import prisma from "../models/prismaClient.js";
import validasiSchema from "../validator/validasi_user.js";
import bcrypt from "bcrypt";

const UsersController = {
  Register: async (req, res, next) => {
    try {
      // Validasi input dengan Joi
      const { error, value } = validasiSchema.validate(req.body, {
        abortEarly: false,
      });

      const errors = [];

      // Jika ada error dari validasi Joi
      if (error) {
        errors.push(...error.details.map((detail) => detail.message));
      }

      // Cek apakah username sudah ada
      const existingUsername = await prisma.users.findUnique({
        where: { username: value.username },
      });
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

      const newUser = await prisma.users.create({
        data: {
          username: value.username,
          email: value.email,
          password: hashedPassword,
          role: role,
          phone_number: value.phone_number,
        },
      });

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
};

export default UsersController;
