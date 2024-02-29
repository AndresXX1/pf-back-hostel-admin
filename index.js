const { sequelize } = require("./src/db");
const { Product } = require("./src/db");
const server = require("./src/server");

const PORT = 3003;

sequelize
  .sync({ force: false })
  .then(async () => {
    const allSnikers = await Product.findAll();
    if (!allSnikers.length) {
      
    } else {
      console.log("Database Loaded");
    }
    server.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((error) => console.error(error));

  //dsadsa