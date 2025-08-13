const express = require("express")
const app = express()
const https = require("https")
const http = require("http")
const port = process.env.PuertoServidor || 3000
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const AppError = require("./AppError");
const utils = require("./utils/Errores");
const logger = require("./logs/logger");
const authRouter = require("./core/auth/auth.routes");
const tasksRouter = require("./core/tasks/taks.routes");
const sequelize = require('./modules/database/auth.database');


// Configuración de la aplicación
app.use(express.json())

// Configuración de CORS
const whitelist = ["http://localhost:5173", "https://localhost:5173"]
const corsOptions = {
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1) {
            //console.log("Acceso a la back desde " + origin);

            logger.access.info("Acceso a la back desde " + origin);
            callback(null, true);
        } else {
            if (origin === undefined) {
                //console.log("Acceso a la back desde origen no definido (posiblemente una petición desde Postman o similar)");
                logger.access.info("Acceso a la back desde origen no definido (posiblemente una petición desde Postman o similar)");
            } else {
                //console.log("Intento de acceso a la aplicación desde origen desautorizado: " + origin);

                logger.error.fatal("Intento de acceso a la aplicación desde origen desautorizado: " + origin)

            }
            callback(null, false);
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Métodos permitidos
    credentials: true
}
app.use(cors(corsOptions));


// Configuración de los logs
//Para que los logs no se muestren cuando se accede a estas rutas
app.use(logger.express);
app.get('/', (req, res) => res.status(204).end());
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Controlar rutas no existentes
app.use((req, res, next) => {
    const mensaje = utils.noExiste(req.originalUrl);
    // Si mensaje no es string, conviértelo
    const mensajeString = typeof mensaje === "string" ? mensaje : JSON.stringify(mensaje);
    const err = new AppError(mensajeString, 404);
    next(err);
});

// Middleware de manejo de errores (debe ir al final)
app.use((err, req, res, next) => {

    console.log(`Error: ${err.message} | Status: ${err.status}`); // Esto imprime toda la traza
    // logger.error.fatal(err); // Esto también puede imprimir toda la traza

    // Mejor: solo el mensaje y el status
    logger.error.fatal(`Error: ${err.message} | Status: ${err.status}`);

    const { status = 500, message = utils.errInterno() } = err;
    res.status(status).send(message);
})


// Importar las rutas
app.use("/auth", authRouter);
//app.use("/tasks", tasksRouter);

// Para poder inicializar la aplicación en modo HTTPS, es necesario tener los certificados SSL
// en la carpeta "certificados" y definir las variables de entorno HTTPS, cert.key y cert.crt
// Si no se tienen los certificados, se puede iniciar la aplicación en modo HTTP sin problemas

if (process.env.HTTPS === "true") {
    const optionsHTTPS = {
        key: fs.readFileSync("certificados/cert.key"),
        cert: fs.readFileSync("certificados/cert.crt"),
    };

    https.createServer(optionsHTTPS, app).listen(port, () => {
        console.log("Servidor HTTPS escuchando en puerto " + port);
        console.log(
            "Para acceder a la aplicación, visita https://" +
            (process.env.HOST ? process.env.HOST : "localhost") +
            ":" + port
        );
    });
}
else {
    http.createServer(app).listen(port, () => {
        console.log("Servidor HTTP escuchando en puerto " + port);
        console.log(
            "Para acceder a la aplicación, visita http://" +
            (process.env.HOST ? process.env.HOST : "localhost") +
            ":" + port
        );
    });
}

sequelize.sync() // Crea todas las tablas si no existen
    .then(() => {
        console.log('Base de datos y tablas sincronizadas');
    })
    .catch((err) => {
        console.error('Error al sincronizar la base de datos:', err);
    });

