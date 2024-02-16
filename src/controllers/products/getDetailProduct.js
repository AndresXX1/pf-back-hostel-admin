const axios = require("axios");
const {Product,Review} = require("../../db")
const getById = async (idKey) => {
  const response = await Product.findByPk(idKey, {
    include: [{ model: Review,  as: 'review' }],
  });
  if (response && response.review !== null) {
    const reviews = response['review'] || [];
    
    const result = {
      id: response.id,
      name: response.name,
      location: response.location,
      season: response.season,
      pricePerNight: response.pricePerNight,
      totalRooms: response.totalRooms,
      pool: response.pool,
      images: response.images,
      reviews: reviews.map(rew => ({
        id: rew.id,
        content: rew.content,
        rating: rew.rating,
      })) ,
    };
      console.log("op")
      return result;
      
     }
     return null
};

module.exports = {
  getById,
};
