const { Product } = require("../../db");

const deleteProducts = async (idKey) => {
    const product = await Product.findByPk(idKey);
    if (!product) {
        throw new Error('No se encontró el producto.');
    }
    await product.destroy(); // Eliminar el producto de la base de datos
    return product; // Opcional: devolver el producto eliminado
}

module.exports = {
    deleteProducts
}