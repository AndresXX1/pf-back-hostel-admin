const { User } = require("../../db");

const banUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      console.error(`Usuario con ID ${userId} no encontrado`);
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Aplicar el banneo
    user.banned = true;
    user.bannedAt = new Date();
    await user.save();

    return res.status(200).json({ message: "Usuario baneado exitosamente" });
  } catch (error) {
    console.error("Error baneando usuario:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

const unbanUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      console.error(`Usuario con ID ${userId} no encontrado`);
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Levantar el banneo
    user.banned = false;
    user.bannedAt = null; // Eliminar la fecha de banneo
    await user.save();

    return res.status(200).json({ message: "Usuario des-baneado exitosamente" });
  } catch (error) {
    console.error("Error des-baneando usuario:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

module.exports = {
  banUser,
  unbanUser,
};