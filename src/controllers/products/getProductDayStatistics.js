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
            // Si no hay estadísticas para el día actual, buscar las últimas 3 agrupaciones del día anterior
            const previousDate = new Date(currentDate);
            previousDate.setDate(previousDate.getDate() - 1); // Obtener la fecha del día anterior
            const previousDateString = previousDate.toISOString().split('T')[0]; // Obtener la fecha del día anterior en formato YYYY-MM-DD

            // Consulta SQL para obtener las últimas 3 agrupaciones del día anterior
            const productStatsPrevious = await sequelize.query(
                `SELECT 
                    TO_CHAR("createdAt" AT TIME ZONE 'America/Argentina/Cordoba', 'YYYY-MM-DD') AS "date",
                    TO_CHAR("createdAt" AT TIME ZONE 'America/Argentina/Cordoba', 'HH24:00') AS "hour",
                    COUNT(*) AS "productCount"
                FROM 
                    "Product"
                WHERE
                    TO_CHAR("createdAt" AT TIME ZONE 'America/Argentina/Cordoba', 'YYYY-MM-DD') = '${previousDateString}'
                GROUP BY 
                    TO_CHAR("createdAt" AT TIME ZONE 'America/Argentina/Cordoba', 'YYYY-MM-DD'),
                    TO_CHAR("createdAt" AT TIME ZONE 'America/Argentina/Cordoba', 'HH24:00')
                ORDER BY 
                    "date" ASC,
                    "hour" ASC
                LIMIT 3;`, // Limitar a las últimas 3 agrupaciones del día anterior
                { type: sequelize.QueryTypes.SELECT }
            );

            // Verificar si se obtuvieron estadísticas para el día anterior
            if (productStatsPrevious.length > 0) {
                res.status(200).json(productStatsPrevious);
            } else {
                // Si no hay estadísticas para el día anterior, devolver un mensaje indicando que no se encontraron estadísticas
                res.status(404).json({ message: "No se encontraron estadísticas de productos." });
            }
        }
    } catch (error) {
        // Capturar cualquier error y enviar una respuesta de error interno del servidor
        console.error(error);
        res.status(500).json({ error: "Error interno del servidor." });
    }
};

module.exports = getProductStatistics;