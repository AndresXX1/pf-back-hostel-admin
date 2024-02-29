const { Review } = require("../../db");

const updateReviewStatus = async (req, res) => {
 const reviewId = req.params.reviewId;
 const newStatus = req.body.activo;

 try {
    // Actualizar el estado de la review directamente en la base de datos
    await Review.update({ active: newStatus }, {
      where: { id: reviewId }
    });

    const message = newStatus ? "Review desactivada exitosamente" : "Review activada exitosamente";
    return res.status(200).json({ message: message });
 } catch (error) {
    console.error("Error actualizando estado de la review:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
 }
};

module.exports = {
 updateReviewStatus,
};