const jwt = require('jsonwebtoken');
const knex = require('../bancodedados/conexao');
const bcrypt = require('bcrypt')
const senhaJwt = require("../seguranca/senhajwt")

const filtrarAutenticacao = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ mensagem: 'Não autorizado' });
    }

    try {
        const token = authorization.replace('Bearer ', '').trim();

        const { id } = await jwt.verify(token, senhaJwt);

        const usuarioEncontrado = await knex('usuarios').where({ id }).first()

        if (!usuarioEncontrado) {
            return res.status(401).json({ mensagem: 'Usuário não autorizado' });
        }

        const { senha: _, ...dadosUsuario } = usuarioEncontrado;

        req.usuario = dadosUsuario;

        next();

    } catch (error) {
        return res.status(500).json({ mensagem: `Erro interno: ${error.message}` });
    }
}

module.exports = {
    filtrarAutenticacao
}