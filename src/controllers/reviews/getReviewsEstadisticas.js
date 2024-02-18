const { sequelize, Review } = require("../../db");
const { Op } = require("sequelize");

const getReviewStatistics = async (req, res) => {
    try {
        // Imprimir la hora de creación de las revisiones
        const reviews = await Review.findAll({
            limit: 1, // Solo necesitamos una revisión para obtener su hora de creación
            order: [ [ 'createdAt', 'DESC' ] ], // Ordenar por fecha de creación descendente para obtener la última revisión creada
        });
        console.log("Hora de creación de la revisión:", reviews[0].createdAt);

        // Consulta para obtener las estadísticas de revisión
        const reviewStats = await sequelize.query(
            `SELECT 
                TO_CHAR(DATE_TRUNC('hour', "createdAt" AT TIME ZONE 'UTC' AT TIME ZONE 'ART'), 'HH24:00') AS "hour",
                COUNT(*) AS "reviewCount"
            FROM 
                "Review"
            WHERE 
                "createdAt" >= CURRENT_DATE - INTERVAL '1 day'
            GROUP BY 
                DATE_TRUNC('hour', "createdAt" AT TIME ZONE 'UTC' AT TIME ZONE 'ART')
            ORDER BY 
                "hour" ASC;`,
            { type: sequelize.QueryTypes.SELECT }
        );

        res.status(200).json(reviewStats);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = getReviewStatistics;