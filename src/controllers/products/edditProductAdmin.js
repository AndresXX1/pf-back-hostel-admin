const { Product } = require("../../db");

const updateProduct = async (req, res) => {
  const productId = req.params.productId;
  const updatedProductData = req.body;

  try {
    const product = await Product.findByPk(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

   
    if ('season' in updatedProductData) {
      
      if (!Array.isArray(updatedProductData.season)) {
        
        updatedProductData.season = updatedProductData.season
          .replace(/[{}]/g, '') 
          .split(',')
          .map(season => season.trim());
      }
    }

   
    await product.update(updatedProductData);

    return res.status(200).json({ message: "Product updated successfully", product });
  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  updateProduct,
};