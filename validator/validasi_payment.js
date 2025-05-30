import Joi from "joi";
import express from "express";

const app = express();
app.use(express.json());

const validasiPayment = Joi.object({
  code: Joi.string().min(0).max(10).required().messages({
    "string.empty" : "Masukkan code",
    "any.required" : "Masukkan code dengan benar",
    "string.min" : "Masukkan code dengan benar",
    "string.max" : "Code tidak lebih dari 20 angka"
  }),
  amount: Joi.number().positive().required().messages({
    "number.empty": "Harga tidak boleh kosong",
    "number.positive": "Masukkan harga dengan benar",
    "any.required": "Masukkan harga",
    "number.base": "Harga harus berupa angka",
  }),
});

export default validasiPayment;
