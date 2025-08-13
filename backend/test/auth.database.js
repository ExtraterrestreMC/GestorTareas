const sequelize = require('../modules/database/auth.database'); // Importa la instancia de Sequelize
const User = require('../core/auth/auth.model'); // Importa el modelo User

sequelize.sync({ force: true }) // Sincroniza la base de datos y crea las tablas
    .then(() => {
        console.log('Conexión exitosa y tablas creadas');
        process.exit(); // Finaliza el proceso
    })
    .catch((err) => {
        console.error('Error al conectar o sincronizar la base de datos:', err);
        process.exit(1); // Finaliza el proceso con error
    });