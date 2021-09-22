const express = require('express');
const router = express.Router();

const MSG_INVALIDO = "Dados inválidos";


router.post('/', (req, res) => {
    console.log('bateu')
    const dados = {
        email: req.body.email,
        password: req.body.password
    };
    console.log(dados);
    if (!dados.email || !dados.password || dados.password.length < 8) return res.status(400).send({ message: MSG_INVALIDO, error: true });

    res.status(201).send({
        token: "1234567890",
        success: true
    })

});


module.exports = router;    