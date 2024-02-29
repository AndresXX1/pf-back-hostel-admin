const { Reservas } = require("../../db");

const allReservasHandler = async (req, res) => {
  try {
    const response = await Reservas.findAll({
      attributes: ['id', 'productId', 'userId', 'startDate', 'endDate', 'totalRooms', 'totalGuests', 'createdAt']
    });

    const mappedReservas = response.map((reserva) => ({
      id: reserva.id,
      productId: reserva.productId,
      userId: reserva.userId,
      startDate: reserva.startDate,
      endDate: reserva.endDate,
      totalRooms: reserva.totalRooms,
      totalGuests: reserva.totalGuests,
      createdAt: reserva.createdAt
    }));

    return res.status(200).json(mappedReservas);
  } catch (error) {
    console.error("Error fetching reservas:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

module.exports = {
  allReservasHandler,
};