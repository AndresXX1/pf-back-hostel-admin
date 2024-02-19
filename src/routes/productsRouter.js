const { Router } = require("express");
const getProductByIdHandler = require("../handlers/products/productByIdHandler");
const {allProductsHandler} = require("../handlers/products/allProductsHandler");
const postProductsHandler = require("../handlers/products/postProduct");
const validateProducts = require("../middlewares/products/productsMiddleware");
const getProductByNameHandler = require("../handlers/products/productByNameHandler")
const deleteProductsHandler = require("../handlers/products/deleteProductHandler")
const getProductsByFilters = require ("../controllers/products/getFiletrController")
const getProductStatistics = require ("../controllers/products/getProductDayStatistics")
const {updateProduct} = require ("../controllers/products/edditProductAdmin");

const productsRouter = Router();

productsRouter.get("/search/:name", getProductByNameHandler);
productsRouter.get("/", allProductsHandler);
productsRouter.post("/create", postProductsHandler);
productsRouter.get("/detail/:idKey", getProductByIdHandler);
productsRouter.delete("/delete/:idKey", deleteProductsHandler);
productsRouter.get("/filter", getProductsByFilters);
productsRouter.get("/estadisticDay", getProductStatistics);
productsRouter.put("/edditProduct/:productId", updateProduct)

module.exports = productsRouter;

