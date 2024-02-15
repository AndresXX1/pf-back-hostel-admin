const { Op } = require("sequelize");
const { Product } = require("../../db");

async function getProductsByFilters(req, res) {
  try {
    let { temporada, localidad, pileta, orderPrice, page, pageSize } = req.query;

    page = parseInt(page);
    pageSize = parseInt(pageSize);

    if (isNaN(page) || isNaN(pageSize) || page <= 0 || pageSize <= 0) {
      return res.status(400).json({ success: false, error: 'Los parámetros de paginación son inválidos' });
    }

    const whereClause = {};
    if (temporada) whereClause.season = { [Op.contains]: [temporada] };
    if (localidad) whereClause.location = localidad;
    if (pileta === 'si') whereClause.pool = true;
    else if (pileta === 'no') whereClause.pool = false;

    // Realizar una consulta de conteo separada
    const totalCount = await Product.count({ where: whereClause });
    const totalPages = Math.ceil(totalCount / pageSize);
    // Realizar una consulta SELECT separada para obtener los productos paginados
    const offset = (page - 1) * pageSize;
    const products = await Product.findAll({
      where: whereClause,
      order: orderPrice ? [['pricePerNight', orderPrice === 'asc' ? 'ASC' : 'DESC']] : [],
      limit: pageSize,
      offset: offset
    });
    

    res.json({ success: true, products, totalCount, totalPages });
  } catch (error) {
    console.error('Error al procesar la solicitud:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
}

module.exports = getProductsByFilters;