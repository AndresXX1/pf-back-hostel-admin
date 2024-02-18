const { sequelize, Review } = require("../../db");

const getReviewStatistics = async (req, res) => {
    try {
        const reviewStats = await Review.findAll({
            attributes: [
                [sequelize.literal('DATE(createdAt)'), 'date'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'reviewCount']
            ],
            group: [sequelize.literal('DATE(createdAt)')]
        });

        res.status(200).json(reviewStats);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = getReviewStatistics;