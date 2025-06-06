import Joi from "joi";
import express from "express";

const app = express();
app.use(express.json());

// Schema validasi
const validasiSchema = Joi.object({
  name: Joi.string().max(50).required().messages({
    "string.empty": "Nama tidak boleh kosong",
    "string.max": "Nama maksimal 50 karakter",
    "any.required": "Nama wajib diisi",
  }),
  description: Joi.string().min(5).required().messages({
    "string.empty": "Deskripsi tidak boleh kosong",
    "string.min": "Deskripsi minimal 5 karakter",
    "any.required": "Deskripsi wajib diisi",
  }),
  price_per_hour: Joi.number().min(0).required().messages({
    "number.empty": "Harga tidak boleh kosong ",
    "number.min": "Masukkan harga dengan benar",
    "any.required": "Masukkan harga",
    "number.base" : "Masukkan harga dengan benar"
  }),
  status: Joi.string().valid('available', 'unavailable').required().messages({
    "string.empty": "Pilih status terlebih dahulu ",
    "any.required": "Pilih status terlebih dahulu",
  }),
});

export default validasiSchema;
