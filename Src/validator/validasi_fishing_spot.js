import Joi from "joi";
import express from "express";

const app = express();
app.use(express.json());

const validasiSchema = Joi.object({
  name: Joi.string().trim().min(1).max(50).required().messages({
    "string.empty": "Nama tidak boleh kosong",
    "string.min": "Nama minimal 1 karakter",
    "string.max": "Nama maksimal 50 karakter",
    "any.required": "Nama wajib diisi",
  }),
  description: Joi.string().min(5).max(255).required().messages({
    "string.empty": "Deskripsi tidak boleh kosong",
    "string.min": "Deskripsi minimal 5 karakter",
    "string.max": "Deskripsi maksimal 255 karakter",
    "any.required": "Deskripsi wajib diisi",
  }),
  price_per_hour: Joi.number().min(0).required().messages({
    "number.base": "Masukkan angka yang valid",
    "number.min": "Harga tidak boleh negatif",
    "any.required": "Harga wajib diisi",
  }),
  status: Joi.string().valid("available", "unavailable").required().messages({
    "string.empty": "Pilih status terlebih dahulu",
    "any.required": "Status wajib dipilih",
    "any.only": "Status harus 'available' atau 'unavailable'",
  }),
});

export default validasiSchema;
