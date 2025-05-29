import Joi from "joi";
import express from "express";

const app = express();
app.use(express.json());

const validasiPayment = Joi.object({
  ticketId: Joi.number().integer().required().messages({
    "any.required": "ID tiket wajib diisi",
    "number.base": "ID tiket harus berupa angka",
  }),
  amount: Joi.number().positive().precision(2).required().messages({
    "any.required": "Jumlah pembayaran wajib diisi",
    "number.base": "Jumlah pembayaran harus berupa angka",
    "number.positive": "Jumlah pembayaran harus lebih dari 0",
  }),
  payment_method: Joi.string().max(100).required().messages({
    "any.required": "Metode pembayaran wajib diisi",
    "string.base": "Metode pembayaran harus berupa teks",
    "string.max": "Metode pembayaran maksimal 100 karakter",
  }),
  proof_of_payment: Joi.string().allow(null, "").optional().messages({
    "string.base": "Bukti pembayaran harus berupa teks (URL atau path file)",
  }),
});

export default validasiPayment;
