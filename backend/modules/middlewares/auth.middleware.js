const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Agrega los datos del usuario al request
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token inválido o expirado' });
    }
};