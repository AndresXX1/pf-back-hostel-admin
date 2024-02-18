const { sequelize } = require("../../db");

const getReviewStatistics = async (req, res) => {
    try {
        const currentDate = new Date().toISOString().split('T')[0]; // Obtiene la fecha actual en formato ISO (YYYY-MM-DD)

        const reviewStats = await sequelize.query(
            `SELECT 
                TO_CHAR("createdAt" AT TIME ZONE 'Europe/Madrid', 'HH24:00') AS "hour",
                COUNT(*) AS "reviewCount"
            FROM 
                "Review"
            WHERE 
                DATE("createdAt" AT TIME ZONE 'Europe/Madrid') = :currentDate
            GROUP BY 
                TO_CHAR("createdAt" AT TIME ZONE 'Europe/Madrid', 'HH24:00')
            ORDER BY 
                "hour" ASC;`,
            { 
                replacements: { currentDate },
                type: sequelize.QueryTypes.SELECT 
            }
        );

        // Verifica si se obtuvieron estadísticas
        if (reviewStats.length > 0) {
            res.status(200).json(reviewStats);
        } else {
            // Si no se encontraron estadísticas, devuelve un mensaje apropiado
            res.status(404).json({ message: "No se encontraron estadísticas de revisiones para el día actual." });
        }
    } catch (error) {
        // Captura cualquier error y envía una respuesta de error interno del servidor
        console.error(error);
        res.status(500).json({ error: "Error interno del servidor." });
    }
};

module.exports = getReviewStatistics;