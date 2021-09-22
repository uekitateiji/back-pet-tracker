const express = require('express');
const app = express();

const rotaProprietarios = require('./routes/proprietarios');
const rotaPets = require('./routes/pets');
const rotaLogin = require('./routes/login');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/proprietarios', rotaProprietarios);
app.use('/pets', rotaPets);
app.use('/login', rotaLogin);

app.use((req, res, next) =>{
    const erro = new Error('Não encontrado');
    erro.status = 404;
    next(erro);
});

app.use((error, req, res, next) =>{
    res.status(error.status || 500);
    return res.send({
        erro: {
            mensagem: error.message
        }
    })
});

module.exports = app;
