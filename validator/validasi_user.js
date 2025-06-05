import Joi from "joi";

// Schema untuk registrasi dan update user
const validasiRegister = Joi.object({
  username: Joi.string().min(3).max(30).required().messages({
    "string.base": `"username" harus berupa teks`,
    "string.empty": `"username" tidak boleh kosong`,
    "string.min": `"username" minimal 3 karakter`,
    "string.max": `"username" maksimal 30 karakter`,
    "any.required": `"username" wajib diisi`,
  }),
  email: Joi.string().email().required().messages({
    "string.base": `"email" harus berupa teks`,
    "string.email": `"email" harus dalam format yang valid`,
    "string.empty": `"email" tidak boleh kosong`,
    "any.required": `"email" wajib diisi`,
  }),
  password: Joi.string().min(6).required().messages({
    "string.base": `"password" harus berupa teks`,
    "string.empty": `"password" tidak boleh kosong`,
    "string.min": `"password" minimal 6 karakter`,
    "any.required": `"password" wajib diisi`,
  }),
  phone_number: Joi.string()
    .pattern(/^[0-9]+$/)
    .min(10)
    .max(15)
    .required()
    .messages({
      "string.pattern.base": `"phone_number" harus berupa angka saja`,
      "string.min": `"phone_number" minimal 10 digit`,
      "string.max": `"phone_number" maksimal 15 digit`,
      "string.empty": `"phone_number" tidak boleh kosong`,
      "any.required": `"phone_number" wajib diisi`,
    }),
  role: Joi.string().valid("user", "admin", "superadmin").optional().messages({
    "string.base": `"role" harus berupa teks`,
    "any.only": `"role" hanya boleh bernilai user, admin, atau superadmin`,
  }),
});

// Schema untuk login
const validasiLogin = Joi.object({
  email: Joi.string().email().required().messages({
    "string.base": `"email" harus berupa teks`,
    "string.email": `"email" harus dalam format yang valid`,
    "string.empty": `"email" tidak boleh kosong`,
    "any.required": `"email" wajib diisi`,
  }),
  password: Joi.string().min(6).required().messages({
    "string.base": `"password" harus berupa teks`,
    "string.empty": `"password" tidak boleh kosong`,
    "string.min": `"password" minimal 6 karakter`,
    "any.required": `"password" wajib diisi`,
  }),
});

const validasiSchema = { validasiRegister, validasiLogin };

export default validasiSchema;
