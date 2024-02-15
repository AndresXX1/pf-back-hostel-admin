const { Product } = require("../../db");
const { Op } = require("sequelize");

const getProductByName = async (name) => {

  try {
    const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // Escapamos los caracteres especiales
    const products = await Product.findAll({
      where: {
        name: {
          [Op.iRegexp]: `.*${escapedName.replace(/\s/g, "\\s")}.*`, // Escapamos los espacios
        },
      },
    });
    return products;
  } catch (error) {
    throw new Error(`Error searching for products by name: ${error.message}`);
  }

};
//
module.exports = getProductByName;