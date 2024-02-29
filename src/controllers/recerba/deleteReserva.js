const { Reservas } = require("../../db");

const deleteReserva = async (req, res) => {
  const reservaId = req.params.reservaId;

  try {
    const reserva = await Reservas.findByPk(reservaId);

    if (!reserva) {
      console.error(`Reserva con ID ${reservaId} no encontrada`);
      return res.status(404).json({ message: "Reserva no encontrada" });
    }

    await reserva.destroy();

    return res.status(200).json({ message: "Reserva eliminada exitosamente" });
  } catch (error) {
    console.error("Error eliminando reserva:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

module.exports = {
  deleteReserva,
};