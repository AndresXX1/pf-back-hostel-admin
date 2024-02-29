const { Reservas, User, Product } = require("../../db");

const allReservasHandler = async (req, res) => {
 try {
    const response = await Reservas.findAll({
      include: [
        {
          model: User,
          attributes: ['name'],
        },
        {
          model: Product,
          attributes: ['name'],
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
      userName: reserva.User.name,
      productName: reserva.Product.name,
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