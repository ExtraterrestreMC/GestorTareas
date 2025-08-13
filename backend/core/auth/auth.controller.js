const authService = require('./auth.service');
const utils = require("../../utils/Errores");
const logger = require("../../logs/logger");
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const newUser = await authService.registerUser(req.body);
        // Puedes enviar el usuario o cualquier otra información que necesites
        logger.access.info(`Nuevo usuario registrado: ${newUser.username} con ID: ${newUser.id}`);
        res.status(201).json({ message: 'Usuario registrado exitosamente', user: newUser });
    } catch (error) {
        console.log("Error al registrar el usuario:", error);
        // Puedes enviar el tipo de error si existe
        logger.error.fatal(`Error al registrar el usuario: ${error.message}`);
        res.status(400).json({
            message: error.message,
            type: error.type || 'general'
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { token, user } = await authService.loginUser(email, password);
        console.log("token:", token);
        console.log("user:", user);

        // Puedes enviar el token y el usuario o cualquier otra información que necesites
        logger.access.info(`Usuario ${user.username} autenticado con ID: ${user.id}`);

        res.status(200).json({ message: 'Inicio de sesión exitoso', token, user });
    } catch (error) {
        logger.error.fatal(`Error al iniciar sesión: ${error.message}`);
        res.status(401).json({ message: error.message });
    }
};
