const { sequelize } = require("../../db");

const getProductStatistics = async (req, res) => {
    try {
        const currentDate = new Date(); // Obtener la fecha actual
        const currentDateString = currentDate.toISOString().split('T')[0]; // Obtener la fecha actual en formato YYYY-MM-DD

        // Consulta SQL para obtener las estadísticas del día actual
        const productStats = await sequelize.query(
            `SELECT 
                TO_CHAR("createdAt" AT TIME ZONE 'America/Argentina/Cordoba', 'YYYY-MM-DD') AS "date",
                TO_CHAR("createdAt" AT TIME ZONE 'America/Argentina/Cordoba', 'HH24:00') AS "hour",
                COUNT(*) AS "productCount"
            FROM 
                "Product"
            WHERE
                TO_CHAR("createdAt" AT TIME ZONE 'America/Argentina/Cordoba', 'YYYY-MM-DD') = '${currentDateString}'
            GROUP BY 
                TO_CHAR("createdAt" AT TIME ZONE 'America/Argentina/Cordoba', 'YYYY-MM-DD'),
                TO_CHAR("createdAt" AT TIME ZONE 'America/Argentina/Cordoba', 'HH24:00')
            ORDER BY 
                "date" ASC,
                "hour" ASC;`,
            { type: sequelize.QueryTypes.SELECT }
        );

        // Verificar si se obtuvieron estadísticas para el día actual
        if (productStats.length > 0) {
            res.status(200).json(productStats);
        } else {
            // Obtener la fecha del último día que tenga agrupaciones por hora
            const lastDateWithStats = await sequelize.query(
                `SELECT DISTINCT
                    TO_CHAR("createdAt" AT TIME ZONE 'America/Argentina/Cordoba', 'YYYY-MM-DD') AS "date"
                FROM 
                    "Product"
                WHERE
                    TO_CHAR("createdAt" AT TIME ZONE 'America/Argentina/Cordoba', 'YYYY-MM-DD') < '${currentDateString}'
                ORDER BY
                    "date" DESC
                LIMIT 1;`,
                { type: sequelize.QueryTypes.SELECT }
            );

            if (lastDateWithStats.length === 0) {
                // Si no se encontraron fechas anteriores con estadísticas, devolver un mensaje indicando que no se encontraron estadísticas
                res.status(404).json({ message: "No se encontraron estadísticas de productos." });
            } else {
                const lastDateString = lastDateWithStats[0].date;

                // Consulta SQL para obtener las últimas tres agrupaciones del último día que tenga agrupaciones por hora
                const productStatsPrevious = await sequelize.query(
                    `SELECT 
                        TO_CHAR("createdAt" AT TIME ZONE 'America/Argentina/Cordoba', 'YYYY-MM-DD') AS "date",
                        TO_CHAR("createdAt" AT TIME ZONE 'America/Argentina/Cordoba', 'HH24:00') AS "hour",
                        COUNT(*) AS "productCount"
                    FROM 
                        "Product"
                    WHERE
                        TO_CHAR("createdAt" AT TIME ZONE 'America/Argentina/Cordoba', 'YYYY-MM-DD') = '${lastDateString}'
                    GROUP BY 
                        TO_CHAR("createdAt" AT TIME ZONE 'America/Argentina/Cordoba', 'YYYY-MM-DD'),
                        TO_CHAR("createdAt" AT TIME ZONE 'America/Argentina/Cordoba', 'HH24:00')
                    ORDER BY 
                        "date" ASC,
                        "hour" ASC
                    LIMIT 3;`, // Limitar a las últimas 3 agrupaciones del último día con estadísticas
                    { type: sequelize.QueryTypes.SELECT }
                );

                // Devolver las estadísticas obtenidas
                res.status(200).json(productStatsPrevious);
            }
        }
    } catch (error) {
        // Capturar cualquier error y enviar una respuesta de error interno del servidor
        console.error(error);
        res.status(500).json({ error: "Error interno del servidor." });
    }
};

module.exports = getProductStatistics;