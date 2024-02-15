const knex = require('../bancodedados/conexao');

const cadastrarCliente = async (req, res) => {
    const { nome, email, cpf } = req.body;

    if (!nome || !email || !cpf) {
        return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios' });
    }

    try {

        const emailExiste = await knex('clientes').where({ email }).first()

        if (emailExiste) {
            return res.status(400).json('Dados informados já cadastrados')
        }

        const cpfExiste = await knex('clientes').where({ cpf }).first()

        if (cpfExiste) {
            return res.status(400).json('Dados informados já cadastrados')
        }

        const cliente = {
            nome,
            email,
            cpf
        }
        await knex('clientes').insert(cliente);
        const novoRegistro = await knex('clientes').orderBy('id', 'desc').first();

        return res.status(201).json(novoRegistro);

    } catch (error) {
        return res.status(500).json({ mensagem: `Erro: ${error}` });
    }
}

const editarDadosCliente = async (req, res) => {
    const { nome, email, cpf } = req.body;
    const { id } = req.params;

    const idExistente = await knex('clientes').where("id", id);

    if (!idExistente || idExistente.length === 0) {
        return res.status(400).json({ mensagem: 'id não encontrado' });
    }

    if (!nome || !email || !cpf) {
        return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios' });
    }

    try {

        const emailExisteEmOutroCliente = await knex('clientes').where('email', email).whereNot('id', id).first();

        if (emailExisteEmOutroCliente) {
            return res.status(400).json({ mensagem: 'email ou cpf inválidos' });
        }

        const cpfExisteEmOutroCliente = await knex('clientes').where('cpf', cpf).whereNot('id', id).first();

        if (cpfExisteEmOutroCliente) {
            return res.status(400).json({ mensagem: 'email ou cpf inválidos' });
        }

        const cliente = {
            nome,
            email,
            cpf
        }
        await knex('clientes').where('id', id).update(cliente);

        return res.status(201).json('Cliente atualizado com sucesso');

    } catch (error) {
        return res.status(500).json({ mensagem: `Erro: ${error}` });
    }

}

const listarClientes = async (req, res) => {
    const todosOsClientes = await knex('clientes')
    return res.status(200).json(todosOsClientes);
}

const detalharCliente = async (req, res) => {
    const { id } = req.params;

    const idExistente = await knex('clientes').where("id", id);

    if (!idExistente || idExistente.length === 0) {
        return res.status(400).json({ mensagem: 'id não encontrado' });
    }

    try {
        const cliente = await knex('clientes').where('id', id);
        return res.status(200).json(cliente);
    } catch (error) {
        return res.status(500).json({ mensagem: `Erro: ${error}` });
    }

}

module.exports = {
    cadastrarCliente,
    editarDadosCliente,
    listarClientes,
    detalharCliente
}