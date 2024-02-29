const moment = require('moment-timezone');
const { Reservas } = require("../../db");

const createReservation = async (req, res) => {
  try {
    const { productId, userId, startDate, endDate, totalRooms, totalGuests, customerName, customerEmail, customerPhone } = req.body;
    
    // Obtener la fecha y hora actual en Argentina
    const createdAt = moment()
    
    const reservation = await Reservas.create({ 
      productId, 
      userId, 
      startDate, 
      endDate, 
      totalRooms, 
      totalGuests,
      customerName,
      customerEmail,
      customerPhone,
      createdAt // Agregar la fecha y hora de creación
    });
    
    res.status(201).json(reservation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

module.exports = {
  createReservation,
};