const { sequelize } = require("../../db");
const { Op } = require("sequelize");

const getUserStatistics = async (req, res) => {
    try {
        // Obtener la fecha actual y la fecha del día anterior
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        // Formatear las fechas para que coincidan con el formato de la base de datos
        const todayFormatted = today.toISOString().split('T')[0];
        const yesterdayFormatted = yesterday.toISOString().split('T')[0];

        // Modificar la consulta SQL para seleccionar las estadísticas según los criterios especificados
        const userStats = await sequelize.query(
            `SELECT 
                TO_CHAR("createdAt" AT TIME ZONE 'Europe/Lisbon', 'YYYY-MM-DD') AS "date",
                TO_CHAR("createdAt" AT TIME ZONE 'Europe/Lisbon', 'HH24:00') AS "hour",
                COUNT(*) AS "userCount"
            FROM 
                "User"
            WHERE
                TO_CHAR("createdAt" AT TIME ZONE 'Europe/Lisbon', 'YYYY-MM-DD') = :today
            GROUP BY 
                TO_CHAR("createdAt" AT TIME ZONE 'Europe/Lisbon', 'YYYY-MM-DD'),
                TO_CHAR("createdAt" AT TIME ZONE 'Europe/Lisbon', 'HH24:00')
            ORDER BY 
                "date" ASC,
                "hour" ASC
            LIMIT 24;`,
            {
                replacements: { today: todayFormatted },
                type: sequelize.QueryTypes.SELECT
            }
        );

        // Verificar si se obtuvieron estadísticas para el día actual
        if (userStats.length === 0) {
            // Si no se obtuvieron estadísticas para el día actual, obtener las últimas 3 agrupaciones del día anterior
            const userStatsYesterday = await sequelize.query(
                `SELECT 
                    TO_CHAR("createdAt" AT TIME ZONE 'Europe/Lisbon', 'YYYY-MM-DD') AS "date",
                    TO_CHAR("createdAt" AT TIME ZONE 'Europe/Lisbon', 'HH24:00') AS "hour",
                    COUNT(*) AS "userCount"
                FROM 
                    "User"
                WHERE
                    TO_CHAR("createdAt" AT TIME ZONE 'Europe/Lisbon', 'YYYY-MM-DD') = :yesterday
                GROUP BY 
                    TO_CHAR("createdAt" AT TIME ZONE 'Europe/Lisbon', 'YYYY-MM-DD'),
                    TO_CHAR("createdAt" AT TIME ZONE 'Europe/Lisbon', 'HH24:00')
                ORDER BY 
                    "date" ASC,
                    "hour" ASC
                LIMIT 72;`,
                {
                    replacements: { yesterday: yesterdayFormatted },
                    type: sequelize.QueryTypes.SELECT
                }
            );

            // Verificar si se obtuvieron estadísticas para el día anterior
            if (userStatsYesterday.length === 0) {
                // Si no se obtuvieron estadísticas para el día anterior, devolver un mensaje de error
                res.status(404).json({ message: "No se encontraron estadísticas de usuarios para el día actual ni para el día anterior." });
            } else {
                // Si se obtuvieron estadísticas para el día anterior, devolverlas
                res.status(200).json(userStatsYesterday);
            }
        } else {
            // Si se obtuvieron estadísticas para el día actual, devolverlas
            res.status(200).json(userStats);
        }
    } catch (error) {
        // Capturar cualquier error y enviar una respuesta de error interno del servidor
        console.error(error);
        res.status(500).json({ error: "Error interno del servidor." });
    }
};

module.exports = getUserStatistics;