const { sequelize } = require('../../db');

const rankingProductos = async (req, res) => {
  try {
    const [ranking] = await sequelize.query(`
      SELECT p."name", COUNT(*) AS "reservasCount"
      FROM "Reservas" r
      JOIN "Product" p ON r."productId" = p."id"
      GROUP BY p."name"
      ORDER BY "reservasCount" DESC
    `);

    // Modificar los nombres de las claves en el objeto de respuesta
    const modifiedRanking = ranking.map((item, index) => ({
      [index < 3 ? `Puesto N° ${index + 1}` : `N° ${index + 1}`]: item.name,
      reservasCount: item.reservasCount
    }));

    res.status(200).json({ ranking: modifiedRanking });
  } catch (error) {
    console.error('Error al generar el ranking de productos:', error);
    res.status(500).json({ error: 'Error al generar el ranking de productos' });
  }
};

module.exports = { rankingProductos };