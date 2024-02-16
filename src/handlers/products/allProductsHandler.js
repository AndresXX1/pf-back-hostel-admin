// const { allProducts } = require("../../controllers/products/getAllProducts")
// //hola
// const allProductsHandler = async (req, res) => {
//   try {
//     const { name, location ,pricePerNight,season,page , pageSize  } = req.query;
//     const setCurrentPage = (page && parseInt(page, 10) > 0) ? parseInt(page, 10) : 1;
//     let response = await allProducts();
    
//     if (name) {
//       response = response.filter(ofer => ofer.name === name);
//     }
    
//     if (location) {
//       response = response.filter(ofer => ofer.location.includes(location));
//     }
    
//     if (season) {
//       response = response.filter(ofer => ofer.season.includes(season));
//     }
    
//     if (pricePerNight) {
//       response.sort((a, b) => (pricePerNight === 'min') ? a.pricePerNight - b.pricePerNight : b.pricePerNight - a.pricePerNight);
//     }
    

//     const startIndex = (setCurrentPage - 1) * pageSize;
//     const endIndex = startIndex + parseInt(pageSize, 10);
//     const paginatedResponse = response?.slice(startIndex, endIndex);
  
//     res.status(200).json({
//       paginatedResponse,
//       setCurrentPage,
//       totalofer: response.length,
//     });
//   } catch (error) {
//     res.status(404).send("Failed to find all users, check your request again ...");
//   }
// };

// module.exports = allProductsHandler;

const { allProducts } = require("../../controllers/products/getAllProducts")


const allProductsHandler = async (req, res) => {
  try {
    const products = await allProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
};

module.exports = {
  allProductsHandler,
};