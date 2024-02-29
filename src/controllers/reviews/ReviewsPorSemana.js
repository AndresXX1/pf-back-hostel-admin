const { sequelize } = require("../../db");

const getUserStatisticsSemana = async (req, res) => {
    try {
        // Consulta para obtener estadísticas de la semana actual agrupadas por día de la semana
        const weekStats = await sequelize.query(
            `SELECT
                TO_CHAR(MIN("createdAt" AT TIME ZONE 'America/Argentina/Cordoba'), 'YYYY-MM-DD') AS "weekStartDate",
                TO_CHAR(MAX("createdAt" AT TIME ZONE 'America/Argentina/Cordoba'), 'YYYY-MM-DD') AS "weekEndDate",
                EXTRACT(DOW FROM "createdAt" AT TIME ZONE 'America/Argentina/Cordoba') AS "dayOfWeek",
                COUNT(*) AS "userCount"
            FROM
                "Review"
            WHERE
                DATE_TRUNC('week', "createdAt" AT TIME ZONE 'America/Argentina/Cordoba') = DATE_TRUNC('week', CURRENT_DATE)
            GROUP BY
                "dayOfWeek"
            ORDER BY
                "dayOfWeek" ASC;`,
            { type: sequelize.QueryTypes.SELECT }
        );

        // Si hay estadísticas disponibles para la semana actual, devolverlas
        if (weekStats.length > 0) {
            // Mapear los números de día de la semana a nombres de días
            const dayOfWeekNames = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
            weekStats.forEach(stat => {
                stat.dayOfWeek = dayOfWeekNames[parseInt(stat.dayOfWeek)];
            });
            // Eliminar la información duplicada del primer elemento
            const firstElement = { weekStartDate: weekStats[0].weekStartDate, weekEndDate: weekStats[0].weekEndDate };
            delete weekStats[0].weekStartDate;
            delete weekStats[0].weekEndDate;
            // Agregar datos de la semana actual al principio del array
            weekStats.unshift(firstElement);
            return res.status(200).json(weekStats);
        }

        // Si no hay estadísticas para la semana actual, buscar las últimas tres agrupaciones de la semana anterior con datos
        const lastWeekStats = await sequelize.query(
            `SELECT
                TO_CHAR(MIN("createdAt" AT TIME ZONE 'America/Argentina/Cordoba'), 'YYYY-MM-DD') AS "weekStartDate",
                TO_CHAR(MAX("createdAt" AT TIME ZONE 'America/Argentina/Cordoba'), 'YYYY-MM-DD') AS "weekEndDate",
                EXTRACT(DOW FROM "createdAt" AT TIME ZONE 'America/Argentina/Cordoba') AS "dayOfWeek",
                COUNT(*) AS "userCount"
            FROM
                "Review"
            WHERE
                DATE_TRUNC('week', "createdAt" AT TIME ZONE 'America/Argentina/Cordoba') < DATE_TRUNC('week', CURRENT_DATE)
            GROUP BY
                "dayOfWeek"
            ORDER BY
                "weekEndDate" DESC
            LIMIT 3;`,
            { type: sequelize.QueryTypes.SELECT }
        );

        // Si se encontraron estadísticas para la semana anterior, devolver las últimas tres agrupaciones
        if (lastWeekStats.length > 0) {
            // Mapear los números de día de la semana a nombres de días
            const dayOfWeekNames = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
            lastWeekStats.forEach(stat => {
                stat.dayOfWeek = dayOfWeekNames[parseInt(stat.dayOfWeek)];
            });
            // Eliminar la información duplicada del primer elemento
            const firstElement = { weekStartDate: lastWeekStats[0].weekStartDate, weekEndDate: lastWeekStats[0].weekEndDate };
            delete lastWeekStats[0].weekStartDate;
            delete lastWeekStats[0].weekEndDate;
            // Agregar datos de la semana anterior al principio del array
            lastWeekStats.unshift(firstElement);
            return res.status(200).json(lastWeekStats);
        }

        // Si no se encuentran fechas anteriores con estadísticas, devolver un mensaje indicando que no se encontraron estadísticas
        return res.status(404).json({ message: "No se encontraron estadísticas de usuarios." });

    } catch (error) {
        // Capturar cualquier error y enviar una respuesta de error interno del servidor
        console.error(error);
        return res.status(500).json({ error: "Error interno del servidor." });
    }
};

module.exports = getUserStatisticsSemana;