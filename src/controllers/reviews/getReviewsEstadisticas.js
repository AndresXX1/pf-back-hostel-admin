const moment = require('moment-timezone');
const { sequelize, Review } = require("../../db");
const { Op } = require("sequelize");

const getReviewStatistics = async (req, res) => {
    try {
        // Obtener la fecha actual en la zona horaria de Buenos Aires
        const currentDate = moment().tz('America/Argentina/Buenos_Aires').format('YYYY-MM-DD');

        const reviewStats = await sequelize.query(
            `SELECT 
                TO_CHAR(DATE_TRUNC('hour', "createdAt" AT TIME ZONE 'UTC' AT TIME ZONE 'ART'), 'HH24:00') AS "hour",
                COUNT(*) AS "reviewCount"
            FROM 
                "Review"
            WHERE 
                "createdAt" >= :currentDate::date - INTERVAL '1 day'
            GROUP BY 
                TO_CHAR(DATE_TRUNC('hour', "createdAt" AT TIME ZONE 'UTC' AT TIME ZONE 'ART'), 'HH24:00')
            ORDER BY 
                "hour" ASC;`,
            { 
                replacements: { currentDate },
                type: sequelize.QueryTypes.SELECT 
            }
        );

        res.status(200).json(reviewStats);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = getReviewStatistics;