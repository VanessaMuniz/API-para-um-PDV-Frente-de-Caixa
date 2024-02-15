
const validarCadastroPedido = async (req, res, next) => {
    const { cliente_id, pedido_produtos } = req.body;

    try {
        if (!cliente_id) {
            return res.status(400).json({ mensagem: 'O id do cliente é obrigatório' });
        }

        if (pedido_produtos.length === 0 || !pedido_produtos) {
            return res.status(400).json({ mensagem: 'O pedido é obrigatório' });
        }

        for (const produto of pedido_produtos) {
            if (!produto.produto_id || isNaN(produto.produto_id)) {
                return res.status(400).json({ mensagem: 'O id do produto é obrigatório e deve ser um número' });
            }
            if (!produto.quantidade_produto || isNaN(produto.quantidade_produto)) {
                return res.status(400).json({ mensagem: 'A quantidade do produto é obrigatória e deve ser um número' });
            }
        }
        next()
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' })
    }

}

module.exports = {
    validarCadastroPedido
}