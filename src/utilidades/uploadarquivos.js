const {
    PutObjectCommand,
} = require("@aws-sdk/client-s3");

const { v4: uuidv4 } = require('uuid');
const { s3Client } = require("../services/s3client");


const uploadImagem = async (req, res) => {
    try {
        if (!req.file) {
            return null
        }
        const Key = `produtos/${uuidv4()}`
        const arquivo = await s3Client.send(
            new PutObjectCommand({
                Bucket: process.env.BB_NAME,
                Key,
                Body: req.file.buffer,
                ContentType: req.file.mimetype,
            })
        );
        const urlPublica = `https://${process.env.BB_NAME}.${process.env.BB_ENDPOINT}/${Key}`;

        return urlPublica;
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' })
    }
}

module.exports = { uploadImagem };
