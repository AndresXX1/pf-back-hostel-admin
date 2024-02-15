const getProductByName = require("../../controllers/products/getProductByName");

const getProductByNameHandler = async (req, res) => {
  try {
    const { name } = req.params;
    console.log("Name:", name); // Añadimos este registro (log)
    if (!name) {
      return res.status(400).json({ error: "Se requiere un nombre para la búsqueda." });
    }

    const productsFound = await getProductByName(name);

    if (productsFound.length > 0) {
      return res.status(200).json({

        productsFound: productsFound,
        totalFound: productsFound.length

      });
    } else {
      return res.status(404).json({ message: "No se encontraron productos con el nombre proporcionado." });
    }
  } catch (error) {
    return res.status(500).send(`Error interno del servidor: ${error.message}`);
  }
};

module.exports = getProductByNameHandler;