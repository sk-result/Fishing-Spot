import Joi from "joi";
import express from "express";

const app = express();
app.use(express.json());

const validasiPayment = Joi.object({
  code: Joi.string().required(),
  amount: Joi.number().positive().required(),
});

export default validasiPayment;
