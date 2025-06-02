import Joi from "joi";

// Skema validasi untuk create dan update
export const TicketUsageSchema = Joi.object({
  ticket_id: Joi.number().integer().required().messages({
    "number.base": "ticket_id harus berupa angka",
    "any.required": "ticket_id wajib diisi",
  }),

});


export default TicketUsageSchema;