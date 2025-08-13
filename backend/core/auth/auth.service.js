const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./auth.model');

// Registrar un nuevo usuario
const registerUser = async (userData) => {

    const { email, username, password } = userData;



    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ where: { email } });
    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername) {
        const error = new Error('El nombre de usuario ya está registrado');
        error.type = 'username';
        throw error;
    }
    if (existingUser) {
        const error = new Error('El email ya está registrado');
        error.type = 'email';
        throw error;
    }


    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Contraseña encriptada:", hashedPassword);


    // Crear el usuario en el servicio de autenticación
    const newUser = await User.create({
        email,
        username,
        password: hashedPassword,
    });

    return newUser;
};

// Iniciar sesión
const loginUser = async (email, password) => {

    const user = await User.findOne({ where: { email } });
    if (!user) {
        throw new Error('Usuario no encontrado');
    }

    // Verificar la contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error('Contraseña incorrecta');
    }

    // Generar un token JWT
    const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET || 'secret_key',
        { expiresIn: '1h' }
    );
    return { token, user };
};
module.exports = {
    registerUser,
    loginUser
};
