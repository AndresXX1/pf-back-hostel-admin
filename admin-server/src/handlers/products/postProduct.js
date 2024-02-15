const { postProduct } = require('../../controllers/products/postProductsDb');

const postProductsHandler = async (req, res) => {
  const { name, location ,season, pricePerNight, totalRooms, pool ,images} = req.body;
  try {
    const response = await postProduct(name, location, season, pricePerNight, totalRooms, pool, req, images);
    console.log(response);
    res.status(201).json(response);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

module.exports = postProductsHandler;