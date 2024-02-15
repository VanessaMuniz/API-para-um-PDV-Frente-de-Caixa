const knex = require('../bancodedados/conexao');
const { deletarArquivo } = require('../utilidades/deletararquivo');
const { uploadImagem } = require('../utilidades/uploadarquivos');


const cadastrarProduto = async (req, res) => {
    const { descricao, quantidade_estoque, valor, categoria_id } = req.body;
    try {
        const categoria = await knex('categorias').where('id', categoria_id);
        if (!categoria || categoria.length === 0) {
            return res.status(404).json({ mensagem: 'Categoria não encontrada' });
        }

        const urlPublica = await uploadImagem(req, res)
        const produto = {
            descricao,
            quantidade_estoque,
            valor,
            categoria_id,
            produto_imagem: urlPublica
        }
        await knex('produtos').insert(produto);
        const novoRegistro = await knex('produtos').orderBy('id', 'desc').first();
        return res.status(201).json({ novoRegistro });

    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' })
    }

}

const editarDadosProduto = async (req, res) => {
    const { id } = req.params;
    const { descricao, quantidade_estoque, valor, categoria_id } = req.body;
    try {

        const idExistente = await knex('produtos').where("id", id);

        if (!idExistente || idExistente.length === 0) {
            return res.status(400).json({ mensagem: 'id não encontrado' });
        }

        if (!descricao || !quantidade_estoque || !valor || !categoria_id) {
            return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios' });
        }

        const categoria = await knex('categorias').where('id', categoria_id);
        if (!categoria || categoria.length === 0) {
            return res.status(404).json({ mensagem: 'Categoria não encontrada' });
        }
        const urlPublica = await uploadImagem(req, res);
        let url = urlPublica
        if (idExistente[0].produto_imagem || idExistente[0].produto_imagem.length === 0 && urlPublica) {
            await deletarArquivo(req, res)
        }
        if (!urlPublica) {
            url = idExistente[0].produto_imagem
        }
        const produto = {
            descricao,
            quantidade_estoque,
            valor,
            categoria_id,
            produto_imagem: url
        };

        await knex('produtos').update(produto).where('id', id);
        res.status(200).json(produto);
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' });
    }
}

const listarProduto = async (req, res) => {
    const { categoria_id } = req.query;

    try {
        if (!categoria_id) {
            const produtos = await knex('produtos');
            return res.status(200).json(produtos);
        }

        const idCategoriaExistente = await knex('produtos').where("categoria_id", categoria_id);

        if (!idCategoriaExistente || idCategoriaExistente.length === 0) {
            return res.status(404).json({ mensagem: 'Categoria não encontrada' });
        }

        const produtosComCategoria = await knex('produtos').where('categoria_id', categoria_id)
        return res.status(200).json(produtosComCategoria);

    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' })
    }

}

const detalharProduto = async (req, res) => {
    const { id } = req.params;
    try {
        const idProdutoExistente = await knex('produtos').where('id', id);
        if (!idProdutoExistente || idProdutoExistente.length === 0) {
            return res.status(404).json({ mensagem: 'Produto não encontrado' });
        }

        return res.status(200).json(idProdutoExistente);
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' })
    }

}

const excluirProduto = async (req, res) => {
    const { id } = req.params;
    try {
        const idProdutoExistente = await knex('produtos').where('id', id);
        if (!idProdutoExistente || idProdutoExistente.length === 0) {
            return res.status(404).json({ mensagem: 'Produto não encontrado' });
        }
        const produtoFoiPedido = await knex('pedido_produtos').where('produto_id', id)
        if (produtoFoiPedido.length > 0) {
            return res.status(403).json({ mensagem: 'Produto registrado no pedido' })
        }
        await deletarArquivo(req, res)
        await knex('produtos').delete('id').where('id', id);
        return res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' })
    }
}



module.exports = {
    cadastrarProduto,
    editarDadosProduto,
    listarProduto,
    detalharProduto,
    excluirProduto
}