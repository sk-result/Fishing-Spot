import Joi from "joi";

// Schema validasi
const validasiSchema = Joi.object({
  fishing_spot_id: Joi.number().integer().positive().required().messages({
    "number.base": "fishing_spot_id harus berupa angka",
    "number.integer": "fishing_spot_id harus berupa bilangan bulat",
    "number.positive": "fishing_spot_id harus lebih besar dari 0",
    "any.required": "fishing_spot_id wajib diisi",
  }),

  duration_minutes: Joi.number().integer().positive().required().messages({
    "number.base": "duration_minutes harus berupa angka",
    "number.integer": "duration_minutes harus bilangan bulat",
    "number.positive": "duration_minutes harus lebih besar dari 0",
    "any.required": "duration_minutes wajib diisi",
  }),
});

export default validasiSchema;
