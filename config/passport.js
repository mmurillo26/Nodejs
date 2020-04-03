const passport = require('passport');
const LocalStrategy = require('passport-local');

// Referencia al modelo donde se autenticara
const Users = require('../models/Users');

// local strategy - login con credenciales propias
passport.use(
    new LocalStrategy(
        // por default passport espera un usuario y password
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done) => {
            try {
                const user = await Users.findOne({
                    where: {email}
                });
                // password incorrecto
                if(!user.verifyPassword(password)) {
                    return done(null, false, {
                        message: 'Incorrect password'
                    })
                }
                // todo OK
                return done(null, user);

            } catch (error) {
                return done(null, false, {
                    message: 'This email no exists'
                })
            }
        }
    )
);

// serializar usuario
passport.serializeUser((user, callback) => {
    callback(null, user);
})

// deserializar usuario
passport.deserializeUser((user, callback) => {
    callback(null, user);
})

// exportar
module.exports = passport;