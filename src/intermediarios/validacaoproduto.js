const validarCadastroProduto = async (req, res, next) => {
    const { descricao, quantidade_estoque, valor, categoria_id } = req.body;
    try {

        if (!descricao) {
            return res.status(400).json({ mensagem: 'descricao obrigatórios' });
        }

        if (!quantidade_estoque) {
            return res.status(400).json({ mensagem: 'quantidade estoque obrigatórios' });
        }

        if (!valor) {
            return res.status(400).json({ mensagem: 'valor são obrigatórios' });
        }

        if (!categoria_id) {
            return res.status(400).json({ mensagem: 'categoria obrigatórios' });
        }

        if (Number(quantidade_estoque) <= 0) {
            return res.status(400).json({ mensagem: 'quantidade deve ser maior que 0' });
        }

        if (Number(valor) < 0) {
            return res.status(400).json({ mensagem: 'o valor não pode ser negativo' });
        }
        next()
    } catch (error) {
        console.log(error)
        return res.status(500).json({ mensagem: 'Erro interno do servidor' })
    }
}

module.exports = {
    validarCadastroProduto
}