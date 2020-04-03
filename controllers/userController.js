const Users = require ('../models/Users');

exports.formCreateAccount = (req, res) => {
    res.render('createAccount',{
        nombrePagina : 'Crear cuenta en Uptask'
    })
}

exports.formLogin = (req, res) => {
    const { error } = req.flash();
    res.render('login',{
        nombrePagina : 'Inicio de sesion en Uptask',
        error
    })
}

exports.createAccount = async (req, res) => {
    // Leer contenido
    const {email, password} = req.body;
    // Crear usuario
    try {
        await Users.create({
            email,
            password
        });
        res.redirect('/login'); 
    } catch (error) {
        req.flash('error', error.errors.map(error => error.message))
        res.render('createAccount',{
            messages: req.flash(),
            nombrePagina : 'Crear cuenta en Uptask',
            email,
            password
        })
    }
    
}

exports.restoreFormPassword = (req, res, next) => {
    res.render('restore', {
        nombrePagina: 'Restablecer Password'
    })
}