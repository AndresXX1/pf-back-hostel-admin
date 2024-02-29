const { Reservas } = require("../../db");

const getTotalAmount = async (req, res) => {
  try {
    // Obtener todas las reservas
    const reservas = await Reservas.findAll();

    // Calcular la cantidad total sumando el totalAmount de cada reserva
    let totalAmount = 0;
    for (const reserva of reservas) {
      totalAmount += reserva.totalAmount;
    }

    // Devolver la cantidad total en la respuesta
    return res.status(200).json({ totalAmount });
  } catch (error) {
    console.error("Error getting total amount:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  getTotalAmount,
};