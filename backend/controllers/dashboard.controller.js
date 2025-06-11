const userModel = require("../models/user.model");

exports.getDashboard = async (req, res) => {
  try {
    const username = req.user?.username; // asumiendo que usas middleware de autenticación

    const user = await userModel.findByUsername(username);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json({ user }); // <-- este `user` es el que recibe el frontend
  } catch (err) {
    console.error("Error en /dashboard:", err);
    res.status(500).json({ message: "Error en el servidor" });
  }
};
