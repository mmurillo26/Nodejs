const passport = require ('passport');
const crypto = require ('crypto');
const bcrypt = require('bcrypt-nodejs');
const Sequelize = require ('sequelize');
const Op = Sequelize.Op;
const Users = require ('../models/Users');
const sendEmail = require ('../handlers/email');

exports.authenticateUser = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
    badRequestMessage: 'Both fields must be obligatory'
});

exports.userAuthenticated = (req, res, next) => {
    // si el usuario esta autenticado adelante
    if(req.isAuthenticated()) {
        return next();
    }
    // si no esta autenticado redirigir al formulario
    return res.redirect('/login');
}

exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    })
}

exports.sendToken = async (req, res) => {
    const {email} = req.body;

    try {
        const user = await Users.findOne({ where: { email }});

        // user existe
        user.token = crypto.randomBytes(20).toString('hex');
        user.expiration = Date.now() + 3600000;

        // guardar datos en la bd
        await user.save();

        // url de reset
        const resetUrl = `http://${req.headers.host}/restore/${user.token}`;
        // res.redirect(resetUrl);

        // enviar correo con el token
        await sendEmail.send({
            user,
            subject: 'Password Reset',
            resetUrl,
            file: 'restore-password'
        });
        req.flash('correcto', 'We have send an email to you, check your inbox');
        res.redirect('/login');
    } catch (error) {
        req.flash('error', 'This account does not exists');
        res.redirect('/restore');
    }
}

exports.resetPassword = async (req, res) => {
    const user = await Users.findOne({
        where: {
            token: req.params.token
        }
    });
    console.log(user);

    // si no encuetra al usuario
    if(!user) {
        req.flash('error', 'email no valid');
        res.redirect('/restore');
    }

    // Form para generar el nuevo password
    res.render('resetPassword', {
        nombrePagina: 'Restablecer Password'
    });
}

// actualizar password
exports.updatePassword = async (req, res) => {
    const user = await Users.findOne({
        where: {
            token: req.params.token,
            expiration: {
                [Op.gte] : Date.now()
            }
        }
    });

    if(!user) {
        req.flash('error', 'no valid');
        res.redirect('/restore');
    }

    // hashear nuevo password
    user.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    user.token = null;
    user.expiration = null;

    // guardar en la db
    await user.save();

    req.flash('correcto', 'Your password has ben modified correctly')
    res.redirect('/login');
}