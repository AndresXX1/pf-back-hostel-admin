const { sequelize } = require("../../db");

const getUserStatisticsYear = async (req, res) => {
    try {
        // Obtener el año actual
        const currentYear = new Date().getFullYear();

        // Consulta para obtener las estadísticas de usuarios para el año actual
        const yearStats = await getUserStatisticsForYear(currentYear);

        // Si hay estadísticas disponibles, agruparlas por mes
        if (yearStats.length > 0) {
            const groupedStats = groupStatisticsByMonth(yearStats);
            const response = formatResponse(groupedStats, currentYear);
            return res.status(200).json(response);
        }

        // Si no se encuentran estadísticas para el año actual, devolver un mensaje indicando que no se encontraron estadísticas
        return res.status(404).json({ message: "No se encontraron estadísticas de usuarios para este año." });

    } catch (error) {
        // Capturar cualquier error y enviar una respuesta de error interno del servidor
        console.error(error);
        return res.status(500).json({ error: "Error interno del servidor." });
    }
};

// Función para obtener las estadísticas de usuarios para un año dado
const getUserStatisticsForYear = async (year) => {
    const yearStats = await sequelize.query(
        `SELECT
            TO_CHAR("createdAt" AT TIME ZONE 'America/Argentina/Cordoba', 'Month') AS "month",
            COUNT(*) AS "userCount"
        FROM
            "User"
        WHERE
            EXTRACT(YEAR FROM "createdAt" AT TIME ZONE 'America/Argentina/Cordoba') = :year
        GROUP BY
            "month"
        ORDER BY
            "month" ASC;`,
        {
            replacements: { year },
            type: sequelize.QueryTypes.SELECT
        }
    );
    return yearStats;
};

// Función para agrupar las estadísticas por mes
const groupStatisticsByMonth = (stats) => {
    const groupedStats = {};
    stats.forEach(stat => {
        const month = stat.month;
        if (!groupedStats[month]) {
            groupedStats[month] = [];
        }
        groupedStats[month].push(stat);
    });
    return groupedStats;
};

// Función para formatear la respuesta según la estructura requerida
const formatResponse = (groupedStats, year) => {
    const response = [
        { year: year }
    ];
    Object.keys(groupedStats).forEach(month => {
        const monthStats = groupedStats[month];
        const totalUserCount = monthStats.reduce((total, stat) => total + parseInt(stat.userCount), 0);
        response.push({ Month: month, userCount: totalUserCount.toString() });
    });
    return response;
};

module.exports = getUserStatisticsYear;