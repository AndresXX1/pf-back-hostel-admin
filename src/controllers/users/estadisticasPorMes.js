const { sequelize } = require("../../db");

const getUserStatisticsMes = async (req, res) => {
    try {
        // Obtener el primer y último día del mes actual
        const today = new Date();
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

        // Consulta para obtener las estadísticas de usuarios para el mes actual
        const monthStats = await getUserStatisticsForMonth(firstDayOfMonth, lastDayOfMonth);

        // Si hay estadísticas disponibles, agruparlas por semana
        if (monthStats.length > 0) {
            const groupedStats = groupStatisticsByWeek(monthStats);
            const response = formatResponse(groupedStats, today.getMonth() + 1); // Mes actual
            return res.status(200).json(response);
        }

        // Si no se encuentran estadísticas para el mes actual, devolver un mensaje indicando que no se encontraron estadísticas
        return res.status(404).json({ message: "No se encontraron estadísticas de usuarios para este mes." });

    } catch (error) {
        // Capturar cualquier error y enviar una respuesta de error interno del servidor
        console.error(error);
        return res.status(500).json({ error: "Error interno del servidor." });
    }
};

// Función para obtener las estadísticas de usuarios para un mes dado
const getUserStatisticsForMonth = async (startDate, endDate) => {
    const monthStats = await sequelize.query(
        `SELECT
            TO_CHAR(MIN("createdAt" AT TIME ZONE 'America/Argentina/Cordoba'), 'YYYY-MM-DD') AS "weekStartDate",
            TO_CHAR(MAX("createdAt" AT TIME ZONE 'America/Argentina/Cordoba'), 'YYYY-MM-DD') AS "weekEndDate",
            EXTRACT(WEEK FROM "createdAt" AT TIME ZONE 'America/Argentina/Cordoba') AS "weekNumber",
            COUNT(*) AS "userCount"
        FROM
            "User"
        WHERE
            "createdAt" AT TIME ZONE 'America/Argentina/Cordoba' BETWEEN :startDate AND :endDate
        GROUP BY
            "weekNumber"
        ORDER BY
            "weekNumber" ASC;`,
        {
            replacements: { startDate, endDate },
            type: sequelize.QueryTypes.SELECT
        }
    );
    return monthStats;
};

// Función para agrupar las estadísticas por semana
const groupStatisticsByWeek = (stats) => {
    const groupedStats = {};
    stats.forEach(stat => {
        // Calcular el número de semana dentro del mes
        const firstDayOfMonth = new Date(stat.weekStartDate);
        const weekWithinMonth = Math.ceil((new Date(stat.weekStartDate).getDate() + 6 - firstDayOfMonth.getDay()) / 7);

        if (!groupedStats[weekWithinMonth]) {
            groupedStats[weekWithinMonth] = [];
        }
        groupedStats[weekWithinMonth].push(stat);
    });
    return groupedStats;
};

// Función para formatear la respuesta según la estructura requerida
const formatResponse = (groupedStats, currentMonth) => {
    const response = [
        { monthDate: `${new Date().getFullYear()}-${currentMonth < 10 ? '0' + currentMonth : currentMonth}` }
    ];
    Object.keys(groupedStats).forEach(weekNumber => {
        const weekStats = groupedStats[weekNumber];
        const totalUserCount = weekStats.reduce((total, stat) => total + parseInt(stat.userCount), 0);
        response.push({ Week: `Semana ${weekNumber}`, userCount: totalUserCount.toString() });
    });
    return response;
};

module.exports = getUserStatisticsMes;