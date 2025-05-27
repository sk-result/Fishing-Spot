import Joi from "joi";

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
  });

export default validasiSchema;
