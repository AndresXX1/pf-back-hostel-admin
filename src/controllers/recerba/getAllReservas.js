const { Reservas } = require("../../db");

const allReservasHandler = async (req, res) => {
 try {
    const response = await Reservas.findAll({
      include: [
        {
          model: User, // Asegúrate de importar el modelo User
          attributes: ['name'], // Ajusta los atributos según sea necesario
        },
        {
          model: Product, // Asegúrate de importar el modelo Product
          attributes: ['name'], // Ajusta los atributos según sea necesario
        },
      ],
      attributes: ['id', 'productId', 'userId', 'startDate', 'endDate', 'totalRooms', 'totalGuests', 'createdAt', 'totalAmount']
    });

    const mappedReservas = response.map((reserva) => ({
      id: reserva.id,
      productId: reserva.productId,
      userId: reserva.userId,
      startDate: reserva.startDate,
      endDate: reserva.endDate,
      totalRooms: reserva.totalRooms,
      totalGuests: reserva.totalGuests,
      createdAt: reserva.createdAt,
      totalAmount: reserva.totalAmount,
      userName: reserva.User.name, // Accede al nombre del usuario a través de la asociación
      productName: reserva.Product.name, // Accede al nombre del producto a través de la asociación
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