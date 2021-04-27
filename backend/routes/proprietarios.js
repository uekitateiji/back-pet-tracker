const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

const MSG_NAO_ENCONTRADO = "Proprietário não encontrado";
const MSG_INVALIDO = "Dados inválidos";
const MSG_NAO_ENCONTROU = "Não encontrou dados para a seleção";

router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        conn.query(
            'SELECT * FROM T_PROPRIETARIOS',
            (error, resultado) => {
                conn.release();

                if (error)  return res.status(500).send({ error: error })
            
                if(!resultado.length) return res.status(404).send({ message: MSG_NAO_ENCONTROU });

                res.status(201).send({
                    data: resultado
                })
            }
        )
    })
});

router.get('/:id_proprietario', (req, res, next) => {

    mysql.getConnection((error, conn) => {
        conn.query(
            'SELECT * FROM T_PROPRIETARIOS WHERE id = ?',
            [req.params.id_proprietario],
            (error, resultado) => {
                conn.release();

                if (error) return res.status(500).send({ error: error });
                
                if(!resultado.length) return res.status(404).send({ message: MSG_NAO_ENCONTROU });

                res.status(201).send({
                    data: resultado
                })
            }
        )
    })
});

router.post('/', (req, res, next) => {

    const proprietario = {
        nome: req.body.nome,
        email: req.body.nome,
        sobrenome: req.body.sobrenome,
        password: req.body.password
    }

    mysql.getConnection((error, conn) => {
        conn.query(
            'INSERT INTO T_PROPRIETARIOS (nome, email, sobrenome, password) VALUES (?, ?, ?, ?)',
            [proprietario.nome, proprietario.email, proprietario.sobrenome, proprietario.password],
            (error) => {
                conn.release();

                if (error) return res.status(500).send({ error: error });

                if(!proprietario.nome || !proprietario.email || !proprietario.sobrenome || !proprietario.password) return res.status(400).send({ message: MSG_INVALIDO });

                res.status(201).send({
                    message: "Proprietário cadastrado com sucesso",
                    proprietarioCadastrado: proprietario
                })
            }
        )
    });


});

router.patch('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        
        const proprietario = {
            id: req.body.id,
            nome: req.body.nome,
            email: req.body.nome,
            sobrenome: req.body.sobrenome,
            password: req.body.password
        }
        
        conn.query(
            'UPDATE T_PROPRIETARIOS SET nome = ?, email = ?, sobrenome = ?, password = ? WHERE id = ?',
            [proprietario.nome, proprietario.email, proprietario.sobrenome, proprietario.password, proprietario.id],
            (error, resultado) => {
                conn.release();

                if (error) return res.status(500).send({ error: error });

                if(!proprietario.id || !proprietario.nome || !proprietario.email || !proprietario.sobrenome || !proprietario.password) return res.status(400).send({ message: MSG_INVALIDO });

                if(!resultado.affectedRows) return res.status(400).send({ message: MSG_NAO_ENCONTRADO });

                res.status(201).send({
                    message: "Proprietário alterado com sucesso",
                    proprietarioAlterado: proprietario
                })
            }
        )
    });
});

router.delete('/', (req, res, next) => {
    
    mysql.getConnection((error, conn) => {
        conn.query(
            'DELETE FROM T_PROPRIETARIOS WHERE id = ?',
            [req.body.id],
            (error, resultado) => {
                conn.release();

                if (error) return res.status(500).send({ error: error });
                
                if(!resultado.affectedRows) return res.status(400).send({ message: MSG_NAO_ENCONTRADO });

                res.status(201).send({
                    message: "Proprietário deletado com sucesso"
                })
            }
        )
    })
});

module.exports = router;