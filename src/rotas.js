const express = require('express');
const multer = require("multer");
const listarCategorias = require('./controladores/categorias');
const { cadastrarCliente, editarDadosCliente, listarClientes, detalharCliente } = require('./controladores/cliente');
const { cadastrarPedido, listarPedido } = require('./controladores/pedidos');
const { cadastrarProduto, editarDadosProduto, listarProduto, detalharProduto, excluirProduto } = require('./controladores/produto');
const { cadastrarUsuario, login, detalharUsuario, editarUsuario } = require('./controladores/usuario');
const { validarCadastroPedido } = require('./intermediarios/validacaopedidos');
const { validarCadastroProduto } = require('./intermediarios/validacaoproduto');
const { validarUsuario } = require('./intermediarios/validacaousuario');
const { filtrarAutenticacao } = require('./intermediarios/validarToken');

const rotas = express();

const upload = multer({});

rotas.get('/categoria', listarCategorias);
rotas.post('/usuario', validarUsuario, cadastrarUsuario);
rotas.post('/login', login);
rotas.use(filtrarAutenticacao)
rotas.get('/usuario', detalharUsuario);
rotas.put('/usuario', validarUsuario, editarUsuario);
rotas.post('/produto', upload.single('produto_imagens'), validarCadastroProduto, cadastrarProduto);
rotas.put('/produto/:id', upload.single('produto_imagem'), editarDadosProduto);
rotas.get('/produto', listarProduto);
rotas.get('/produto/:id', detalharProduto);
rotas.delete('/produto/:id', excluirProduto);
rotas.post('/cliente', cadastrarCliente);
rotas.put('/cliente/:id', editarDadosCliente);
rotas.get('/cliente', listarClientes);
rotas.get('/cliente/:id', detalharCliente);
rotas.post('/pedido', validarCadastroPedido, cadastrarPedido);
rotas.get('/pedido', listarPedido);

module.exports = rotas;