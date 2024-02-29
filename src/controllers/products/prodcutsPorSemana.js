const { sequelize } = require("../../db");

const getReviewStatisticsSemana = async (req, res) => {
    try {
        const weekStartDate = new Date();
        weekStartDate.setHours(0, 0, 0, 0);
        weekStartDate.setDate(weekStartDate.getDate() - weekStartDate.getDay());

        const weekEndDate = new Date(weekStartDate);
        weekEndDate.setDate(weekEndDate.getDate() + 6);

        const formatDate = date => date.toISOString().split('T')[0];

        const executeQuery = async (startDate, endDate) => {
            return await sequelize.query(
                `SELECT
                    EXTRACT(DOW FROM "createdAt" AT TIME ZONE 'America/Argentina/Cordoba') AS "dayOfWeek",
                    COUNT(*) AS "productCount"
                FROM
                    "Product"
                WHERE
                    "createdAt" >= :startDate AND "createdAt" <= :endDate
                GROUP BY
                    "dayOfWeek"
                ORDER BY
                    "dayOfWeek" ASC;`,
                {
                    type: sequelize.QueryTypes.SELECT,
                    replacements: { startDate, endDate }
                }
            );
        };

        const mapDayOfWeekNames = stats => {
            const dayOfWeekNames = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
            stats.forEach(stat => {
                stat.dayOfWeek = dayOfWeekNames[parseInt(stat.dayOfWeek)];
            });
            return stats;
        };

        let stats = await executeQuery(weekStartDate, weekEndDate);
        if (stats.length === 0) {
            stats = await executeQuery(new Date(weekStartDate.getTime() - 7 * 24 * 60 * 60 * 1000), new Date(weekEndDate.getTime() - 7 * 24 * 60 * 60 * 1000));
        }

        if (stats.length > 0) {
            stats = mapDayOfWeekNames(stats);
            return res.status(200).json([
                { weekStartDate: formatDate(weekStartDate), weekEndDate: formatDate(weekEndDate) },
                ...stats
            ]);
        }

        return res.status(404).json({ message: "No se encontraron estadísticas de productos." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error interno del servidor." });
    }
};

module.exports = getReviewStatisticsSemana;