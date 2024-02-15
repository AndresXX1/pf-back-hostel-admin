const { Product } = require("../../db");


const postProduct = async (name, location, season, pricePerNight, totalRooms, pool, req, images) => {
  console.log("Iniciando postProduct");
  const maxId = await Product.max('id');
  const newId = maxId + 1;
  console.log("ID del nuevo producto: ", newId);
  const postInDb = await Product.create({ id: newId, name, location, season, pricePerNight, totalRooms, pool, req, images });
  console.log("Producto creado: ", postInDb);
  console.log("Producto final: ", postInDb);
  return postInDb;
};


module.exports = { postProduct };