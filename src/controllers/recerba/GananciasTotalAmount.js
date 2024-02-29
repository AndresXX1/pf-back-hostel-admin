const getReviewStatisticsMes = async (req, res) => {
    try {
        // Obtener el primer y último día del mes actual
        const today = new Date();
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

        // Consulta para obtener las estadísticas de reviews para el mes actual
        let monthStats = await getReviewStatisticsForMonth(firstDayOfMonth, lastDayOfMonth);

        // Si no hay estadísticas disponibles para el mes actual, buscar las del mes anterior
        if (monthStats.length === 0) {
            const firstDayOfPreviousMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
            const lastDayOfPreviousMonth = new Date(today.getFullYear(), today.getMonth(), 0);
            monthStats = await getReviewStatisticsForMonth(firstDayOfPreviousMonth, lastDayOfPreviousMonth);
        }

        // Si hay estadísticas disponibles, agruparlas por semana
        if (monthStats.length > 0) {
            const groupedStats = groupStatisticsByWeek(monthStats);
            const response = formatResponse(groupedStats, today.getMonth() + 1); // Mes actual
            return res.status(200).json(response);
        }

        // Si no se encuentran estadísticas para el mes actual ni para el mes anterior, devolver un mensaje indicando que no se encontraron estadísticas
        return res.status(404).json({ message: "No se encontraron estadísticas de reviews para este mes ni para el mes anterior." });

    } catch (error) {
        // Capturar cualquier error y enviar una respuesta de error interno del servidor
        console.error(error);
        return res.status(500).json({ error: "Error interno del servidor." });
    }
};