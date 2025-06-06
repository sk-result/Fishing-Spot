import Joi from "joi";

// Schema untuk registrasi dan update user
const validasiRegister = Joi.object({
  username: Joi.string().min(3).max(30).required().messages({
    "string.base": "username harus berupa teks",
    "string.empty": "username tidak boleh kosong",
    "string.min": "username minimal 3 karakter",
    "string.max": "username maksimal 30 karakter",
    "any.required": "username wajib diisi",
  }),
  email: Joi.string().email().required().messages({
    "string.base": "email harus berupa teks",
    "string.email": "email harus dalam format yang valid",
    "string.empty": "email tidak boleh kosong",
    "any.required": "email wajib diisi",
  }),
  password: Joi.string().min(6).required().messages({
    "string.base": "password harus berupa teks",
    "string.empty": "password tidak boleh kosong",
    "string.min": "password minimal 6 karakter",
    "any.required": "password wajib diisi",
  }),
  phone_number: Joi.string()
    .pattern(/^\+?[0-9]+$/) // cuma cek angka dan optional plus
    .min(10)
    .max(15)
    .required()
    .messages({
      "string.base": "phone_number harus berupa teks",
      "string.pattern.base":
        "phone_number harus berupa angka saja dan boleh diawali '+'",
      "string.min": "phone_number minimal 10 digit",
      "string.max": "phone_number maksimal 15 digit",
      "string.empty": "phone_number tidak boleh kosong",
      "any.required": "phone_number wajib diisi",
    }),

  role: Joi.string().valid("user", "admin", "super_admin").optional().messages({
    "string.base": "role harus berupa teks",
    "any.only": "role hanya boleh bernilai user, admin, atau super_admin",
  }),
});

// Schema untuk login
const validasiLogin = Joi.object({
  email: Joi.string().email().required().messages({
    "string.base": "email harus berupa teks",
    "string.email": "email harus dalam format yang valid",
    "string.empty": "email tidak boleh kosong",
    "any.required": "email wajib diisi",
  }),
  password: Joi.string().min(6).required().messages({
    "string.base": "password harus berupa teks",
    "string.empty": "password tidak boleh kosong",
    "string.min": "password minimal 6 karakter",
    "any.required": "password wajib diisi",
  }),
});


const validasiPartialUpdate = Joi.object({
  username: Joi.string().min(3).max(30).messages({
    "string.base": "username harus berupa teks",
    "string.empty": "username tidak boleh kosong",
    "string.min": "username minimal 3 karakter",
    "string.max": "username maksimal 30 karakter",
  }),
  email: Joi.string().email().messages({
    "string.base": "email harus berupa teks",
    "string.email": "email harus dalam format yang valid",
    "string.empty": "email tidak boleh kosong",
  }),
  password: Joi.string().min(6).messages({
    "string.base": "password harus berupa teks",
    "string.empty": "password tidak boleh kosong",
    "string.min": "password minimal 6 karakter",
  }),
  phone_number: Joi.string()
    .pattern(/^\+?[0-9]+$/)
    .min(10)
    .max(15)
    .messages({
      "string.base": "phone_number harus berupa teks",
      "string.pattern.base":
        "phone_number harus berupa angka saja dan boleh diawali '+'",
      "string.min": "phone_number minimal 10 digit",
      "string.max": "phone_number maksimal 15 digit",
      "string.empty": "phone_number tidak boleh kosong",
    }),
  role: Joi.forbidden().messages({
    "any.unknown": "Anda tidak diizinkan untuk mengubah role",
  }),
});

const validasiSchema = {
  validasiRegister,
  validasiLogin,
  validasiPartialUpdate,
};

export default validasiSchema;
