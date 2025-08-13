const { Sequelize } = require('sequelize');
require('dotenv').config(); // Carga las variables de entorno desde .env

// Configuración de Sequelize
const sequelize = new Sequelize(
    process.env.DB_AUTH, // Nombre de la base de datos
    process.env.DB_USER, // Usuario de la base de datos
    process.env.DB_PASSWORD, // Contraseña de la base de datos
    {
        host: process.env.DB_HOST, // Host de la base de datos
        dialect: 'mysql', // Dialecto (MySQL en este caso)
        port: process.env.DB_PORT, // Puerto de la base de datos
        logging: false, // Desactiva el logging de consultas SQL (opcional)
    }
);

// Exportar la instancia de Sequelize
module.exports = sequelize;