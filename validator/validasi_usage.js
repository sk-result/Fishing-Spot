import Joi from "joi";

export const TicketUsageSchema = Joi.object({
  codeTiket: Joi.string().required().messages({
    "string.base": "Kode tiket harus berupa string",
    "any.required": "Kode tiket wajib diisi",
  }),
});



export default TicketUsageSchema;