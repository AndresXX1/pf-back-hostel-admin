const { sequelize, Review } = require("../../db");
const { Op } = require("sequelize");

const getReviewStatistics = async (req, res) => {
    try {
        const reviewStats = await Review.findAll({
            attributes: [
                [sequelize.literal('DATE_TRUNC(\'hour\', "createdAt")'), 'hour'], // Truncar la fecha a la hora más cercana
                [sequelize.fn('COUNT', sequelize.col('id')), 'reviewCount']
            ],
            where: {
                createdAt: {
                    [Op.gte]: sequelize.literal('CURRENT_DATE - INTERVAL \'1 day\'') // Obtener revisiones de las últimas 24 horas
                }
            },
            group: [sequelize.literal('DATE_TRUNC(\'hour\', "createdAt")')] // Agrupar por hora truncada
        });

        // Crear un arreglo con todas las horas del día en formato '00:00'
        const hoursOfDay = Array.from({ length: 24 }, (_, i) => `${i < 10 ? '0' : ''}${i}:00`);
        // Mapear el resultado de la consulta para asegurarse de que todas las horas estén presentes
        const formattedStats = hoursOfDay.map(hour => {
            const matchingStat = reviewStats.find(stat => stat.hour === hour);
            return {
                hour: hour,
                reviewCount: matchingStat ? matchingStat.reviewCount : 0 // Usar el recuento de revisiones si está disponible, de lo contrario, establecer en 0
            };
        });

        res.status(200).json(formattedStats);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = getReviewStatistics;