/**
 * Mensajes para devolver JSON
 */
exports.noExiste = (valor) => {
    return JSON.parse(` { "codError": "404", "desc" : " ${valor} no existe" }`);
};
exports.errInterno = (err) => {
    return JSON.parse(` { "codError": "500", "desc": " ${err}" }`);
};
exports.parametrosIncorrectos = () => {
    return JSON.parse(` { "codError": "406", "desc": "datos incorrectos" }`);
}
exports.parametroDucplicado = () => {
    return JSON.parse(` { "codError": "406", "desc": "DNI / Correo ya existe" }`);
}
exports.missingDatos = () => {
    return JSON.parse(` { "codError": "406", "desc": "faltan datos" }`);
};
exports.editadoCorrectamente = (valor) => {
    return JSON.parse(` { "info": "${valor} editado correctamente"}`);
};
exports.borradoCorrectamente = (valor) => {
    return JSON.parse(` { "info": "${valor} borrado correctamente"}`);
};
exports.creadoCorrectamente = (valor) => {
    return JSON.parse(` { "info": "${valor} creado correctamente"}`);
};

exports.baseDatosNoConectada = (err) => {
    return JSON.parse(` { "codError": "500", "desc": "base de datos no conectada" }`);
}
exports.wrapAsync = (fn) => {
    return function (req, res, next) {
        fn(req, res, next).catch(e => {
            next(e)
        });
    }
}