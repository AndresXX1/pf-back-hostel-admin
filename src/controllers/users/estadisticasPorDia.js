const { sequelize } = require("../../db");

const getUserStatistics = async (req, res) => {
    try {
        const userStats = await sequelize.query(
            `SELECT 
                TO_CHAR("createdAt" AT TIME ZONE 'Europe/Lisbon', 'YYYY-MM-DD') AS "date",
                TO_CHAR("createdAt" AT TIME ZONE 'Europe/Lisbon', 'HH24:00') AS "hour",
                COUNT(*) AS "userCount"
            FROM 
                "User"
            GROUP BY 
                TO_CHAR("createdAt" AT TIME ZONE 'Europe/Lisbon', 'YYYY-MM-DD'),
                TO_CHAR("createdAt" AT TIME ZONE 'Europe/Lisbon', 'HH24:00')
            ORDER BY 
                "date" ASC,
                "hour" ASC;`,
            { type: sequelize.QueryTypes.SELECT }
        );

        // Verifica si se obtuvieron estadísticas
        if (userStats.length > 0) {
            res.status(200).json(userStats);
        } else {
            // Si no se encontraron estadísticas, devuelve un mensaje apropiado
            res.status(404).json({ message: "No se encontraron estadísticas de usuarios." });
        }
    } catch (error) {
        // Captura cualquier error y envía una respuesta de error interno del servidor
        console.error(error);
        res.status(500).json({ error: "Error interno del servidor." });
    }
};

module.exports = getUserStatistics;