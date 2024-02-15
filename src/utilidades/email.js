const { transportador } = require("../services/nodemailer")

const enviar = (nome, email) => {
    transportador.sendMail({
        from: `Lady's bug" <${process.env.EMAIL_FROM}>`,
        to: `${nome} <${email}>`,
        subject: "Pedido cadastrado",
        text: `Seu pedido foi cadastrado com sucesso!`
    })
}

module.exports = { enviar }