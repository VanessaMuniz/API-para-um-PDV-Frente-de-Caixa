const knex = require('../bancodedados/conexao');
const { enviar } = require('../utilidades/email');


const cadastrarPedido = async (req, res) => {
    const { cliente_id, observacao, pedido_produtos } = req.body;

    try {
        const clienteExistente = await knex('clientes').where('id', cliente_id);
        if (!clienteExistente) {
            return res.status(404).json({ mensagem: 'Cliente não encontrado' });
        }

        for (const produto of pedido_produtos) {
            const produtoExistente = await knex('produtos').where('id', produto.produto_id).first();
            if (!produtoExistente || produtoExistente.length === 0) {
                return res.status(404).json({ mensagem: `O id ${produto.produto_id} não foi encontrado` });
            }
            if (produtoExistente.quantidade_estoque <= produto.quantidade_produto) {
                return res.status(404).json({ mensagem: `A quantidade deve ser menor ou igual ao estoque` });
            }

        }

        let valor_total = 0;

        for (const produto of pedido_produtos) {
            const precoProduto = await knex('produtos').where("id", produto.produto_id);
            let valorTotalProduto = produto.quantidade_produto * Number(precoProduto[0].valor)
            valor_total += valorTotalProduto;
        }

        const pedidos = await knex('pedidos').insert({
            cliente_id,
            observacao,
            valor_total,
        }).returning('*')

        const [pedido] = pedidos

        for (const produto of pedido_produtos) {
            const precoProduto = await knex('produtos').where("id", produto.produto_id);
            let valorTotalProduto = produto.quantidade_produto * Number(precoProduto[0].valor);
            await knex('pedido_produtos').insert({
                pedido_id: pedido.id,
                produto_id: produto.produto_id,
                quantidade_produto: produto.quantidade_produto,
                valor_produto: valorTotalProduto
            })
        }

        enviar(req.usuario.nome, req.usuario.email)
        return res.status(201).json({ mensagem: "Pedido cadastrado com sucesso" })

    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' })
    }

}

const listarPedido = async (req, res) => {
    const { cliente_id } = req.query;
    let pedidoFinal = [];

    try {
        if (!cliente_id) {
            pedidoFinal = await knex('pedidos');
        } else {
            pedidoFinal = await knex('pedidos').where("cliente_id", cliente_id);
        }
        let todosOsPedidos = [];
        for (const pedido of pedidoFinal) {
            const produtosPedidos = await knex('pedido_produtos').where("pedido_id", pedido.id);
            todosOsPedidos.push({ pedido, produtosPedidos })
        }
        return res.status(200).json(todosOsPedidos)

    } catch (error) {
        console.log(error)
        return res.status(500).json({ mensagem: 'Erro interno do servidor' })
    }
}

module.exports = {
    cadastrarPedido,
    listarPedido
}