const { Router } = require("express");
const {createReservation} = require("../controllers/recerba/postRecerva");
const getHourlyReservationStatistics = require ("../controllers/recerba/estadisticasPorDia");
const {rankingProductos} = require ("../controllers/recerba/rankingReservas");
const {allReservasHandler} = require ("../controllers/recerba/getAllReservas");
const {deleteReserva} = require ("../controllers/recerba/deleteReserva");

const RecerbaRouter = Router();

RecerbaRouter.post("/new", createReservation);
RecerbaRouter.get("/estadistica", getHourlyReservationStatistics);
RecerbaRouter.get("/ranking",rankingProductos);
RecerbaRouter.get("/todas",allReservasHandler);
RecerbaRouter.delete("/delete/:reservaId", deleteReserva);


module.exports = RecerbaRouter;