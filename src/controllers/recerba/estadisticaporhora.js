const { sequelize } = require("../../db");

const getReservationStatistics = async (req, res) => {
    try {
        // Consulta SQL para obtener las estadísticas de todas las reservas agrupadas por fecha de reserva
        const reservationStats = await sequelize.query(
            `SELECT 
                TO_CHAR("createdAt" AT TIME ZONE 'America/Argentina/Cordoba', 'YYYY-MM-DD') AS "reservationDate",
                "totalAmount" * 0.1 AS "tenPercentTotalAmount"
            FROM 
                "Reservas"
            ORDER BY 
                "reservationDate" ASC;`,
            { type: sequelize.QueryTypes.SELECT }
        );

        // Verificar si se obtuvieron estadísticas de reservas
        if (reservationStats.length > 0) {
            res.status(200).json(reservationStats);
        } else {
            // Si no se encontraron reservas, devolver un mensaje indicando que no se encontraron estadísticas
            res.status(404).json({ message: "No se encontraron estadísticas de reservas." });
        }
    } catch (error) {
        // Capturar cualquier error y enviar una respuesta de error interno del servidor
        console.error(error);
        res.status(500).json({ error: "Error interno del servidor." });
    }
};

module.exports = getReservationStatistics;