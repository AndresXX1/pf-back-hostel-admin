const { sequelize, Review } = require("../../db");
const { Op } = require("sequelize");

const getReviewStatistics = async (req, res) => {
    try {
        const reviewStats = await Review.findAll({
            attributes: [
                [sequelize.literal('HOUR("createdAt")'), 'hour'], // Extraer la hora de "createdAt"
                [sequelize.fn('COUNT', sequelize.col('id')), 'reviewCount']
            ],
            group: [sequelize.literal('HOUR("createdAt")')],
            where: {
                createdAt: {
                    [Op.gte]: sequelize.literal('CURDATE()') // Filtrar para obtener solo las revisiones de hoy
                }
            }
        });
        
        res.status(200).json(reviewStats);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = getReviewStatistics;