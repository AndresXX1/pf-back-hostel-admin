require("dotenv").config();
const { DB_HOST, DB_NAME, DB_PASSWORD, DB_USER, NODE_ENV } = process.env;
const productsModel = require("./models/productsModel");
const reviewsModel = require("./models/reviewsModel");
const usersModel = require("./models/usersModel");

const { Sequelize } = require("sequelize");

let sequelize =
  process.env.NODE_ENV === "production"
    ? new Sequelize({
        database: "railway",
        username: "postgres",
        password: "gD2C323*G41dfaCFddBA-f2D-g*2AaFD",
        host: "monorail.proxy.rlwy.net",
        port: 30582,
        dialect: "postgres",
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        },
        logging: false,
        native: false,
      })
    : 
    new Sequelize(
        `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`,
        {
          logging: false,
          native: false,
        }
      );

productsModel(sequelize);
reviewsModel(sequelize);
usersModel(sequelize);


const { Review, Product, User, Cart, CartItem } = sequelize.models; 

Product.hasMany(Review, { foreignKey: "productId", as: "review" });
Review.belongsTo(Product, { foreignKey: "productId", as: "review" });

User.hasMany(Review, { foreignKey: "userId" });
Review.belongsTo(User, { foreignKey: "userId" });





module.exports = { sequelize, Product, Review, User, Cart, CartItem }; 
