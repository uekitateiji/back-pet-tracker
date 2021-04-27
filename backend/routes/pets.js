const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

const MSG_NAO_ENCONTRADO = "Proprietário não encontrado";
const MSG_NAO_ENCONTRADO_PET = "Pet não encontrado";
const MSG_INVALIDO = "Dados inválidos";
const MSG_NAO_ENCONTROU = "Não encontrou dados para a seleção";

router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        conn.query(
            'SELECT * FROM T_PETS',
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

router.get('/:id_pet', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        conn.query(
            'SELECT * FROM T_PETS WHERE id = ?',
            [req.params.id_pet],
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

    const pet = {
        nome: req.body.nome,
        idade: req.body.idade,
        raca: req.body.raca,
        id_proprietario: req.body.id_proprietario
    };

    mysql.getConnection((error, conn) => {
        conn.query(
            'INSERT INTO T_PETS (nome, idade, raca, T_PROPRIETARIOS_id) VALUES(?, ?, ?, ?)',
            [pet.nome, pet.idade, pet.raca, pet.id_proprietario],
            (error, resultado, field) => {
                conn.release();
                
                if(error) {
                    if(error.sqlMessage.indexOf("foreign key constraint fails" > 0)){
                        return res.status(500).send({ error: MSG_NAO_ENCONTRADO });
                    }
                        return res.status(500).send({ error: error });
                }

                if(!pet.nome || !pet.idade || !pet.raca || !pet.id_proprietario) return res.status(400).send({ message: MSG_INVALIDO });

                if(!resultado.affectedRows) return res.status(400).send({ message: MSG_NAO_ENCONTRADO });

                res.status(201).send({
                    message: "Pet cadastrado com sucesso",
                    petCadastrado: pet
                })
            }
        )
    })

});

router.patch('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        
        const pet = {
            id: req.body.id,
            nome: req.body.nome,
            idade: req.body.idade,
            raca: req.body.raca
        }
        
        conn.query(
            'UPDATE T_PETS SET nome = ?, idade = ?, raca = ? WHERE id = ?',
            [pet.nome, pet.idade, pet.raca, pet.id],
            (error, resultado) => {
                conn.release();

                if (error) return res.status(500).send({ error: error });

                if(!pet.nome || !pet.idade || !pet.raca || !pet.id) return res.status(400).send({ message: MSG_INVALIDO });

                if(!resultado.affectedRows) return res.status(400).send({ message: MSG_NAO_ENCONTRADO });

                res.status(201).send({
                    message: "Pet alterado com sucesso",
                    petAlterado: pet
                })
            }
        )
    });
});

router.delete('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        conn.query(
            'DELETE FROM T_PETS WHERE id = ?',
            [req.body.id],
            (error, resultado) => {
                conn.release();

                if (error) return res.status(500).send({ error: error });
                
                if(!resultado.affectedRows) return res.status(400).send({ message: MSG_NAO_ENCONTRADO_PET });

                res.status(201).send({
                    message: "Pet deletado com sucesso"
                })
            }
        )
    })
});

module.exports = router;