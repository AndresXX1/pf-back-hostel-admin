const { Reservas } = require("../../db");

const calcularGananciasHostelPremium = async (req, res) => {
  try {
    // Obtener todas las reservas
    const reservas = await Reservas.findAll();

    // Calcular la cantidad total sumando el totalAmount de cada reserva
    let totalAmount = 0;
    for (const reserva of reservas) {
      totalAmount += reserva.totalAmount;
    }

    // Calcular el 10% de la cantidad total como ganancias del Hostel Premium
    const gananciasHostelPremium = totalAmount * 0.1;

    // Formatear las ganancias con espacios
    const gananciasFormateadas = gananciasHostelPremium.toLocaleString("es-ES", {
      style: "currency",
      currency: "ARS",
    });

    // Devolver las ganancias del Hostel Premium formateadas en la respuesta
    return res.status(200).json({ gananciasHostelPremium: gananciasFormateadas });
  } catch (error) {
    console.error("Error calculating Hostel Premium earnings:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  calcularGananciasHostelPremium,
};