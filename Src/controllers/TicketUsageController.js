import usagesModel from "../models/ticketUsagesModel.js";
import ticketsModel from "../models/ticketsModel.js";
import { TicketUsageSchema } from "../validator/validasi_usage.js";

const ticketUsageController = {
  useTicket: async (req, res) => {
    try {
      const { error } = TicketUsageSchema.validate(req.body);
      if (error) {
        return res
          .status(400)
          .json({ status: "error", message: error.details[0].message });
      }

      const { codeTiket } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res
          .status(401)
          .json({ status: "error", message: "Unauthorized" });
      }

      const ticket = await ticketsModel.getByCode(codeTiket);

      if (!ticket) {
        return res
          .status(404)
          .json({ status: "error", message: "Tiket tidak ditemukan" });
      }

      if (ticket.user_id !== userId) {
        return res
          .status(403)
          .json({ status: "error", message: "Tiket bukan milikmu" });
      }

      if (ticket.status === "used") {
        return res
          .status(400)
          .json({ status: "error", message: "Tiket sudah digunakan" });
      }

      if (ticket.status_pembayaran === "unpaid") {
        return res
          .status(400)
          .json({ status: "error", message: "Tiket belum dibayar" });
      }

      const now = new Date();
      if (ticket.valid_date < now) {
        await ticketsModel.updateStatus(ticket.id, "expired");
        return res
          .status(400)
          .json({ status: "error", message: "Tiket sudah kedaluwarsa" });
      }

      // Simpan penggunaan tiket
      const usage = await usagesModel.create({
        userId,
        ticketId: ticket.id,
        usedAt: now,
        durationUsed: ticket.duration_minutes,
        fishingSpotId: ticket.fishing_spot_id,
      });

      await ticketsModel.updateStatus(ticket.id, "used");

      res.status(200).json({
        status: "success",
        message: "Tiket berhasil digunakan",
        ticket_code: ticket.ticket_code,
        usage,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Gagal menggunakan tiket",
        error: error.message,
      });
    }
  },

  getAll: async (req, res) => {
    try {
      const usages = await usagesModel.getAll();
      res.status(200).json({ usages });
    } catch (error) {
      res.status(500).json({
        message: "Gagal mengambil data penggunaan tiket",
        error: error.message,
      });
    }
  },

  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const usage = await usagesModel.getById(id);
      if (!usage) {
        return res
          .status(404)
          .json({ message: "Data penggunaan tiket tidak ditemukan" });
      }
      res.status(200).json({ usage });
    } catch (error) {
      res.status(500).json({
        message: "Gagal mengambil data penggunaan tiket",
        error: error.message,
      });
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const usage = await usagesModel.getById(id);
      if (!usage) {
        return res
          .status(404)
          .json({ message: "Data penggunaan tiket tidak ditemukan" });
      }
      await usagesModel.delete(id);
      res
        .status(200)
        .json({ message: "Data penggunaan tiket berhasil dihapus" });
    } catch (error) {
      res.status(500).json({
        message: "Gagal menghapus data penggunaan tiket",
        error: error.message,
      });
    }
  },
};

export default ticketUsageController;
