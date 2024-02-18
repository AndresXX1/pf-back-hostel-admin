const { sequelize } = require("../../db");

const getProductStatistics = async (req, res) => {
    try {
        const currentDate = new Date().toISOString().split('T')[0]; // Obtiene la fecha actual en formato ISO (YYYY-MM-DD)

        const productStats = await sequelize.query(
            `SELECT 
                TO_CHAR("createdAt" AT TIME ZONE 'Europe/Lisbon', 'HH24:00') AS "hour",
                COUNT(*) AS "productCount"
            FROM 
                "Product"
            WHERE 
                DATE("createdAt" AT TIME ZONE 'Europe/Lisbon') = :currentDate
            GROUP BY 
                TO_CHAR("createdAt" AT TIME ZONE 'Europe/Lisbon', 'HH24:00')
            ORDER BY 
                "hour" ASC;`,
            { 
                replacements: { currentDate },
                type: sequelize.QueryTypes.SELECT 
            }
        );

        // Verifica si se obtuvieron estadísticas
        if (productStats.length > 0) {
            res.status(200).json(productStats);
        } else {
            // Si no se encontraron estadísticas, devuelve un mensaje apropiado
            res.status(404).json({ message: "No se encontraron estadísticas de productos para el día actual." });
        }
    } catch (error) {
        // Captura cualquier error y envía una respuesta de error interno del servidor
        console.error(error);
        res.status(500).json({ error: "Error interno del servidor." });
    }
};

module.exports = getProductStatistics;