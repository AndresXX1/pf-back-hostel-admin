const { Review, sequelize } = require("../../db");
const { Op } = require("sequelize");
const moment = require("moment-timezone");

const getReviewStatistics = async (req, res) => {
    try {
        const today = moment.tz('America/Argentina/Buenos_Aires').startOf('day');
        const yesterday = moment(today).subtract(1, 'day');

        const reviewStats = await Review.findAll({
            attributes: [
                [sequelize.literal(`TO_CHAR("createdAt" AT TIME ZONE 'UTC' AT TIME ZONE 'ART', 'HH24:00')`), 'hour'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'reviewCount']
            ],
            where: {
                createdAt: {
                    [Op.between]: [yesterday, today]
                }
            },
            group: [sequelize.literal(`TO_CHAR("createdAt" AT TIME ZONE 'UTC' AT TIME ZONE 'ART', 'HH24:00')`)],
            order: [[sequelize.literal(`TO_CHAR("createdAt" AT TIME ZONE 'UTC' AT TIME ZONE 'ART', 'HH24:00')`), 'ASC']]
        });

        res.status(200).json(reviewStats);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = getReviewStatistics;