const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const senhaJwt = require("../seguranca/senhajwt")
const knex = require('../bancodedados/conexao');

const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body;

    try {

        const emailExiste = await knex('usuarios').where({ email }).first()

        if (emailExiste) {
            return res.status(400).json('O email já existe')
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const usuario = {
            nome,
            email,
            senha: senhaCriptografada
        }
        await knex('usuarios').insert(usuario);

        return res.status(201).json('Cadastro realizado com sucesso');

    } catch (error) {
        return res.status(500).json({ mensagem: `Erro: ${error}` });
    }
}

const login = async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ mensagem: 'Email e senha são obrigatórios' });
    }

    try {

        const usuarioExistente = await knex('usuarios').where({ email }).first()

        if (!usuarioExistente) {
            return res.status(400).json({ mensagem: 'Usuário não encontrado' });
        }

        const compararSenha = await bcrypt.compare(senha, usuarioExistente.senha);

        if (!compararSenha) {
            return res.status(400).json({ mensagem: 'Email ou senha incorretos' });
        }

        const token = await jwt.sign({ id: usuarioExistente.id }, senhaJwt, { expiresIn: '36h' });

        const { senha: _, dadosUsuario } = usuarioExistente;

        return res.status(200).json({
            usuarioExistente: dadosUsuario,
            token
        })


    } catch (error) {
        return res.status(500).json({ mensagem: `Erro: ${error.mensage}` });
    }
}

const detalharUsuario = async (req, res) => {
    try {
        return res.status(200).json(req.usuario);
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' })
    }
}

const editarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body;

    try {

        const emailExisteEmOutroUsuario = await knex('usuarios').where('email', email).whereNot('id', req.usuario.id).first();

        if (emailExisteEmOutroUsuario) {
            return res.status(400).json({ mensagem: 'email ou senha inválidos' });
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const usuario = {
            nome,
            email,
            senha: senhaCriptografada
        }
        await knex('usuarios').where('id', req.usuario.id).update(usuario);

        return res.status(201).json('Usuário atualizado com sucesso');

    } catch (error) {
        return res.status(500).json({ mensagem: `Erro: ${error}` });
    }

}

module.exports = {
    cadastrarUsuario,
    login,
    detalharUsuario,
    editarUsuario
}