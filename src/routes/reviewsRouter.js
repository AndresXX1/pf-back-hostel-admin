const getAllReviews = require("../controllers/reviews/getAllReviews");
const reviewsController = require("../controllers/reviews/reviewsController");
const { Router } = require("express");
const getReviewStatistics = require ("../controllers/reviews/getReviewsDayEstadisticas");
const getReviewStatisticsSemana = require ("../controllers/reviews/ReviewsPorSemana");
const getProductStatisticsMes = require ("../controllers/reviews/ReviewsPorMes");
const getReviewStatisticsYear = require ("../controllers/reviews/reviewsPorAño");
const {updateReviewStatus} = require ("../controllers/reviews/activeReviewsAdmin")


const reviewsRouter = Router();

reviewsRouter.post("/products/detail/:idKey", reviewsController.postReviews);
reviewsRouter.get("/", getAllReviews);
reviewsRouter.get("/products/:idKey", reviewsController.getReviewsByProduct);
reviewsRouter.get("/reviews/:reviewId", reviewsController.getReviewById)
reviewsRouter.delete("/delete/:productId/:reviewId", reviewsController.deleteReviews);
reviewsRouter.get("/statistics", getReviewStatistics);
reviewsRouter.get("/statisticsSemanal", getReviewStatisticsSemana);
reviewsRouter.get("/statisticsMensual", getProductStatisticsMes);
reviewsRouter.get("/statisticsAnual", getReviewStatisticsYear);
reviewsRouter.put("/active/:reviewId",updateReviewStatus);

module.exports = reviewsRouter;

