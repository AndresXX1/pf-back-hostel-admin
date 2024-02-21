const { sequelize } = require("../../db");

const getReviewStatistics = async (req, res) => {
    try {
        // Consulta para obtener estadísticas del día actual
        const todayStats = await sequelize.query(
            `SELECT 
                TO_CHAR("createdAt" AT TIME ZONE 'America/Argentina/Cordoba', 'YYYY-MM-DD') AS "date",
                TO_CHAR("createdAt" AT TIME ZONE 'America/Argentina/Cordoba', 'HH24:00') AS "hour",
                COUNT(*) AS "reviewCount"
            FROM 
                "Review"
            WHERE 
                DATE("createdAt" AT TIME ZONE 'America/Argentina/Cordoba') = CURRENT_DATE
            GROUP BY 
                "date", "hour"
            ORDER BY 
                "date" ASC,
                "hour" ASC;`,
            { type: sequelize.QueryTypes.SELECT }
        );

        // Si hay estadísticas disponibles para el día actual, devolverlas
        if (todayStats.length > 0) {
            return res.status(200).json(todayStats);
        }

        // Si no hay estadísticas para el día actual, buscar el último día anterior con datos
        const lastDayStats = await sequelize.query(
            `SELECT DISTINCT ON (TO_CHAR("createdAt" AT TIME ZONE 'Europe/Lisbon', 'YYYY-MM-DD')) 
                TO_CHAR("createdAt" AT TIME ZONE 'America/Argentina/Cordoba', 'YYYY-MM-DD') AS "date",
                TO_CHAR("createdAt" AT TIME ZONE 'America/Argentina/Cordoba', 'HH24:00') AS "hour",
                COUNT(*) AS "reviewCount"
            FROM 
                "Review"
            WHERE 
                DATE("createdAt" AT TIME ZONE 'America/Argentina/Cordoba') < CURRENT_DATE
            GROUP BY 
                "date", "hour"
            ORDER BY 
                "date" DESC,
                "hour" DESC
            LIMIT 3;`,
            { type: sequelize.QueryTypes.SELECT }
        );

        // Si se encontraron estadísticas para el día anterior, devolver las últimas tres agrupaciones
        if (lastDayStats.length > 0) {
            return res.status(200).json(lastDayStats);
        }

        // Si no se encuentran fechas anteriores con estadísticas, devolver un mensaje indicando que no se encontraron estadísticas
        return res.status(404).json({ message: "No se encontraron estadísticas de revisiones." });

    } catch (error) {
        // Capturar cualquier error y enviar una respuesta de error interno del servidor
        console.error(error);
        return res.status(500).json({ error: "Error interno del servidor." });
    }
};

module.exports = getReviewStatistics;