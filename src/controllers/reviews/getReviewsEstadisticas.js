const { sequelize, Review } = require("../../db");
const { Op } = require("sequelize");



const getReviewStatistics = async (req, res) => {
    try {
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