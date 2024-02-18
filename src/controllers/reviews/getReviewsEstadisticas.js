const { sequelize } = require("../../db");

const getReviewStatistics = async (req, res) => {
    try {
        const reviewStats = await sequelize.query(
            `SELECT 
                DATE_TRUNC('hour', "createdAt" AT TIME ZONE 'America/Chicago') AS "date",
                COUNT(*) AS "reviewCount"
            FROM 
                "Review"
            WHERE 
                "createdAt" >= CURRENT_DATE - INTERVAL '24 hours'
            GROUP BY 
                DATE_TRUNC('hour', "createdAt" AT TIME ZONE 'America/Chicago')
            ORDER BY 
                "date" ASC;`,
            { type: sequelize.QueryTypes.SELECT }
        );

        // Verifica si se obtuvieron estadísticas
        if (reviewStats.length > 0) {
            res.status(200).json(reviewStats);
        } else {
            // Si no se encontraron estadísticas, devuelve un mensaje apropiado
            res.status(404).json({ message: "No se encontraron estadísticas de revisiones en las últimas 24 horas." });
        }
    } catch (error) {
        // Captura cualquier error y envía una respuesta de error interno del servidor
        console.error(error);
        res.status(500).json({ error: "Error interno del servidor." });
    }
};

module.exports = getReviewStatistics;