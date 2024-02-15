const {
    DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const knex = require("../bancodedados/conexao");

const { s3Client } = require("../services/s3client");

const deletarArquivo = async (req, res) => {
    try {
        const { id } = req.params;
        const url = await knex('produtos').where("id", id);
        const imagem = url[0].produto_imagem
        const Key = imagem.split('/').slice(-2).join('/')
        const arquivo = await s3Client.send(
            new DeleteObjectCommand({
                Bucket: process.env.BB_NAME,
                Key,
            })
        );
        return arquivo
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    deletarArquivo
}

