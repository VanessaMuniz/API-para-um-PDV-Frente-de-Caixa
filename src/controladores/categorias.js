const knex = require('../bancodedados/conexao');

const listarCategorias = async (req, res) => {
    try {
        const categorias = await knex('categorias').select('*');
        return res.status(200).json(categorias);
    } catch (error) {
        console.log(error)
        return res.status(500).json({ mensagem: 'Erro interno do servidor' })
    }
}

module.exports = listarCategorias