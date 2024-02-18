const { sequelize, Review, Op } = require("../../db");

const getReviewStatistics = async (req, res) => {
    try {
        const reviewStats = await Review.findAll({
            attributes: [
                [sequelize.literal('EXTRACT(hour FROM "createdAt")'), 'hour'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'reviewCount']
            ],
            where: {
                createdAt: {
                    [Op.gte]: sequelize.literal('CURRENT_DATE')
                }
            },
            group: [sequelize.literal('EXTRACT(hour FROM "createdAt")')]
        });
        
        res.status(200).json(reviewStats);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = getReviewStatistics;