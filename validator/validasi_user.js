import Joi from "joi";
import express from "express";

const app = express();
app.use(express.json());

// Schema validasi

const validasiSchema = {
  validasiRegister: Joi.object({
    username: Joi.string().max(50).required().messages({
      "string.empty": "Nama tidak boleh kosong",
      "string.max": "Nama maksimal 50 karakter",
      "any.required": "Nama wajib diisi",
    }),
    email: Joi.string().email().max(100).required().messages({
      "string.empty": "Isi Email terlebih dahulu",
      "string.email": "Format email tidak valid",
      "any.required": "Email wajib diisi",
    }),
    password: Joi.string().min(6).max(100).required().messages({
      "string.empty": "Password tidak boleh kosong",
      "string.min": "Password minimal 6 karakter",
      "any.required": "Password wajib diisi",
    }),
    role: Joi.string().valid("admin", "owner", "user").optional().messages({
      "any.only": "Role harus admin, owner, atau user",
      "any.required": "Role wajib diisi",
    }),
    phone_number: Joi.string()
      .pattern(/^[0-9+]{10,20}$/)
      .required()
      .messages({
        "string.empty": "Nomor telepon wajib diisi",
        "string.pattern.base": "Nomor telepon tidak valid",
        "any.required": "Nomor telepon wajib diisi",
      }),
  }),

  validasiLogin: Joi.object({
    email: Joi.string().email().max(100).required().messages({
      "string.empty": "Isi Email terlebih dahulu",
      "string.email": "Format email tidak valid",
      "any.required": "Email wajib diisi",
    }),
    password: Joi.string().min(6).max(100).required().messages({
      "string.empty": "Password tidak boleh kosong",
      "string.min": "Password minimal 6 karakter",
      "any.required": "Password wajib diisi",
    }),

  }),
};

export default validasiSchema;
